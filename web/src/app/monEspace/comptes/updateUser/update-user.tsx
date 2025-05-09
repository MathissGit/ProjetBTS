"use client";
import React, { useEffect, useState } from "react";
import { updateUserAction } from "./update-user.action";
import { listUsers } from "../../utils/listUsers";

export default function UsersUpdate() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [formValues, setFormValues] = useState<{
    [key: string]: { email: string; roles: string };
  }>({});
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");

      try {
        const users = await listUsers();
        setUsers(users);

        const rolesSet = new Set<string>();
        users.forEach((user: { roles: string[]; }) => {
          user.roles.forEach((role: string) => rolesSet.add(role));
        });

        setAvailableRoles(Array.from(rolesSet));
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    }

    fetchUsers();
  }, []);

  const handleInputChange = (
    id: number,
    field: "email" | "roles",
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleValidation = async (id: number) => {
    const user = users.find((u) => u.id === id);
    const updated = formValues[id];

    const newEmail = updated?.email || user.email;
    const newRoles = [updated?.roles || user.roles[0]];

    const success = await updateUserAction(id, newEmail, newRoles);

    if (success) {
      alert("Utilisateur mis à jour avec succès !");
      window.location.reload();
    } else {
      alert("Erreur lors de la mise à jour de l'utilisateur.");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center text-yellow-700">Modifier un compte utilisateur</h1>

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
              <div>
                <label className="font-semibold text-black">Email : </label>
                <input
                  type="text"
                  placeholder={user.email}
                  value={formValues[user.id]?.email ?? user.email}
                  onChange={(e) =>
                    handleInputChange(user.id, "email", e.target.value)
                  }
                  className="w-fit p-2 border border-black rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-black">Roles : </label>
                <select
                  value={formValues[user.id]?.roles ?? user.roles[0]}
                  onChange={(e) =>
                    handleInputChange(user.id, "roles", e.target.value)
                  }
                  className="w-fit p-2 border border-black rounded-lg"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleValidation(user.id)}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-2 border border-black"
              >
                Valider
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
