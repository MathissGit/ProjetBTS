export async function createUserAction(
  nom: string,
  prenom: string,
  email: string,
  password: string,
  roles: string[]
) {
  try {
    const token = localStorage.getItem("auth_token");

    if (!token) throw new Error("Token d'authentification non trouvé");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/utilisateurs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, prenom, email, password, roles }),
      }
    );

    if (response.ok) return true;

    const data = await response.json();
    throw new Error(
      data.message || "Erreur lors de la création de l’utilisateur"
    );
  } catch (error) {
    console.error("Erreur de création:", error);
    return false;
  }
}
