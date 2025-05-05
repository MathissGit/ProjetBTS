class ProductData {
  int id;
  String nom;
  double prix;
  String description;
  int stock;
  String? image;

  ProductData(
    this.id,
    this.nom,
    this.prix,
    this.description,
    this.stock,
    this.image,
  );

  factory ProductData.fromJson(Map<String, dynamic> json) {
    return ProductData(
      json['id'],
      json['nom'],
      (json['prix'] as num).toDouble(),
      json['description'],
      json['stock'],
      null,
    );
  }
}
