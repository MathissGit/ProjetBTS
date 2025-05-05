import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/views/screens/login_page.dart';
import 'package:mobile/views/screens/registre_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilPage extends StatefulWidget {
  const ProfilPage({super.key});

  @override
  State<ProfilPage> createState() => _ProfilPageState();
}

class _ProfilPageState extends State<ProfilPage> {
  Map<String, dynamic>? user;

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
                    const Icon(
                      Icons.account_circle,
                      size: 100,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Bienvenue ${user!['prenom']} ${user!['nom']}',
                      style: const TextStyle(color: Colors.white, fontSize: 24),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      user!['email'],
                      style: const TextStyle(color: Colors.white70),
                    ),
                    const SizedBox(height: 40),
                    ElevatedButton(
                      onPressed: () async {
                        SharedPreferences prefs =
                            await SharedPreferences.getInstance();
                        await prefs.clear();
                        setState(() {
                          user = null;
                        });
                      },
                      child: const Text('Déconnexion'),
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
                      padding: const EdgeInsets.only(left: 20, right: 20),
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
