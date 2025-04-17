'use client';

import React, { useEffect, useState } from 'react';
import UserConnectionForm from './_components/user-connection-form';
import UserDashboard from './_components/user-dashboard';

export default function MonEspace() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      setIsAuthenticated(true); 
    } else {
      setIsAuthenticated(false); 
    }
  }, []);

  return (
    <main>
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border border-black p-8 rounded-lg mx-auto">
            {!isAuthenticated ? (
              <>
                <h2 className="text-2xl font-semibold text-center text-black mb-6">Se Connecter</h2>
                <UserConnectionForm />
              </>
            ) : (
              <UserDashboard />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
