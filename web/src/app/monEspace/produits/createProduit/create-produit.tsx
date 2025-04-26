"use client";
import React, { useState } from "react";
import { createProductAction, uploadImageLocally } from "./create-produit.action";

export default function CreateProduitForm() {
    const [nom, setNom] = useState("");
    const [prix, setPrix] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState<number>(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        const newProductTempId = Date.now().toString(); 
        const productData = {
            nom,
            prix,
            description,
            stock,
            image_url: `/produits/${newProductTempId}.png`,
        };

        const newProductId = await createProductAction(productData);

        if (!newProductId) {
            setMessage("Erreur lors de la création du produit.");
            return;
        }

        if (imageFile) {
            const uploadSuccess = await uploadImageLocally(newProductTempId, imageFile);
            if (!uploadSuccess) {
            setMessage("Produit créé, mais échec de l'upload de l'image.");
            return;
            }
        }

        setMessage("Produit créé avec succès !");
        setNom("");
        setPrix(0);
        setDescription("");
        setStock(0);
        setImageFile(null);
        setPreviewUrl("");
        } catch (error) {
        console.error(error);
        setMessage("Erreur inattendue lors de la création.");
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 border border-black rounded-lg space-y-4"
        >
        <h2 className="text-xl font-bold text-center text-yellow-700">Créer un produit</h2>

        <div>
            <label className="block font-medium">Nom</label>
            <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full border border-black p-2 rounded-lg"
            />
        </div>

        <div>
            <label className="block font-medium">Prix</label>
            <input
            type="number"
            min="0"
            step="0.01"
            value={prix}
            onChange={(e) => setPrix(parseFloat(e.target.value))}
            required
            className="w-full border border-black p-2 rounded-lg"
            />
        </div>

        <div>
            <label className="block font-medium">Description</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-black p-2 rounded-lg"
            />
        </div>

        <div>
            <label className="block font-medium">Stock</label>
            <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
            required
            className="w-full border border-black p-2 rounded-lg"
            />
        </div>

        <div>
            <label className="block font-medium">Image du produit</label>
            <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-black p-2 rounded-lg"
            />
            {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover mx-auto" />
            )}
        </div>

        <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white border border-black px-4 py-2 rounded-lg w-full"
        >
            Créer
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
        </form>
    );
}
