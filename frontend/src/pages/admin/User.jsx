import React, { useState, useEffect } from "react";
import { Pencil, X, Users } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const fetchUsers = () => {
    fetch("black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => 
            String(a.id).localeCompare(String(b.id))
          );
          setUsers(sorted);
        } else {
          console.error("API is not an array:", data);
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      status: user.status 
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api/users/${editingUser.id}`;
    
    const payload = {
      id: editingUser.id,
      name: formData.name,
      email: formData.email,
      role: editingUser.role,
      status: formData.status
    };

    try {
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleStyle = (role) => {
    if (role === "Admin") return "bg-purple-500/10 text-purple-400";
    if (role === "Operator") return "bg-green-500/10 text-green-400";
    return "bg-gray-500/10 text-gray-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="mt-1 text-gray-400">Manage user information and system active status.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620]">
        <div className="flex items-center gap-2 border-b border-[#1F2937] p-5">
          <Users size={20} className="text-[#A855F7]" />
          <h2 className="font-semibold text-white">System Users</h2>
          <span className="rounded-full bg-[#7C3AED]/10 px-2.5 py-1 text-xs font-semibold text-[#A78BFA]">
            {users.length} Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1A1F2D]">
              <tr className="border-b border-[#1F2937] text-gray-400">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-sm text-gray-500">
                    Loading data from database...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-white/5">
                    <td className="p-4">
                      <div className="font-medium text-white">{user.name}</div>
                    </td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-green-400' : 'text-gray-500'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(user)} className="rounded-lg border border-[#374151] p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#1F2937] bg-[#121620] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] p-6">
              <div>
                <h2 className="text-xl font-bold text-white">Edit User</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Update information for role <span className="font-bold text-[#A855F7]">{editingUser?.role}</span>.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-[#374151] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}