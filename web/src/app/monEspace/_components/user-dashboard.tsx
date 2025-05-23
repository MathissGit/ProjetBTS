'use client';
import React from 'react';
import {handleUserDeconnection} from '../_actions/user-deconnection'

export default function AdminPage() {
  return (
    <main className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-yellow-700">Espace Administrateur</h1>

      <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
        <a href="/monEspace/produits">
            <h2 className="text-xl font-semibold mb-4 text-black">Gestion des produits</h2>
            <p className="text-gray-800">Créer un produit, modifier un produit et son stock, supprimer des produits</p>
        </a>
      </section>

      <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
        <a href="/monEspace/comptes">
            <h2 className="text-xl font-semibold mb-4 text-black">Gestion des comptes clients</h2>
            <p className="text-gray-800">Créer, supprimez ou modifier des comptes utilisateurs</p>
        </a>
      </section>

      <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
        <a href="/monEspace/reservations">
            <h2 className="text-xl font-semibold mb-4 text-black">Gestion des réservations</h2>
            <p className="text-gray-800">Mise à jour des reservations, création ou suppression d'une réservations</p>
        </a>
      </section>
      <section className='p-3 rounded-lg w-fit bg-red-600 hover:bg-red-700 border border-black'>
        <button onClick={handleUserDeconnection} className='text-xl text-white'>
            Déconnexion
        </button>
      </section>
    </main>
  );
}
