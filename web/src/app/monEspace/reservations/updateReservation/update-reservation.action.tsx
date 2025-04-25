export async function updateReservationAction(id: number, newStatus: string) {
    try {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            throw new Error('Token d\'authentification non trouvé');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ statusReservation: newStatus }) 
        });
  
        if (response.ok) {
            return true; 
        } else {
            const data = await response.json();
            throw new Error(data.message || 'Erreur lors de la mise à jour du produit');
        }
    } catch (error) {
        console.error('Erreur de mise à jour:', error);
        return false; 
    }
}
