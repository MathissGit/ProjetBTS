class LoginData {
  int id;
  String token;
  List<String> roles;
  String email;
  String nom;
  String prenom;

  LoginData(
    this.id,
    this.token,
    this.roles,
    this.email,
    this.nom,
    this.prenom,
  );

  factory LoginData.fromJson(Map<String, dynamic> json) {
    final utilisateur = json['utilisateur'];
    return LoginData(
      utilisateur['id'],
      json['token'],
      List<String>.from(utilisateur['roles']),
      utilisateur['email'],
      utilisateur['nom'],
      utilisateur['prenom'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'token': token,
        'roles': roles,
        'email': email,
        'nom': nom,
        'prenom': prenom,
      };
}
