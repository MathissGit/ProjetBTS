'use client'

import { useEffect, useState, use } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>
}

interface Produit {
  id: number;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);

  const [produit, setProduit] = useState<Produit | null>(null);

  const fetchProduit = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/produits/${id}`;
      const res = await fetch(url);
      const data = await res.json();
      setProduit(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit :", error);
    }
  };

  useEffect(() => {
    fetchProduit();
  }, [id]);

  if (!produit) {
    return <div></div>;
  }

  return (
    <main>
      <div className="py-26 sm:py-26">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="border-t border-black ">
            <section className="w-full py-12">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-12">
                <div className="w-full md:w-1/2">
                  <img 
                    alt={produit.nom} 
                    src={produit.imageURL} 
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="w-full md:w-1/2 pb-2 text-justify border-b border-t border-black">
                  <h2 className="text-4xl font-bold text-gray-900 py-6 border-b border-black">
                    {produit.nom}
                  </h2>
                  <p className="text-xl text-gray-900 py-6 border-b border-black">
                    {produit.description}
                  </p>
                  <p className="text-2xl text-orange-500 py-6 font-semibold">
                    {produit.prix} €
                  </p>
                  
                </div>
              </div>
            </section>
          </div>

          <div className="border-t border-black ">
            <section className="w-full py-12">
              <div className="w-full text-justify pb-6 border-b border-black">
                <h2 className="text-4xl font-bold text-gray-900 pb-4">
                  Réservez en toute simplicité
                </h2>
                <p className="text-xl text-gray-900 pb-4">
                  Pour réserver ce produit, il vous suffit de nous contacter par e-mail ou téléphone. Notre équipe est disponible pour répondre à toutes vos questions et confirmer les disponibilité.
                </p>
                <p className="text-xl text-gray-900 pb-4">
                <em>Téléphone : <u className="text-orange-500">06 12 34 56 78</u></em>
                <br />
                <em>E-mail : <u className="text-orange-500">BrasserieTS@email.com</u></em>
                <br />
                <em>Application mobile : <span className="text-orange-500">Téléchargez l'application mobile pour réserver directement depuis votre smartphone</span></em>
                </p>
                <p className="text-xl text-gray-900 pb-6">
                  Une fois votre demande reçue, nous vous guiderons dans les étapes de réservation et de paiement.
                </p>
                
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}
