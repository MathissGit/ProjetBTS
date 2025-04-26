"use client";
import { useEffect, useState } from 'react';

export default function Reservation() {
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
                        <a href='/monEspace/reservations/createReservation'>
                            <h2 className="text-xl font-semibold text-black">Créer une réservation</h2>
                        </a>
                    </section>
                    <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
                        <a href='/monEspace/reservations/updateReservation'>
                            <h2 className="text-xl font-semibold text-black">Mise à jour d'une réservation</h2>
                        </a>
                    </section>
                    <section className="p-6 rounded-lg border border-black hover:bg-gray-100">
                        <a href='/monEspace/reservations/deleteReservation'>
                            <h2 className="text-xl font-semibold text-black">Supprimer une réservation</h2>
                        </a>
                    </section>
                </div>
            )}
        </div>
        </div>
    </main>
}