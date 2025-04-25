"use client";
import { useEffect, useState } from 'react';

export default function Produit() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
    
    if (token) {
          setIsAuthenticated(true); 
    } else {
          setIsAuthenticated(false); 
        }
    }, []);
    return <main>
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            
            {!isAuthenticated ? (
                <>
                <div className="border border-black p-8 rounded-lg mx-auto space-y-6">
                <h2 className="text-2xl font-semibold text-center text-black mb-6">Se Connecter</h2>
                </div>
                </>
            ) : (
                <div className="border border-black p-8 rounded-lg mx-auto space-y-6">
                    <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
                        <a href='/monEspace/produits/createProduit'>
                            <h2 className="text-xl font-semibold text-black">(TODO) Créer un produit</h2>
                        </a>
                    </section>
                    <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
                        <a href='/monEspace/produits/deleteProduit'>
                            <h2 className="text-xl font-semibold text-black">Supprimer un produit</h2>
                        </a>
                    </section>
                    <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
                        <a href='/monEspace/produits/updateProduit'>
                            <h2 className="text-xl font-semibold text-black">(TODO) Modifier les details d'un produit</h2>
                        </a>
                    </section>
                    <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
                        <a href='/monEspace/produits/updateStock'>
                            <h2 className="text-xl font-semibold text-black">Gérer les stocks</h2>
                        </a>
                    </section>
                </div>
            )}
        </div>
        </div>
    </main>
}