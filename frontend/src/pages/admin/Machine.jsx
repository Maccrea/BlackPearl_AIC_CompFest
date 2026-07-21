import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import dashboard from "../../mock/dashboard";

export default function MachineManagement() {
  const [machines, setMachines] = useState(dashboard.machines);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    line: "",
    status: "healthy",
  });

  const statusStyle = {
    healthy: "bg-green-500/10 text-green-400",
    warning: "bg-yellow-500/10 text-yellow-400",
    critical: "bg-red-500/10 text-red-400",
  };

  const filteredMachines = machines.filter((machine) => {
    const keyword = search.toLowerCase();
    return (
      machine.name.toLowerCase().includes(keyword) ||
      machine.type.toLowerCase().includes(keyword) ||
      machine.line?.toLowerCase().includes(keyword)
    );
  });

  const handleAdd = () => {
    setEditingMachine(null);
    setFormData({
      name: "",
      type: "",
      line: "",
      status: "healthy",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      type: machine.type,
      line: machine.line || "",
      status: machine.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const machine = machines.find((machine) => machine.id === id);
    const confirmDelete = window.confirm(
      `Apakah kamu yakin ingin menghapus ${machine?.name}?`
    );

    if (!confirmDelete) return;

    setMachines((prevMachines) =>
      prevMachines.filter((machine) => machine.id !== id)
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingMachine) {
      setMachines((prevMachines) =>
        prevMachines.map((machine) =>
          machine.id === editingMachine.id
            ? {
                ...machine,
                name: formData.name,
                type: formData.type,
                line: formData.line,
                status: formData.status,
              }
            : machine
        )
      );
    } else {
      const newMachine = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        line: formData.line,
        status: formData.status,
        temperature: 0,
        rpm: 0,
        current: 0,
        vibration: 0,
        health: 100,
      };

      setMachines((prevMachines) => [...prevMachines, newMachine]);
    }

    setIsModalOpen(false);
    setEditingMachine(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Machine Management</h1>
          <p className="mt-1 text-gray-400">
            Kelola dan pantau seluruh mesin di line produksi.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
        >
          <Plus size={18} />
          Add Machine
        </button>
      </div>

      {/* SEARCH SECTION */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search machine..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-[#1F2937] bg-[#121620] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#7C3AED]"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1A1F2D]">
              <tr className="border-b border-[#1F2937] text-gray-400">
                <th className="p-4 font-medium">Machine</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Production Line</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Temperature</th>
                <th className="p-4 font-medium">Health</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1F2937]">
              {filteredMachines.map((machine) => (
                <tr key={machine.id} className="transition-colors hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-semibold text-white">{machine.name}</div>
                  </td>
                  <td className="p-4 text-gray-300">{machine.type}</td>
                  <td className="p-4 text-gray-300">{machine.line || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyle[machine.status] || "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {machine.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">
                    {machine.temperature ?? "-"}°C
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-[#1F2937]">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${machine.health ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-300">
                        {machine.health ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(machine)}
                        className="rounded-lg border border-[#374151] p-2 text-gray-400 transition hover:border-blue-500 hover:text-blue-400"
                        title="Edit Machine"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(machine.id)}
                        className="rounded-lg border border-[#374151] p-2 text-gray-400 transition hover:border-red-500 hover:text-red-400"
                        title="Delete Machine"
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

        {filteredMachines.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">
            No machines found.
          </div>
        )}
      </div>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#1F2937] bg-[#121620] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingMachine ? "Edit Machine" : "Add New Machine"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {editingMachine
                    ? "Update informasi mesin."
                    : "Tambahkan mesin baru ke production line."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Machine Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Machine F"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Machine Type
                </label>
                <input
                  required
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Conveyor"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Production Line
                </label>
                <input
                  required
                  type="text"
                  name="line"
                  value={formData.line}
                  onChange={handleChange}
                  placeholder="e.g. Production Line A"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#7C3AED]"
                />
              </div>

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
                  <option value="healthy">Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
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
                  {editingMachine ? "Save Changes" : "Add Machine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}