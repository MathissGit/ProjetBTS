'use client'
import React from 'react';
import CreateProduct from './create-produit';

export default function PageCreateProduits() {
  return (
    <main>
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="border border-black p-8 rounded-lg mx-auto">
                    <CreateProduct />
                </div>
            </div>
        </div>
    </main>
  );
}