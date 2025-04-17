'use client';
import React, { useState } from 'react';
import { handleUserConnection } from '../_actions/user-connection.action';

export default function UserConnectionForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const result = await handleUserConnection(email, password);

    if (result.success) {
      window.location.href = result.redirect;
    } else {
      setErrorMessage(result.message);
    }

    setLoading(false);
  };

  return (
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
  );
}
