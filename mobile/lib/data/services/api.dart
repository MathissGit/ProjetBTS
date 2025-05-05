import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/config/config.dart';
import 'package:shared_preferences/shared_preferences.dart';

class API {
  static Future<String?> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<http.Response> login(Map<String, dynamic> data) async {
    final uri = Uri.parse("${Config.apiUrl}/login");
    final response = await http.post(
      uri,
      body: jsonEncode(data),
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
    );
    return response;
  }

  static Future<http.Response> getProducts() async {
    final uri = Uri.parse("${Config.apiUrl}/produits");
    return http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
      },
    );
  }

  static Future<http.Response> getImageProduct(int productId) async {
    final uri = Uri.parse("${Config.apiUrl}/images/$productId");
    return http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
      },
    );
  }
}
