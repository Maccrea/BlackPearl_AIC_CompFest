import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

export default function MachineManagement() {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    line: "",
  });

  const fetchMachines = () => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMachines(data);
        } else {
          setMachines([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch machines:", err);
        setMachines([]);
      });
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "healthy") return "bg-green-500/10 text-green-400";
    if (s === "warning") return "bg-yellow-500/10 text-yellow-400";
    if (s === "critical") return "bg-red-500/10 text-red-400";
    return "bg-gray-500/10 text-gray-400";
  };

  const filteredMachines = machines.filter((machine) => {
    const keyword = search.toLowerCase();
    return (
      (machine.name && machine.name.toLowerCase().includes(keyword)) ||
      (machine.type && machine.type.toLowerCase().includes(keyword)) ||
      (machine.line && machine.line.toLowerCase().includes(keyword))
    );
  });

  const handleAdd = () => {
    setEditingMachine(null);
    setFormData({ name: "", type: "", line: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      type: machine.type,
      line: machine.line || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:8000/api/machines/${id}`, { 
        method: "DELETE" 
      });
      fetchMachines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEdit = editingMachine !== null;
    const url = isEdit 
      ? `http://localhost:8000/api/machines/${editingMachine.id}` 
      : "http://localhost:8000/api/machines";
    
    const payload = {
      id: isEdit ? editingMachine.id : `M${Date.now()}`,
      name: formData.name,
      type: formData.type,
      line: formData.line,
      status: isEdit ? editingMachine.status : "Healthy",
      temp: editingMachine?.temp || "25°C",
      health: editingMachine?.health || 100
    };

    try {
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchMachines();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Machine Management</h1>
          <p className="mt-1 text-gray-400">Manage and monitor all machines across production lines.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
        >
          <Plus size={18} /> Add Machine
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search machine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#1F2937] bg-[#121620] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#7C3AED]"
        />
      </div>

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
              {filteredMachines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-sm text-gray-500">
                    No machine data available.
                  </td>
                </tr>
              ) : (
                filteredMachines.map((machine) => (
                  <tr key={machine.id} className="transition-colors hover:bg-white/5">
                    <td className="p-4">
                      <div className="font-semibold text-white">{machine.name}</div>
                    </td>
                    <td className="p-4 text-gray-300">{machine.type}</td>
                    <td className="p-4 text-gray-300">{machine.line || "-"}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(machine.status)}`}>
                        {machine.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{machine.temp || "-"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-[#1F2937]">
                          <div className="h-2 rounded-full bg-green-500" style={{ width: `${machine.health || 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-300">{machine.health || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(machine)} className="rounded-lg border border-[#374151] p-2 text-gray-400 transition hover:border-blue-500 hover:text-blue-400">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(machine.id, machine.name)} className="rounded-lg border border-[#374151] p-2 text-gray-400 transition hover:border-red-500 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#1F2937] bg-[#121620] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingMachine ? "Edit Machine" : "Add New Machine"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {editingMachine ? "Update machine information." : "Add a new machine to the production line."}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Machine Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Machine Type</label>
                <input required type="text" name="type" value={formData.type} onChange={handleChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Production Line</label>
                <input required type="text" name="line" value={formData.line} onChange={handleChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]" />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-[#374151] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]">
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