"use client";
import React, { useEffect, useState } from "react";
import { DeleteUserAction } from "./delete-user.action";
import { listUsers } from "../../utils/listUsers"

export default function UsersUpdate() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchUsers() {
        setLoading(true);
        setError("");

        try {
            const users = await listUsers();
            setUsers(users);

            const rolesSet = new Set<string>();
            users.forEach((user) => {
            user.roles.forEach((role: string) => rolesSet.add(role));
            });

        } catch (error) {
            setError(error.message);
        }

        setLoading(false);
        }

        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
      
        if (confirmed) {
          const success = await DeleteUserAction(id);
          if (success) {
            alert("Utilisateur supprimé avec succès !");
            setUsers(users.filter((user) => user.id !== id));
          } else {
            alert("Erreur lors de la suppression de l'utilisateur.");
          }
        } else {
          alert("Suppression annulée.");
        }
    };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Liste des utilisateurs</h1>

      {loading && <p className="text-yellow-700 text-center">Chargement...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-center">Aucun utilisateur trouvé.</p>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border flex flex-col sm:flex-row justify-between border-black rounded-lg gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <h3 className="text-xl font-semibold">
                {user.nom} {user.prenom}
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-600 hover:bg-red-500 text-white rounded-lg p-2 border border-black"
              >
                Supprimer l'utilisateur
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
