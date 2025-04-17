'use client'
import React from 'react';
import DeleteUserForm from "./delete-user";

export default function PageDeleteUsers() {
  return (
    <main>
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="border border-black p-8 rounded-lg mx-auto">
                    <DeleteUserForm />
                </div>
            </div>
        </div>
    </main>
  );
}