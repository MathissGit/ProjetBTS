'use client'
import React from 'react';
import UpdateReservation from './update-reservation';

export default function PageUpdateReservations() {
  return (
    <main>
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="border border-black p-8 rounded-lg mx-auto">
                    <UpdateReservation />
                </div>
            </div>
        </div>
    </main>
  );
}