'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function produits() {

    const [Produits, setProduits] = useState([]);

    const produits = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/produits`;
        const res = await fetch(url);
        const valeur = await res.json();
        setProduits(valeur);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };
  
    useEffect(() => {
      produits();
    }, []);

    return (
        <main>
            <div className="py-26 sm:py-26">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto lg:mx-0">
                        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-[#000000] sm:text-5xl">Nos Produits</h2>
                        <p className="mt-2 text-lg/8 text-[#000000]"> Chaque recette est le fruit d’un travail minutieux, où les gestes hérités du passé rencontrent des techniques modernes pour offrir des bières et des spiritueux d’exception.</p>
                    </div>
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-b border-black pt-10 pb-10 sm:mt-16 sm:pt-10 sm:pb-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">

                        {Produits.map((produit) => (
                            <article key={produit.id} className="flex max-w-xl flex-col items-start justify-between border-2 border-solid p-4 bg-yellow-700 hover:not-focus:bg-yellow-800">
                                <Link href={`/produits/${produit.id}`}>
                                    <div className="flex items-center gap-x-4 text-xs">
                                        <img alt="" src={produit.imageURL} />
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-2xl font-semibold text-white">
                                            {produit.nom}
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-l text-white">{produit.description}</p>
                                    </div>
                                    <div className="relative mt-8 flex items-center gap-x-4">
                                        <div className="text-sm/6">
                                            <p className="text-2xl font-semibold text-white">
                                                {produit.prix} €
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}

                    </div>
                </div>
            </div>
        </main>
    )
}