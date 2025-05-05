import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/composants/banner_home.dart';
import 'package:mobile/composants/card_product.dart';
import 'package:mobile/data/models/product_data.dart';
import 'package:mobile/data/services/api.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<ProductData> _products = [];
  bool _loading = true;

  _getData() async {
  try {
    var response = await API.getProducts();

    if (response.statusCode == 200) {
      Iterable list = json.decode(response.body);
      List<ProductData> loadedProducts = list.map((model) => ProductData.fromJson(model)).toList();

      for (var product in loadedProducts) {
        var imageResponse = await API.getImageProduct(product.id);
        if (imageResponse.statusCode == 200) {
          final bytes = imageResponse.bodyBytes;
          product.image = base64Encode(bytes);
        }
      }

      setState(() {
        _products = loadedProducts;
        _loading = false;
      });
    } else {
      throw Exception('Erreur récupération des données');
    }
  } catch (e) {
    setState(() {
      _loading = false;
    });
    debugPrint('Erreur: $e');
  }
}



  @override
  void initState() {
    super.initState();
    _getData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.fromRGBO(108, 88, 76, 1),
              Color.fromRGBO(169, 132, 103, 1),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child:
            _loading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                  padding: EdgeInsets.zero,
                  itemCount: _products.length + 1,
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      return const Bannerhome(); 
                    } else {
                      return CardProduct(product: _products[index - 1]);
                    }
                  },
                ),
      ),
    );
  }
}
