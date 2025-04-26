"use client";
import React, { useEffect, useState } from "react";
import { deleteProduitAction } from './delete-produit.action'
import { listProducts } from "../../utils/listProducts"

export default function DeleteProduit() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchProducts() {
        setLoading(true);
        setError("");

        try {
            const products = await listProducts();
            setProducts(products);

        } catch (error) {
            setError(error.message);
        }

        setLoading(false);
        }

        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
      
        if (confirmed) {
          const success = await deleteProduitAction(id);
          if (success) {
            alert("Produit supprimé avec succès !");
            setProducts(products.filter((product) => product.id !== id));
          } else {
            alert("Erreur lors de la suppression du produit.");
          }
        } else {
          alert("Suppression annulée.");
        }
    };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center text-yellow-700">Supprimer un produit</h1>

      {loading && <p className="text-yellow-700 text-center">Chargement...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center">Aucun produit trouvé</p>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border flex flex-col sm:flex-row justify-between border-black rounded-lg gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <h3 className="text-xl font-semibold">
                {product.id} - {product.nom}
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 border border-black"
              >
                Supprimer le produit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
