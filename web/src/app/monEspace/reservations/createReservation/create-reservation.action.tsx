export async function createReservationAction(reservationData) {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token d'authentification non trouvé");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });

    if (response.ok) return true;

    const data = await response.json();
    throw new Error(data.message || "Erreur lors de la création de la réservation");
  } catch (error) {
    console.error("Erreur de création:", error);
    return false;
  }
}
