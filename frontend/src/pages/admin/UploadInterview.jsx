import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileAudio,
  X,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadInterview() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["mp3", "wav", "m4a"];

    if (!allowedExtensions.includes(fileExtension)) {
      alert("File format not supported. Use MP3, WAV, or M4A.");
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      alert("Maximum file size is 100 MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an interview file first.");
      return;
    }
    if (!title.trim()) {
      alert("Please enter an interview title.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const response = await fetch("black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api/knowledge/upload-interview", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setUploadSuccess(true);
      } else {
        alert("Failed to process AI: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing the interview on the backend.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <button
        onClick={() => navigate("/admin/knowledge-ai")}
        className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Knowledge AI
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Upload Engineer Interview</h1>
        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Upload engineer interview recordings to be processed into AI knowledge.
        </p>
      </div>

      {uploadSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-green-400" />
          <div>
            <div className="font-semibold text-green-400">AI Processing Complete!</div>
            <p className="mt-1 text-sm leading-6 text-gray-300">
              {successMessage || "File has been processed by AI and successfully saved."}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Multi-case extraction results are now available in the Knowledge Base table.
            </p>
            <button
              onClick={() => navigate("/admin/knowledge-ai")}
              className="mt-4 text-sm font-medium text-green-400 hover:text-green-300"
            >
              Back to Knowledge AI →
            </button>
          </div>
        </div>
      )}

      {!uploadSuccess && (
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-white">Interview Information</h2>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Interview Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Packaging Machine Diagnosis"
                className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#7C3AED]"
              />
              <p className="mt-2 text-xs text-gray-500">
                Use a title that describes the main topic or issue in the interview.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-white">Interview Recording</h2>

            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition sm:p-12 ${
                  isDragging
                    ? "border-[#7C3AED] bg-[#7C3AED]/10"
                    : "border-[#4B5563] bg-white/5 hover:border-[#7C3AED] hover:bg-white/10"
                }`}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED]/10 text-[#A855F7]">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">Drag & Drop Interview Recording</h3>
                <p className="mt-2 text-sm text-gray-400">or click to select a file</p>
                <p className="mt-3 text-xs text-gray-500">Supported: MP3, WAV, M4A • Maximum 100 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.m4a,audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-[#374151] bg-[#0B0E14] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7]">
                    <FileAudio size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="truncate text-sm font-semibold text-white sm:max-w-[400px]">
                      {file.name}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="text-sm font-semibold text-blue-400">AI Processing Pipeline</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">
              <span>Audio Interview</span>
              <span className="text-gray-600">→</span>
              <span>Speech-to-Text</span>
              <span className="text-gray-600">→</span>
              <span>Knowledge Extraction</span>
              <span className="text-gray-600">→</span>
              <span>Knowledge Base</span>
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/admin/knowledge-ai")}
              className="w-full rounded-xl border border-[#374151] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing AI...
                </>
              ) : (
                <>
                  <UploadCloud size={18} /> Upload & Process
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}