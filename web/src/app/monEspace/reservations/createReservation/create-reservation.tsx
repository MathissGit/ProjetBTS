"use client";
import React, { useEffect, useState } from "react";
import { createReservationAction } from "./create-reservation.action";
import { listProducts } from "../../utils/listProducts";
import { listUsers } from "../../utils/listUsers";

export default function CreateReservation() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [detailReservations, setDetailReservations] = useState<{ idProduit: number | null; quantite: number }[]>([
    { idProduit: null, quantite: 1 }
  ]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await listUsers();
        const products = await listProducts();
        setUsers(users);
        setProducts(products);
      } catch (error) {
        console.error("Erreur chargement users/produits:", error);
      }
    }
  
    fetchData();
  }, []);

  const handleProductChange = (index: number, value: number) => {
    const updated = [...detailReservations];
    updated[index].idProduit = value;
    setDetailReservations(updated);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updated = [...detailReservations];
    updated[index].quantite = value;
    setDetailReservations(updated);
  };

  const addProductLine = () => {
    setDetailReservations([...detailReservations, { idProduit: null, quantite: 1 }]);
  };

  const removeProductLine = (index: number) => {
    const updated = detailReservations.filter((_, i) => i !== index);
    setDetailReservations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser || detailReservations.some(dr => !dr.idProduit || dr.quantite <= 0)) {
      setMessage("Veuillez remplir tous les champs correctement.");
      return;
    }

    const success = await createReservationAction({
      date_reservation: date,
      idUtilisateur: selectedUser,
      idStatus: 1, 
      detailReservations,
    });

    setMessage(success ? "Réservation créée avec succès !" : "Erreur lors de la création de la réservation");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 border border-black rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-yellow-700">Créer une réservation</h2>

      <div>
        <label className="block font-medium">Email</label>
        <select
          value={selectedUser ?? ""}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
          className="w-full border border-black p-2 rounded-lg"
        >
          <option value="" disabled>-- Choisir un email --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <label className="block font-medium">Produits</label>
        {detailReservations.map((detail, index) => (
          <div key={index} className="flex items-center gap-4">
            <select
              value={detail.idProduit ?? ""}
              onChange={(e) => handleProductChange(index, Number(e.target.value))}
              className="flex-1 border border-black p-2 rounded-lg"
            >
              <option value="" disabled>-- Sélectionner un produit --</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nom}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={detail.quantite}
              onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
              className="w-24 border border-black p-2 rounded-lg"
            />

            {detailReservations.length > 1 && (
              <button
                type="button"
                onClick={() => removeProductLine(index)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg border border-black"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addProductLine}
          className="bg-orange-400 hover:bg-amber-600 text-white px-4 py-2 rounded-lg mt-2 border border-black"
        >
          + Ajouter un produit
        </button>
      </div>

      <div>
        <label className="block font-medium">Date de réservation</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-black p-2 rounded-lg"
        />
      </div>

      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full border border-black">
        Créer la réservation
      </button>

      {message && <p className="text-center mt-4">{message}</p>}
    </form>
  );
}
