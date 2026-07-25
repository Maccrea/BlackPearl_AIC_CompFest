import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Administrator",
      email: "admin@legacymind.ai",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Operator 1",
      email: "operator@legacymind.ai",
      role: "Operator",
      status: "Active",
    },
    // {
    //   id: 3,
    //   name: "Engineer",
    //   email: "engineer@legacymind.ai",
    //   role: "Engineer",
    //   status: "Active",
    // },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Operator",
    status: "Active",
  });


  const handleAdd = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      role: "Operator",
      status: "Active",
    });

    setIsModalOpen(true);
  };


  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const user = users.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Hapus user "${user.name}"?`
    );

    if (!confirmed) return;

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...formData,
              }
            : user
        )
      );
    }

    else {
      const newUser = {
        id: Date.now(),
        ...formData,
      };

      setUsers((prevUsers) => [
        ...prevUsers,
        newUser,
      ]);
    }

    setIsModalOpen(false);
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500/10 text-purple-400";

      // case "Engineer":
      //   return "bg-blue-500/10 text-blue-400";

      case "Operator":
        return "bg-green-500/10 text-green-400";

      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold text-white">
            User Management
          </h1>

          <p className="mt-1 text-gray-400">
            Kelola daftar pengguna dan hak akses sistem.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
        >
          <Plus size={18} />
          Add User
        </button>

      </div>


      <div className="overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620]">

        <div className="flex items-center gap-2 border-b border-[#1F2937] p-5">

          <Users
            size={20}
            className="text-[#A855F7]"
          />

          <h2 className="font-semibold text-white">
            System Users
          </h2>

          <span className="rounded-full bg-[#7C3AED]/10 px-2.5 py-1 text-xs font-semibold text-[#A78BFA]">
            {users.length} Users
          </span>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-[#1A1F2D]">

              <tr className="border-b border-[#1F2937] text-gray-400">

                <th className="p-4 font-medium">
                  Name
                </th>

                <th className="p-4 font-medium">
                  Email
                </th>

                <th className="p-4 font-medium">
                  Role
                </th>

                <th className="p-4 font-medium">
                  Status
                </th>

                <th className="p-4 text-right font-medium">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-[#1F2937]">

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="transition-colors hover:bg-white/5"
                >


                  <td className="p-4">

                    <div className="font-medium text-white">
                      {user.name}
                    </div>

                  </td>


                  <td className="p-4 text-gray-400">
                    {user.email}
                  </td>


                  <td className="p-4">

                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>

                  </td>


                  <td className="p-4">

                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">

                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                      {user.status}

                    </span>

                  </td>


                  <td className="p-4">

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded-lg border border-[#374151] p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                        title="Edit User"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-[#1F2937] bg-[#121620] shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#1F2937] p-6">

              <div>

                <h2 className="text-xl font-bold text-white">
                  {editingUser
                    ? "Edit User"
                    : "Add New User"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {editingUser
                    ? "Perbarui informasi pengguna."
                    : "Tambahkan pengguna baru ke sistem."}
                </p>

              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  required
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#7C3AED]"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@legacymind.ai"
                  required
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#7C3AED]"
                />

              </div>


              {/* ROLE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]"
                >

                  <option value="Admin">
                    Admin
                  </option>

                  <option value="Operator">
                    Operator
                  </option>

                  {/* <option value="Engineer">
                    Engineer
                  </option> */}

                </select>

              </div>


              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]"
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#374151] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                >
                  {editingUser
                    ? "Save Changes"
                    : "Add User"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}