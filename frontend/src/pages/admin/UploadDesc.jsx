import React, { useState } from "react";
import { ArrowLeft, Edit3, CheckCircle2, Plus, Trash2, Save, Loader2 } from "lucide-react";
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
    tags: "",
  });

  const [symptoms, setSymptoms] = useState([""]);
  const [solutions, setSolutions] = useState([""]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleArrayChange = (setter, index, value, array) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };
  
  const addArrayItem = (setter, array) => setter([...array, ""]);
  const removeArrayItem = (setter, index, array) => setter(array.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        machine_type: formData.machineType,
        root_cause: formData.rootCause,
        symptoms: symptoms.filter(s => s.trim() !== ""),
        solutions: solutions.filter(s => s.trim() !== ""),
        tags: formData.tags
      };

      const response = await fetch("black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api/knowledge/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save to database");
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <button onClick={() => navigate("/admin/knowledge-ai")} className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
        <ArrowLeft size={18} /> Back to Knowledge AI
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Write Manual Description</h1>
        <p className="mt-1 text-sm text-gray-400 sm:text-base">Input machine issues, symptoms, and technical solutions into the Knowledge Base.</p>
      </div>

      {submitSuccess ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-400" />
          <div>
            <div className="font-semibold text-emerald-400">Knowledge Successfully Saved</div>
            <button onClick={() => navigate("/admin/knowledge-ai")} className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300">
              View Knowledge Base List →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7]"><Edit3 size={20} /></div>
              <h2 className="text-lg font-bold text-white">General Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">Case Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]">
                  <option value="Motor & Cooling System">Motor & Cooling System</option>
                  <option value="Machine Vibration">Machine Vibration</option>
                  <option value="Electrical & Power">Electrical & Power</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Machine Type</label>
                <input type="text" name="machineType" value={formData.machineType} onChange={handleInputChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]" required />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-white">Problem Diagnosis</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Root Cause</label>
                <input type="text" name="rootCause" value={formData.rootCause} onChange={handleInputChange} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none focus:border-[#7C3AED]" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Symptoms</label>
                {symptoms.map((symptom, idx) => (
                  <div key={idx} className="mb-3 flex gap-2">
                    <input type="text" value={symptom} onChange={(e) => handleArrayChange(setSymptoms, idx, e.target.value, symptoms)} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-2.5 text-sm text-white outline-none focus:border-[#7C3AED]" />
                    {symptoms.length > 1 && <button type="button" onClick={() => removeArrayItem(setSymptoms, idx, symptoms)} className="text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem(setSymptoms, symptoms)} className="mt-2 flex items-center gap-2 text-sm font-medium text-[#A855F7] hover:text-[#C084FC]"><Plus size={16} /> Add Symptom</button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-white">Solution Steps (SOP)</h2>
            <div>
              {solutions.map((solution, idx) => (
                <div key={idx} className="mb-3 flex gap-2">
                  <input type="text" value={solution} onChange={(e) => handleArrayChange(setSolutions, idx, e.target.value, solutions)} className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-2.5 text-sm text-white outline-none focus:border-[#10B981]" />
                  {solutions.length > 1 && <button type="button" onClick={() => removeArrayItem(setSolutions, idx, solutions)} className="text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem(setSolutions, solutions)} className="mt-2 flex items-center gap-2 text-sm font-medium text-[#10B981] hover:text-[#34D399]"><Plus size={16} /> Add Step</button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9] disabled:opacity-50">
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Knowledge</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}