'use client'
import React, { useEffect, useState } from 'react';
import { updateProductStock } from './produit-update-stock.action';
import { listProducts } from '../../utils/listProducts'

export default function UpdateProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingStock, setEditingStock] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');

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

  const handleStockChange = (id: number, newStock: number) => {
    setEditingStock({ ...editingStock, [id]: newStock }); 
  };

  const handleStockValidation = async (id: number, newStock: number) => {
    const success = await updateProductStock(id, newStock);

    if (success) {
      alert('Stock mis à jour avec succès !');
      window.location.reload();
    } else {
      alert('Erreur lors de la mise à jour du stock.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Liste des Produits</h1>

      {loading && <p className="text-yellow-700 text-center">Chargement...</p>}

      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center">Aucun produit trouvé.</p>
      )}

      <div className="space-y-4 justify-center items-center">
        {!loading && !error && products.map((product) => (
          <div key={product.id} className="p-4 border flex justify-between border-black rounded-lg items-center">
            <h3 className="text-xl font-semibold pl-6 pe-6">{product.id} - {product.nom}</h3>
            <div className="flex items-center space-x-4">
              <label htmlFor={`stock-${product.id}`} className="font-semibold pl-16 text-black">Stock :</label>
              <input
                id={`stock-${product.id}`}
                type="number"
                value={editingStock[product.id] !== undefined ? editingStock[product.id] : product.stock}
                onChange={(e) => handleStockChange(product.id, parseInt(e.target.value, 10))}
                className="w-20 p-2 border border-black rounded-lg"
              />
              <button 
                onClick={() => handleStockValidation(product.id, editingStock[product.id] || product.stock)}
                className="bg-green-400 rounded-lg p-2 border border-black">
                Valider
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
