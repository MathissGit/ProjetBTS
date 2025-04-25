'use client';
import React, { useEffect, useState } from 'react';
import { UpdateProductAction } from './produit-update.action';
import { listProducts } from '../../utils/listProducts';

export default function UpdateProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editing, setEditing] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');

      try {
        const fetchedProducts = await listProducts();
        setProducts(fetchedProducts);

        const initialEditingState = fetchedProducts.reduce((acc: any, p: any) => {
          acc[p.id] = {
            nom: p.nom,
            prix: p.prix,
            stock: p.stock,
          };
          return acc;
        }, {});
        setEditing(initialEditingState);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement.');
      }

      setLoading(false);
    }

    fetchProducts();
  }, []);

  const handleChange = (id: number, field: string, value: any) => {
    setEditing({
      ...editing,
      [id]: {
        ...editing[id],
        [field]: field === 'prix' || field === 'stock' ? parseFloat(value) : value,
      },
    });
  };

  const handleValidation = async (id: number) => {
    const data = editing[id];

    const success = await UpdateProductAction(id, data);

    if (success) {
      alert('Produit mis à jour avec succès !');
      window.location.reload();
    } else {
      alert("Erreur lors de la mise à jour du produit.");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Mise à jour des produits</h1>

      {loading && <p className="text-yellow-700 text-center">Chargement...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center">Aucun produit trouvé.</p>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border border-black rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-start sm:items-center">
              <span className="font-semibold">ID : {product.id}</span>

              <label className="flex flex-col text-sm">
                Nom :
                <input
                  type="text"
                  value={editing[product.id]?.nom || ''}
                  onChange={(e) => handleChange(product.id, 'nom', e.target.value)}
                  className="border border-black rounded p-1"
                />
              </label>

              <label className="flex flex-col text-sm">
                Prix (€) :
                <input
                  type="number"
                  step="0.01"
                  value={editing[product.id]?.prix || 0}
                  onChange={(e) => handleChange(product.id, 'prix', e.target.value)}
                  className="border border-black rounded p-1 w-24"
                />
              </label>

              <label className="flex flex-col text-sm">
                Stock :
                <input
                  type="number"
                  value={editing[product.id]?.stock || 0}
                  onChange={(e) => handleChange(product.id, 'stock', e.target.value)}
                  className="border border-black rounded p-1 w-20"
                />
              </label>
            </div>

            <button
              onClick={() => handleValidation(product.id)}
              className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded border border-black"
            >
              Valider
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
