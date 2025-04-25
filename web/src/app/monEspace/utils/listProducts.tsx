export async function listProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produits`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Erreur lors de la récupération des produits');
    }
  } catch (error) {
    throw new Error('Erreur réseau ou serveur');
  }
}