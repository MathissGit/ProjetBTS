import 'package:mobile/data/models/product_data.dart';

class CartItem {
  final ProductData product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});

  Map<String, dynamic> toJson() => {
    'idProduit': product.id,
    'quantite': quantity,
  };
}
