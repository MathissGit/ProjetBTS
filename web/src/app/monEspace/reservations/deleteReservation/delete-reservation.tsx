"use client";
import React, { useEffect, useState } from "react";
import { DeleteReservationAction } from "./delete-reservation.action";
import { listReservations } from "../../utils/listReservations";

export default function DeleteReservation() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchReservations() {
        setLoading(true);
        setError("");

        try {
            const res = await listReservations();
            setReservations(res);
        } catch (error: any) {
            setError(error.message || "Erreur lors du chargement.");
        }

        setLoading(false);
        }

        fetchReservations();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?");

        if (confirmed) {
        const success = await DeleteReservationAction(id);
        if (success) {
            alert("Réservation supprimée avec succès !");
            setReservations(reservations.filter((r) => r.id !== id));
        } else {
            alert("Erreur lors de la suppression de la réservation.");
        }
        }
    };

    return (
        <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Liste des réservations</h1>

        {loading && <p className="text-yellow-700 text-center">Chargement...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {!loading && !error && reservations.length === 0 && (
            <p className="text-center">Aucune réservation trouvée.</p>
        )}

        <div className="space-y-4">
            {reservations.map((r) => {
            const isPending = r.statusReservation?.id === 2;
            const lastModifDate = new Date(r.derniersModifStatus);
            const fifteenDaysAgo = new Date();
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
            const showAlert = isPending && lastModifDate < fifteenDaysAgo;

            return (
                <div
                key={r.id}
                className="p-4 border flex flex-col sm:flex-row justify-between border-black rounded-lg gap-4"
                >
                    <div>
                        <h3 className="text-xl font-semibold">
                        {r.nom} {r.prenom}
                        </h3>
                        <p className="text-black">Email : <u className="text-gray-700">{r.idUtilisateur?.email}</u></p>
                        <p className="text-black">Date de réservation : <u className="text-gray-700">{new Date(r.date_reservation).toLocaleDateString()}</u></p>
                        <p className="text-black">Statut : <u className="text-gray-700">{r.statusReservation?.label ?? "N/A"}</u></p>
                    </div>

                    {showAlert && (
                        <p className="text-red-600 font-semibold mt-2">
                            En attente depuis plus de 15 jours.
                        </p>
                        )}

                    <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-600 hover:bg-red-500 text-white rounded-lg p-2 border border-black"
                    >
                        Supprimer la réservation
                    </button>
                </div>
            );
            })}
        </div>
        </div>
    );
}
