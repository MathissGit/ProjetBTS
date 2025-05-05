import 'package:flutter/material.dart';

class ForgotenPasswordPage extends StatelessWidget {
  const ForgotenPasswordPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            height: double.infinity,
            width: double.infinity,
            decoration: BoxDecoration(
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
                Padding(padding: EdgeInsets.only(top: 40)),
                IconButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: Icon(
                    Icons.keyboard_backspace,
                    color: Colors.white,
                    size: 40,
                  ),
                ),
                SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.only(left: 20.0),
                  child: Text(
                    'Mot de passe\nOublié',
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
              decoration: BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(50),
                  topRight: Radius.circular(50),
                ),
                color: Colors.white,
              ),
              height: double.infinity,
              width: double.infinity,
              child: Padding(
                padding: const EdgeInsets.only(left: 20, right: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    SizedBox(height: 60),
                    Text('Un email de réinitialisation de mot de passe sera envoyé à cet email s\'il existe.', textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.bold, color: Color.fromRGBO(108, 88, 76, 1), fontSize: 18, ),),
                    SizedBox(height: 20),
                    TextField(
                      decoration: InputDecoration(
                        label: Text(
                          'Email',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color.fromRGBO(108, 88, 76, 1),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    Container(
                      height: 60,
                      width: 300,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        gradient: LinearGradient(
                          colors: [
                            Color.fromRGBO(108, 88, 76, 1),
                            Color.fromRGBO(169, 132, 103, 1),
                          ],
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'CONFIRMER',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 22,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 200),
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
