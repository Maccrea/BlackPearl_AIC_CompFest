import React, { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadDesc() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Motor & Cooling System",
    machineType: "",
    rootCause: "",
    result: "Resolved",
    tags: "",
  });

  const [symptoms, setSymptoms] = useState([""]);
  const [solutions, setSolutions] = useState([""]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (setter, index, value, array) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const addArrayItem = (setter, array) => {
    setter([...array, ""]);
  };

  const removeArrayItem = (setter, index, array) => {
    const newArray = array.filter((_, i) => i !== index);
    setter(newArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.machineType || !formData.rootCause) {
      alert("Harap lengkapi Judul, Tipe Mesin, dan Akar Masalah.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <button
        onClick={() => navigate("/admin/knowledge-ai")}
        className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Kembali ke Knowledge AI
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Tulis Deskripsi Manual</h1>
        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Masukkan masalah mesin, gejala, dan solusi teknis untuk menambahkan
          SOP baru ke dalam Knowledge Base AI.
        </p>
      </div>

      {submitSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-400" />
          <div>
            <div className="font-semibold text-emerald-400">Knowledge Berhasil Disimpan</div>
            <p className="mt-1 text-sm leading-6 text-gray-300">
              Data deskripsi manual telah berhasil dimasukkan ke dalam Knowledge Base dan kini siap digunakan oleh AI.
            </p>
            <button
              onClick={() => navigate("/admin/knowledge-ai")}
              className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              Lihat Daftar Knowledge Base →
            </button>
          </div>
        </div>
      )}

      {!submitSuccess && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7]">
                <Edit3 size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Informasi Umum</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">Judul Kasus (Case Title)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Overheating pada Motor Konveyor"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                >
                  <option value="Motor & Cooling System">Motor & Cooling System</option>
                  <option value="Machine Vibration">Machine Vibration</option>
                  <option value="Electrical & Power">Electrical & Power</option>
                  <option value="Sensors & Calibration">Sensors & Calibration</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Tipe Mesin (Machine Type)</label>
                <input
                  type="text"
                  name="machineType"
                  value={formData.machineType}
                  onChange={handleInputChange}
                  placeholder="Contoh: Labeling, Packaging"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-white">Diagnosis Masalah</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Akar Masalah (Root Cause)</label>
                <input
                  type="text"
                  name="rootCause"
                  value={formData.rootCause}
                  onChange={handleInputChange}
                  placeholder="Contoh: Bearing aus, Filter tersumbat"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Gejala yang Muncul (Symptoms)</label>
                <p className="mb-3 text-xs text-gray-500">Tuliskan gejala spesifik beserta angka parameternya (jika ada).</p>
                {symptoms.map((symptom, idx) => (
                  <div key={idx} className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1F2937] text-xs font-bold text-gray-400">
                      {idx + 1}
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <input
                        type="text"
                        value={symptom}
                        onChange={(e) => handleArrayChange(setSymptoms, idx, e.target.value, symptoms)}
                        placeholder="Contoh: Temperature 90°C+"
                        className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                      />
                      {symptoms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(setSymptoms, idx, symptoms)}
                          className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(setSymptoms, symptoms)}
                  className="mt-2 flex items-center gap-2 text-sm font-medium text-[#A855F7] transition hover:text-[#C084FC]"
                >
                  <Plus size={16} /> Tambah Gejala
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-white">Langkah Solusi (SOP)</h2>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Tindakan Perbaikan</label>
              <p className="mb-3 text-xs text-gray-500">Tuliskan langkah-langkah perbaikan secara berurutan.</p>
              {solutions.map((solution, idx) => (
                <div key={idx} className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/10 text-xs font-bold text-[#10B981]">
                    {idx + 1}
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <input
                      type="text"
                      value={solution}
                      onChange={(e) => handleArrayChange(setSolutions, idx, e.target.value, solutions)}
                      placeholder="Contoh: Periksa dan bersihkan filter udara secara menyeluruh"
                      className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#10B981]"
                    />
                    {solutions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(setSolutions, idx, solutions)}
                        className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(setSolutions, solutions)}
                className="mt-2 flex items-center gap-2 text-sm font-medium text-[#10B981] transition hover:text-[#34D399]"
              >
                <Plus size={16} /> Tambah Langkah
              </button>
            </div>

            <div className="mt-6 border-t border-[#1F2937] pt-5">
              <label className="mb-2 block text-sm font-medium text-gray-300">Tags (Keywords)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Contoh: cooling, motor, temperature (Pisahkan dengan koma)"
                className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/admin/knowledge-ai")}
              className="w-full rounded-xl border border-[#374151] px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white sm:w-auto"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} /> Simpan Knowledge
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}