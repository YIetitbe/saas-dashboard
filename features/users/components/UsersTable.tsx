"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "../types";
import { useUpdateUser, useUsers } from "../hooks";
import { useDebounce } from "@/shared/lib/debounce";
import Table from "./Table";

const UserTable = () => {
  const currentUserRole: User["role"] = "admin";
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterRole, setFilterRole] = useState<User["role"] | "all">("all");
  const [updateUser, setUpdateUser] = useState<[string, User["role"]] | null>(
    null,
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useUsers(page, limit, debouncedSearch, filterRole);
  const updateUserMutation = useUpdateUser();

  const users = data?.users ?? [];
  const total = data?.total ?? 0;

  interface FilteredUsers {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: User["role"];
  }

  const filteredUsers: FilteredUsers[] = users.filter(
    (u: FilteredUsers) => filterRole === "all" || u.role === filterRole,
  );

  const handleRoleChange = (id: string, role: User["role"]) => {
    setUpdateUser([id, role]);
  };

  const saveRoleChange = (id: string, role: User["role"]) => {
    updateUserMutation.mutate({ id, role });
    setUpdateUser(null);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterRole]);

  useEffect(() => {
    if (updateUserMutation.isPending) {
      setShowPending(true);
      const timer = setTimeout(() => setShowPending(false), 3000);
      return () => clearTimeout(timer);
    }
    if (updateUserMutation.isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    if (updateUserMutation.isError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [
    updateUserMutation.isPending,
    updateUserMutation.isSuccess,
    updateUserMutation.isError,
  ]);
  if (isLoading) return <p>Caricamento utenti...</p>;
  if (isError) return <p>Errore caricamento utenti</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <input
        ref={inputRef}
        type="text"
        placeholder="Cerca nome o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-2 border-green-500 p-1 rounded mb-2 w-full"
      />

      <div className="mb-4">
        <label className="mr-2">Filtra per ruolo:</label>
        <select
          value={filterRole}
          onChange={(e) =>
            setFilterRole(e.target.value as User["role"] | "all")
          }
          className="border-2 border-green-500 p-1 rounded disabled:opacity-50"
          disabled={
            updateUserMutation.isPending ||
            (currentUserRole as User["role"]) !== "admin"
          }
        >
          <option value="all">Tutti</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <Table
        isLoading={isLoading}
        users={filteredUsers}
        handleRoleChange={handleRoleChange}
        limit={limit}
        updateUser={updateUser}
        updateUserMutation={updateUserMutation}
      />
      {(currentUserRole as User["role"]) === "admin" && updateUser && (
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={!updateUser || updateUserMutation.isPending}
          onClick={() => saveRoleChange(updateUser[0], updateUser[1])}
        >
          Salva Modifiche
        </button>
      )}

      {showPending && <p className="mt-2">Aggiornamento in corso...</p>}
      {showError && (
        <p className="mt-2 text-red-600">Errore durante l'aggiornamento.</p>
      )}
      {showSuccess && <p className="mt-2 text-green-600">Ruolo aggiornato!</p>}

      <div className="mt-4 flex gap-4 justify-center">
        <button
          className="border-2 border-green-500 p-2 rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <button
          className="border-2 border-green-500 p-2 rounded disabled:opacity-50"
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
