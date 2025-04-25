export async function UpdateProductAction(id: number, data: { nom: string; prix: number; stock: number }) {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token manquant");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produits/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (err) {
    console.error("Erreur mise à jour produit :", err);
    return false;
  }
}
