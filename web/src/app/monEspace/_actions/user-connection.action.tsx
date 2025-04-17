async function loginAdmin(email: string, password: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const isAdmin = data.utilisateur?.roles?.includes('ROLE_ADMIN');
  
        if (!isAdmin) {
          return {
                success: false,
                message: "Accès refusé : vous n'avez pas les droits administrateur.",
          };
        }
  
        return {
            success: true,
            redirect: data.redirect || '/',
            token: data.token,
        };
      } else {
        return {
            success: false,
            message: data.message || 'Erreur côté serveur',
        };
      }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        return { success: false, message: 'Erreur réseau ou serveur' };
    }
}
    
  export async function handleUserConnection(email: string, password: string) {
    const result = await loginAdmin(email, password);
  
    if (result.success && result.token) {
      
      localStorage.setItem('auth_token', result.token);
  
      await fetch('/api/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.token }),
      });
    }
  
    return result;
  }
  