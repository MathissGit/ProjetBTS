import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/config/config.dart';
import 'dart:convert';

import 'package:mobile/data/models/login_data.dart';
import 'package:mobile/views/screens/forgoten_password_page.dart';
import 'package:mobile/views/screens/registre_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  LoginData? _data;
  bool _loading = false;
  String _email = '';
  String _password = '';

  void _getData(String email, String password) async {
    try {
      final result = await loginUser(email, password);
      if (result != null) {
        setState(() {
          _data = result;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Échec de la connexion. Vérifiez vos identifiants.')),
        );
      }
    } catch (e) {
      print('Erreur lors de la connexion : $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erreur serveur. Réessayez plus tard.')),
      );
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<LoginData?> loginUser(String email, String password) async {
    final url = Uri.parse('${Config.apiUrl}/login');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode({'email': email, 'password': password});

    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      final utilisateur = json['utilisateur'];
      final token = json['token'];

      return LoginData(
        utilisateur['id'],
        token,
        List<String>.from(utilisateur['roles']),
        utilisateur['email'],
        utilisateur['nom'],
        utilisateur['prenom'],
      );
    } else {
      print('Erreur: ${response.statusCode} - ${response.body}');
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    } else if (_data != null) {
      return AuthUserInformationWidget(
        loginData: _data!,
        onLogout: () {
          setState(() {
            _data = null;
          });
        },
      );
    } else {
      return FormAuthWidget(
        onLogin: () {
          setState(() {
            _loading = true;
          });
          _getData(_email, _password);
        },
        onPasswordChange: (value) {
          setState(() {
            _password = value;
          });
        },
        onLoginChange: (value) {
          setState(() {
            _email = value;
          });
        },
      );
    }
  }
}

class FormAuthWidget extends StatelessWidget {
  const FormAuthWidget({
    Key? key,
    required this.onLogin,
    required this.onPasswordChange,
    required this.onLoginChange,
  }) : super(key: key);

  final Function onLogin;
  final Function(String) onPasswordChange;
  final Function(String) onLoginChange;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            height: double.infinity,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color.fromRGBO(108, 88, 76, 1),
                  Color.fromRGBO(169, 132, 103, 1),
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(padding: EdgeInsets.only(top: 40)),
                IconButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: const Icon(
                    Icons.keyboard_backspace,
                    color: Colors.white,
                    size: 40,
                  ),
                ),
                const SizedBox(height: 20),
                const Padding(
                  padding: EdgeInsets.only(left: 20.0),
                  child: Text(
                    'Hello!\nConnexion',
                    style: TextStyle(
                      fontSize: 40,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 260.0),
            child: Container(
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(50),
                  topRight: Radius.circular(50),
                ),
                color: Colors.white,
              ),
              height: double.infinity,
              width: double.infinity,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    const SizedBox(height: 60),
                    TextFormField(
                      onChanged: onLoginChange,
                      decoration: const InputDecoration(
                        label: Text(
                          'Email',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color.fromRGBO(108, 88, 76, 1),
                          ),
                        ),
                      ),
                    ),
                    TextFormField(
                      onChanged: onPasswordChange,
                      obscureText: true,
                      decoration: const InputDecoration(
                        label: Text(
                          'Mot de passe',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color.fromRGBO(108, 88, 76, 1),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Align(
                      alignment: Alignment.centerRight,
                      child: GestureDetector(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => ForgotenPasswordPage(),
                            ),
                          );
                        },
                        child: const Text(
                          'Mot de passe oublié?',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 17,
                            color: Color.fromRGBO(169, 132, 103, 1),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      height: 60,
                      width: 300,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color.fromRGBO(108, 88, 76, 1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        onPressed: () {
                          onLogin();
                        },
                        child: const Text(
                          'CONNEXION',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 22,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 100),
                    Align(
                      alignment: Alignment.bottomRight,
                      child: Column(
                        children: [
                          Text(
                            'Pas encore de compte?',
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => RegistrePage(),
                                ),
                              );
                            },
                            child: const Text(
                              'Créer un compte',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 17,
                                color: Color.fromRGBO(169, 132, 103, 1),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class AuthUserInformationWidget extends StatelessWidget {
  const AuthUserInformationWidget({
    Key? key,
    required this.loginData,
    required this.onLogout,
  }) : super(key: key);

  final LoginData loginData;
  final Function onLogout;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Bienvenue ${loginData.prenom} ${loginData.nom}',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 20),
            Text(
              'Vous êtes connecté',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                onLogout();
              },
              child: const Text('Déconnexion'),
            ),
          ],
        ),
      ),
    );
  }
}
