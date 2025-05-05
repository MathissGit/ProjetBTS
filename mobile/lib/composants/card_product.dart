import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/data/models/product_data.dart';

class CardProduct extends StatelessWidget {
  final ProductData product;

  const CardProduct({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20.0),
        color: const Color.fromRGBO(255, 230, 167, 1),
        boxShadow: [
          BoxShadow(
            blurRadius: 5,
            color: Colors.grey.shade600,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(20.0),
            ),
            child:
                product.image != null
                    ? Image.memory(
                      base64Decode(product.image!),
                      width: double.infinity,
                      height: 150,
                      fit: BoxFit.cover,
                    )
                    : const SizedBox(
                      height: 150,
                      child: Center(child: Icon(Icons.image_not_supported)),
                    ),
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.nom,
                  style: TextStyle(
                    fontSize: 24,
                    color: Colors.grey.shade900,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  product.description,
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade900),
                ),
                const SizedBox(height: 10),
                Text(
                  '${product.prix.toStringAsFixed(2)} €',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color.fromRGBO(108, 88, 76, 1),
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
