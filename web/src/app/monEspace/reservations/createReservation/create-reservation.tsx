"use client";
import React, { useEffect, useState } from "react";
import { createReservationAction } from "./create-reservation.action";
import { listProducts } from "../../utils/listProducts";
import { listUsers } from "../../utils/listUsers";

export default function CreateReservation() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]); // format yyyy-mm-dd
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await listUsers();
        const products = await listProducts();
        setUsers(users);
        setProducts(products);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Erreur chargement users/produits:", error);
      }
    }
  
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser || !selectedProduct || quantity <= 0) {
      setMessage("Veuillez remplir tous les champs correctement.");
      return;
    }

    const success = await createReservationAction({
      date_reservation: date,
      idUtilisateur: selectedUser,
      idStatus: 1, 
      detailReservations: [
        {
          idProduit: selectedProduct,
          quantite: quantity,
        },
      ],
    });

    setMessage(success ? "Réservation créée avec succès !" : "Erreur lors de la création de la réservation");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border border-black rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-center">Créer une réservation</h2>

      <div>
      <label className="block font-medium">Email</label>
        <select
          value={selectedUser ?? ""}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
          className="w-full border border-black p-2 rounded"
        >
          <option value="" disabled>
            -- choisir un email --
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      <div>
      <label className="block font-medium">Produit</label>
        <select
          value={selectedProduct ?? ""}
          onChange={(e) => setSelectedProduct(Number(e.target.value))}
          className="w-full border border-black p-2 rounded"
        >
          <option value="" disabled>
            -- Sélectionner un produit --
          </option>
          {products.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Quantité</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border border-black p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Date de réservation</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-black p-2 rounded"
        />
      </div>

      <button type="submit" className="bg-green-400 text-black border border-black px-4 py-2 rounded">
        Créer la réservation
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
}
