'use client'
import React, { useEffect, useState } from 'react';
import { updateReservationAction } from './update-reservation.action';
import { listReservations } from '../../utils/listReservations';
import { listStatusReservations } from '../../utils/listStatusReservations';

export default function UpdatereservationList() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [formValues, setFormValues] = useState<{ [key: number]: string }>({});
    const [availableStatus, setAvailableStatus] = useState<{ id: string, label: string }[]>([]);

    useEffect(() => {
        async function fetchReservation() {
            setLoading(true);
            setError('');

            try {
                const reservations = await listReservations();
                const statusReservations = await listStatusReservations();

                setReservations(reservations);

                const statusSet = new Map<string, string>();
                statusReservations.forEach((status: { id: string, label: string }) => {
                    statusSet.set(status.id, status.label);
                });

                setAvailableStatus(Array.from(statusSet, ([id, label]) => ({ id, label })));

                const initialFormValues: { [key: number]: string } = {};
                reservations.forEach((reservation: any) => {
                    initialFormValues[reservation.id] = reservation.statusReservation?.id || '';
                });
                setFormValues(initialFormValues);
            } catch (error: any) {
                setError(error.message);
            }

            setLoading(false);
        }

        fetchReservation();
    }, []);

    const handleInputChange = (id: number, value: string) => {
        setFormValues(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleReservationValidation = async (id: number) => {
        const newStatus = formValues[id];

        const success = await updateReservationAction(id, newStatus);

        if (success) {
            alert('Status mis à jour avec succès !');

            // Mise a jour de l'etat
            setReservations(prev =>
                prev.map(reservation =>
                    reservation.id === id
                        ? { ...reservation, statusReservation: { id: newStatus } }
                        : reservation
                )
            );
        } else {
            alert('Erreur lors de la mise à jour du status.');
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center text-yellow-700">Mise à jour des réservations</h1>

            {loading && <p className="text-yellow-700 text-center">Chargement...</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
            {!loading && !error && reservations.length === 0 && (
                <p className="text-center">Aucune réservation trouvée.</p>
            )}

            <div className="space-y-4 justify-center items-center">
                {reservations.map((reservation) => (
                    <div
                        key={reservation.id}
                        className="p-4 border flex justify-between border-black rounded-lg items-center"
                    >
                        <h3 className="text-xl font-semibold pl-6 pe-6">
                            {reservation.id}
                        </h3>
                        <p>{new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}</p>

                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="font-semibold pl-16 text-black">Status : </label>
                                <select
                                    value={formValues[reservation.id]}
                                    onChange={(e) =>
                                        handleInputChange(reservation.id, e.target.value)
                                    }
                                    className="w-fit p-2 border border-black rounded-lg"
                                >
                                    {availableStatus.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => handleReservationValidation(reservation.id)}
                                className="bg-green-600 hover:bg-green-700 rounded-lg p-2 border text-white border-black"
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
