import { User } from "../types";

type TableProps = {
  isLoading: boolean;
  users: User[];
  handleRoleChange: (id: string, role: User["role"]) => void;
  limit: number;
  updateUser: [string, User["role"]] | null;
  updateUserMutation: {
    isPending: boolean;
  };
};

const Table = ({
  isLoading,
  users,
  handleRoleChange,
  limit,
  updateUser,
  updateUserMutation,
}: TableProps) => {
  return (
    <table className="w-full border-collapse border-2 border-green-500">
      <thead>
        <tr className="bg-green-300 text-white border-2 border-green-500">
          <th className="border-2 border-green-500 px-4 py-2 ">ID</th>
          <th className="border-2 border-green-500 px-4 py-2">Nome</th>
          <th className="border-2 border-green-500 px-4 py-2">Cognome</th>
          <th className="border-2 border-green-500 px-4 py-2">Email</th>
          <th className="border-2 border-green-500 px-4 py-2">Ruolo</th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array.from({ length: limit }).map((_, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2 animate-pulse bg-gray-200">
                  &nbsp;
                </td>
                <td className="border px-4 py-2 animate-pulse bg-gray-200">
                  &nbsp;
                </td>
                <td className="border px-4 py-2 animate-pulse bg-gray-200">
                  &nbsp;
                </td>
                <td className="border px-4 py-2 animate-pulse bg-gray-200">
                  &nbsp;
                </td>
                <td className="border px-4 py-2 animate-pulse bg-gray-200">
                  &nbsp;
                </td>
              </tr>
            ))
          : users.map((u: User) => (
              <tr key={u.id}>
                <td className="border-2 border-green-500 px-4 py-2">{u.id}</td>
                <td className="border-2 border-green-500 px-4 py-2">
                  {u.firstName}
                </td>
                <td className="border-2 border-green-500 px-4 py-2">
                  {u.lastName}
                </td>
                <td className="border-2 border-green-500 px-4 py-2">
                  {u.email}
                </td>
                <td className="border-2 border-green-500 px-4 py-2">
                  <select
                    value={updateUser?.[0] === u.id ? updateUser?.[1] : u.role}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleRoleChange(u.id, e.target.value as User["role"])
                    }
                    className="border-2 border-green-500 p-1 rounded"
                    disabled={updateUserMutation.isPending}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export default Table;
