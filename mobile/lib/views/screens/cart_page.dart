import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/data/models/cart_item.dart';
import 'package:mobile/data/services/cart_service.dart';
import 'package:mobile/data/notifiers.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/config/config.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  final CartService _cartService = CartService();

  Future<void> _sendReservation() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userData = jsonDecode(prefs.getString('user')!);
      final token = userData['token'];
      final idUtilisateur = userData['id'];

      final response = await http.post(
        Uri.parse('${Config.apiUrl}/reservations'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'idUtilisateur': idUtilisateur,
          'detailReservations': _cartService.getCartJson(),
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        _cartService.clearCart();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Réservation envoyée avec succès')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Erreur lors de la réservation')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Erreur réseau')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mon Panier')),
      body: ValueListenableBuilder<List<CartItem>>(
        valueListenable: cartNotifier,
        builder: (context, cartItems, _) {
          if (cartItems.isEmpty) {
            return const Center(child: Text('Votre panier est vide'));
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: cartItems.length,
                  itemBuilder: (_, index) {
                    final item = cartItems[index];
                    return ListTile(
                      title: Text(item.product.nom),
                      subtitle: Text(
                        '${item.quantity} x ${item.product.prix.toStringAsFixed(2)} €',
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () {
                          _cartService.removeFromCart(item.product.id);
                        },
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: ElevatedButton(
                  onPressed: _sendReservation,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                  ),
                  child: const Text(
                    "Réserver tout le panier",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
