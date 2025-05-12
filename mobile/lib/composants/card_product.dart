import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/data/services/cart_service.dart';
import 'package:mobile/data/models/product_data.dart';

class CardProduct extends StatefulWidget {
  final ProductData product;
  const CardProduct({super.key, required this.product});

  @override
  State<CardProduct> createState() => _CardProductState();
}

class _CardProductState extends State<CardProduct> {
  int _quantity = 1;

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
                widget.product.image != null
                    ? Image.memory(
                      base64Decode(widget.product.image!),
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
                  widget.product.nom,
                  style: TextStyle(
                    fontSize: 24,
                    color: Colors.grey.shade900,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  widget.product.description,
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade900),
                ),
                const SizedBox(height: 10),
                Text(
                  '${widget.product.prix.toStringAsFixed(2)} €',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color.fromRGBO(108, 88, 76, 1),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Text("Quantité :"),
                    const SizedBox(width: 8),
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        color: Colors.white,
                        border: Border.all(color: Colors.grey.shade400),
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove),
                            onPressed: () {
                              setState(() {
                                if (_quantity > 1) _quantity--;
                              });
                            },
                          ),
                          Text(
                            '$_quantity',
                            style: const TextStyle(fontSize: 18),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add),
                            onPressed: () {
                              setState(() {
                                _quantity++;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                    ElevatedButton(
                      onPressed: () {
                        final CartService cartService = CartService();
                        cartService.addToCart(widget.product, _quantity);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              '$_quantity x ${widget.product.nom} ajouté au panier',
                            ),
                            backgroundColor: Colors.green,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orangeAccent,
                      ),
                      child: const Text(
                        "Ajouter au panier",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
