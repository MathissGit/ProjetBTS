import 'package:http/http.dart' as http;
import 'package:mobile/config/config.dart';
import 'package:http/io_client.dart';
import 'dart:io';

class API {
  static Future<http.Response> getProducts() async {
    final ioClient = HttpClient();
    ioClient.badCertificateCallback = (X509Certificate cert, String host, int port) => true;
    final client = IOClient(ioClient);

    final uri = Uri.parse("${Config.apiUrl}/produits");
    return client.get(uri, headers: {'Content-Type': 'application/json'});
  }

  static Future<http.Response> getImageProduct(int productId) async {
    final ioClient = HttpClient();
    ioClient.badCertificateCallback = (X509Certificate cert, String host, int port) => true;
    final client = IOClient(ioClient);

    final uri = Uri.parse("${Config.apiUrl}/images/$productId");
    return client.get(uri, headers: {'Content-Type': 'application/json'});
  }
}
