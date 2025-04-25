'use client'
import React from 'react';
import DeleteProduit from './delete-produit';

export default function PageDeleteProduits() {
  return (
    <main>
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="border border-black p-8 rounded-lg mx-auto">
                    <DeleteProduit />
                </div>
            </div>
        </div>
    </main>
  );
}