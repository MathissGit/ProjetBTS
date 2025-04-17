export async function listUsers() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Token d'authentification non trouvé");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/utilisateurs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        throw new Error(
            data.message || "Erreur lors de la récupération des utilisateurs"
        );
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw new Error("Erreur réseau ou serveur");
  }
}