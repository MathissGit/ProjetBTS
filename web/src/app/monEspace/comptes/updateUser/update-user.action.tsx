export async function updateUserAction(id: number, newEmail: string, newRoles: string) {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ email: newEmail, roles: newRoles })
      });
  
      if (response.ok) {
        return true; 
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la mise à jour de l’utilisateur');
      }
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      return false; 
    }
}
