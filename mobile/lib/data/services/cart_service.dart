import 'package:flutter/material.dart';
import 'package:mobile/data/notifiers.dart';
import '../models/cart_item.dart';
import '../models/product_data.dart';

class CartService extends ChangeNotifier {
  List<CartItem> get items => List.unmodifiable(cartNotifier.value);

  void addToCart(ProductData product, int quantity) {
    final index = cartNotifier.value.indexWhere(
      (item) => item.product.id == product.id,
    );
    if (index >= 0) {
      cartNotifier.value[index].quantity += quantity;
    } else {
      cartNotifier.value.add(CartItem(product: product, quantity: quantity));
    }
    cartNotifier.notifyListeners();
  }

  void removeFromCart(int productId) {
    cartNotifier.value.removeWhere((item) => item.product.id == productId);
    cartNotifier.notifyListeners();
  }

  void clearCart() {
    cartNotifier.value.clear();
    cartNotifier.notifyListeners();
  }

  List<Map<String, dynamic>> getCartJson() {
    return cartNotifier.value.map((item) => item.toJson()).toList();
  }
}
