import React from "react";

export default function UserManagement() {
  const users = [
    { id: 1, name: "Administrator", role: "Admin" },
    { id: 2, name: "Operator 1", role: "Operator" },
    { id: 3, name: "Engineer", role: "Engineer" },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-white">
          User Management
        </h1>
        <p className="mt-1 text-gray-400">
          Kelola daftar pengguna dan hak akses sistem.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620]">
        <table className="w-full text-left text-sm">
          
          <thead className="bg-[#1A1F2D]">
            <tr className="border-b border-[#1F2937] text-gray-400">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Role</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-[#1F2937]">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="transition-colors hover:bg-white/5"
              >
                <td className="p-4 font-medium text-white">
                  {user.name}
                </td>
                <td className="p-4">
                  {/* Badge untuk Role */}
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    user.role === 'Admin' 
                      ? 'bg-purple-500/10 text-purple-400' 
                      : user.role === 'Operator' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>

    </div>
  );
}