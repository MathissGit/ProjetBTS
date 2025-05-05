import 'package:flutter/material.dart';

class Bannerhome extends StatelessWidget {
  const Bannerhome({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 250,
      child: Stack(
        children: [
          Image.asset(
            'assets/images/brasserie-header.jpg',
            height: 250,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
          Container(
            height: 250,
            width: double.infinity,
            // ignore: deprecated_member_use
            color: Colors.black.withOpacity(0.5),
          ),
          Center(
            
            child: Column(
              mainAxisSize: MainAxisSize.min,
              
              children: [
                Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Text(
                    'Bienvenue chez\nTerroir & Savoirs',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 40,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
