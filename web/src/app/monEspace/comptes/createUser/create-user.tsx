"use client";
import React, { useEffect, useState } from "react";
import { createUserAction } from "./create-user.action";  
import { listUsers } from "../../utils/listUsers"

export default function CreateUserForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchRoles() {
      try {
        const users = await listUsers();
        const rolesSet = new Set<string>();
        users.forEach((user) => {
          user.roles.forEach((r: string) => rolesSet.add(r));
        });
        const rolesArray = Array.from(rolesSet);
        setAvailableRoles(rolesArray);
        setRole(rolesArray[0] ?? "");
      } catch (error) {
        console.error("Erreur récupération rôles:", error);
      }
    }

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createUserAction(nom, prenom, email, password, [
      role,
    ]);
    setMessage(
      success ? "Utilisateur créé avec succès !" : "Erreur lors de la création"
    );

    if (success) {
      setNom("");
      setPrenom("");
      setEmail("");
      setPassword("");
      setRole(availableRoles[0] ?? "");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 border border-black rounded-lg space-y-4"
    >
      <h2 className="text-xl font-bold text-center text-yellow-700">Créer un utilisateur</h2>

      <div>
        <label className="block font-medium">Nom</label>
        <input
          type="text"
          value={nom}
          placeholder="Dupond"
          onChange={(e) => setNom(e.target.value)}
          required
          className="w-full border border-black p-2 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium">Prénom</label>
        <input
          type="text"
          value={prenom}
          placeholder="Jean"
          onChange={(e) => setPrenom(e.target.value)}
          required
          className="w-full border border-black p-2 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          value={email}
          placeholder="email@exemple.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-black p-2 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-black p-2 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium">Rôle</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-black p-2 rounded-lg"
        >
          {availableRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white border border-black px-4 py-2 rounded-lg"
      >
        Créer
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
}
