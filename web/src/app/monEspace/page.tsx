'use client';
import React, { useState } from 'react';

export default function MonEspace() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateurs/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        window.location.href = data.redirect || '/';
      } else {
        setErrorMessage(data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setErrorMessage('Erreur de connexion. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border border-black p-8 rounded-lg mx-auto">
            <h2 className="text-2xl font-semibold text-center text-black mb-6">Se Connecter</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Adresse Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-yellow-700"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-black">
                  Mot de Passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-yellow-700"
                />
              </div>

              {loading && <p className="text-yellow-700 text-center">Chargement...</p>}
              {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2 bg-yellow-700 text-white font-semibold rounded-md hover:bg-yellow-800"
              >
                Se Connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
