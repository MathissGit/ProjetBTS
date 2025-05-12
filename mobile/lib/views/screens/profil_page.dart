import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/io_client.dart';
import 'package:mobile/views/screens/login_page.dart';
import 'package:mobile/views/screens/registre_page.dart';
import 'package:mobile/views/widget_tree.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/config/config.dart';

class ProfilPage extends StatefulWidget {
  const ProfilPage({super.key});

  @override
  State<ProfilPage> createState() => _ProfilPageState();
}

class _ProfilPageState extends State<ProfilPage> {
  Map<String, dynamic>? user;
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isEditingPassword = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  _loadUserData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userData = prefs.getString('user');

    if (userData != null) {
      setState(() {
        user = jsonDecode(userData);
      });
    }
  }

  Future<void> _updatePassword(String oldPassword, String newPassword) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userData = jsonDecode(prefs.getString('user')!);
      final token = userData['token'];

      final ioClient = HttpClient();
      ioClient.badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
      final client = IOClient(ioClient);

      final url = Uri.parse(
        '${Config.apiUrl}/utilisateurs/${userData['id']}/password',
      );
      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };

      final body = jsonEncode({
        'ancienPassword': oldPassword,
        'nouveauPassword': newPassword,
      });

      final response = await client.put(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Mot de passe mis à jour avec succès')),
        );
        setState(() {
          _isEditingPassword = false;
        });
      } else if (response.statusCode == 401) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ancien mot de passe incorrect')),
        );
      } else if (response.statusCode == 400) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Ancien et nouveau mot de passe sont requis'),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Erreur serveur. Réessayez plus tard')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erreur serveur. Réessayez plus tard')),
      );
      debugPrint('Erreur lors de la mise à jour du mot de passe: $e');
    }
  }

  Future<void> _deleteAccount() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userData = jsonDecode(prefs.getString('user')!);
      final token = userData['token'];

      final ioClient = HttpClient();
      ioClient.badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
      final client = IOClient(ioClient);

      final url = Uri.parse('${Config.apiUrl}/utilisateurs/${userData['id']}');
      final headers = {'Authorization': 'Bearer $token'};

      final response = await client.delete(url, headers: headers);

      if (response.statusCode == 204 || response.statusCode == 200) {
        await prefs.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Compte supprimé avec succès')),
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Erreur lors de la suppression du compte'),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erreur serveur. Réessayez plus tard')),
      );
      debugPrint('Erreur lors de la suppression du compte: $e');
    }
  }

  void _confirmDeleteAccount() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirmer la suppression'),
          content: const Text(
            'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Annuler'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () {
                Navigator.of(context).pop();
                _deleteAccount();
              },
              child: const Text('Supprimer'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.fromRGBO(108, 88, 76, 1),
              Color.fromRGBO(169, 132, 103, 1),
            ],
          ),
        ),
        child:
            user != null
                ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 100),
                    const Icon(
                      Icons.account_circle,
                      size: 100,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 20),

                    Text(
                      'Bienvenue ${user!['prenom']} ${user!['nom']}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 34,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 60),
                    _isEditingPassword
                        ? Expanded(
                          child: Container(
                            decoration: const BoxDecoration(
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(50),
                                topRight: Radius.circular(50),
                              ),
                              color: Colors.white,
                            ),
                            width: double.infinity,
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 30,
                              ),
                              child: SingleChildScrollView(
                                child: Column(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    TextFormField(
                                      controller: _oldPasswordController,
                                      obscureText: true,
                                      decoration: const InputDecoration(
                                        label: Text(
                                          'Ancien mot de passe',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Color.fromRGBO(
                                              108,
                                              88,
                                              76,
                                              1,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    TextFormField(
                                      controller: _newPasswordController,
                                      obscureText: true,
                                      decoration: const InputDecoration(
                                        label: Text(
                                          'Nouveau mot de passe',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Color.fromRGBO(
                                              108,
                                              88,
                                              76,
                                              1,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    TextFormField(
                                      controller: _confirmPasswordController,
                                      obscureText: true,
                                      decoration: const InputDecoration(
                                        label: Text(
                                          'Confirmer le mot de passe',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Color.fromRGBO(
                                              108,
                                              88,
                                              76,
                                              1,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 30),
                                    SizedBox(
                                      height: 60,
                                      width: 300,
                                      child: ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color.fromRGBO(
                                            108,
                                            88,
                                            76,
                                            1,
                                          ),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              30,
                                            ),
                                          ),
                                        ),
                                        onPressed: () {
                                          if (_newPasswordController.text ==
                                              _confirmPasswordController.text) {
                                            _updatePassword(
                                              _oldPasswordController.text,
                                              _newPasswordController.text,
                                            );
                                          } else {
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              const SnackBar(
                                                content: Text(
                                                  'Les mots de passe ne correspondent pas',
                                                ),
                                              ),
                                            );
                                          }
                                        },
                                        child: const Text(
                                          'ENREGISTRER',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 22,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    TextButton(
                                      onPressed: () {
                                        setState(() {
                                          _isEditingPassword = false;
                                        });
                                      },
                                      child: const Text(
                                        'Annuler',
                                        style: TextStyle(
                                          color: Color.fromRGBO(108, 88, 76, 1),
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        )
                        : Column(
                          children: [
                            ElevatedButton(
                              onPressed: () {
                                setState(() {
                                  _isEditingPassword = true;
                                });
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color.fromRGBO(
                                  255,
                                  230,
                                  167,
                                  1,
                                ),
                              ),
                              child: const Text(
                                'Modifier mon mot de passe',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            ElevatedButton(
                              onPressed: _confirmDeleteAccount,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color.fromRGBO(
                                  255,
                                  230,
                                  167,
                                  1,
                                ),
                              ),
                              child: const Text(
                                'Supprimer mon compte',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                            const SizedBox(height: 100),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red.shade500,
                              ),
                              onPressed: () async {
                                SharedPreferences prefs =
                                    await SharedPreferences.getInstance();
                                await prefs.clear();
                                setState(() {
                                  user = null;
                                });
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => WidgetTree(),
                                  ),
                                );
                              },
                              child: const Text(
                                'Déconnexion',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                          ],
                        ),
                  ],
                )
                : Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 100),
                      child: Image(
                        width: 220,
                        image: AssetImage('assets/images/brasserie_logo.png'),
                      ),
                    ),
                    SizedBox(height: 50),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Text(
                        textAlign: TextAlign.center,
                        'Connectez-vous ou créez un compte pour pouvoir réserver.',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    SizedBox(height: 60),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => LoginPage()),
                        );
                      },
                      child: Container(
                        height: 60,
                        width: 320,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(color: Colors.white),
                        ),
                        child: Center(
                          child: Text(
                            'CONNEXION',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 30),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => RegistrePage(),
                          ),
                        );
                      },
                      child: Container(
                        height: 60,
                        width: 320,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(color: Colors.white),
                        ),
                        child: Center(
                          child: Text(
                            'INSCRIPTION',
                            style: TextStyle(
                              color: Color.fromRGBO(108, 88, 76, 1),
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
      ),
    );
  }
}
