export async function handleUserDeconnection() {
    try {
      localStorage.removeItem('auth_token');
  
      window.location.href = '/monEspace'; 
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  }
  