"use client";

import { User } from "../types";

interface Props {
  user: User;
  selectedRole?: User["role"];
  onRoleChange: (id: string, role: User["role"]) => void;
  disabled?: boolean;
}

const UserCard = ({ user, selectedRole, onRoleChange, disabled }: Props) => {
  return (
    <div className="border-2 border-green-500 rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm">
      <div>
        <p className="text-sm text-gray-500">Nome</p>
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="break-all">{user.email}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Ruolo</p>
        <select
          value={selectedRole ?? user.role}
          onChange={(e) =>
            onRoleChange(user.id, e.target.value as User["role"])
          }
          disabled={disabled}
          className="border-2 border-green-500 p-2 rounded w-full"
        >
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
    </div>
  );
};

export default UserCard;
