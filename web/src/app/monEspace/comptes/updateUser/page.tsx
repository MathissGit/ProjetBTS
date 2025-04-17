'use client'
import React from 'react';
import UsersUpdate from './update-user';

export default function PageUpdateUsers() {
  return (
    <main>
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="border border-black p-8 rounded-lg mx-auto">
                    <UsersUpdate />
                </div>
            </div>
        </div>
    </main>
  );
}