import 'package:http/http.dart' as http;
import 'package:mobile/config/config.dart';

class API {
  static Future<http.Response> getProducts() async {
    final uri = Uri.parse("${Config.apiUrl}/produits");
    return http.get(uri, headers: {'Content-Type': 'application/json'});
  }

  static Future<http.Response> getImageProduct(int productId) async {
    final uri = Uri.parse("${Config.apiUrl}/images/$productId");
    return http.get(uri, headers: {'Content-Type': 'application/json'});
  }
}
