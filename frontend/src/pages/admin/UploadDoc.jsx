import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadDoc() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const allowedExtensions = [".csv", ".xlsx", ".xls", ".json"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateFile = (file) => {
    if (!file) return { valid: false, message: "File not found." };
    const fileName = file.name.toLowerCase();
    const isValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));
    if (!isValidExtension) return { valid: false, message: "File format not supported. Use CSV, Excel, or JSON." };
    if (file.size > MAX_FILE_SIZE) return { valid: false, message: "File size is too large. Maximum is 10 MB." };
    return { valid: true, message: "File valid." };
  };

  const handleFileSelect = (file) => {
    setUploadStatus(null);
    const validation = validateFile(file);
    if (!validation.valid) {
      setSelectedFile(null);
      setUploadStatus({ type: "error", message: validation.message });
      return;
    }
    setSelectedFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${sizes[index]}`;
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FileText size={28} />;
    const fileName = selectedFile.name.toLowerCase();
    if (fileName.endsWith(".json")) return <FileJson size={28} />;
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) return <FileSpreadsheet size={28} />;
    return <FileText size={28} />;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ type: "error", message: "Please select a file first." });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload dataset.");
      const result = await response.json();

      setUploadStatus({
        type: "success",
        message: result.message || "Dataset successfully uploaded and processed.",
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error.message || "An error occurred while uploading the dataset.",
      });
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
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Upload Dataset</h1>
        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Upload dataset files to update the AI knowledge base.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-8">
        {!selectedFile && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-all sm:py-16 ${
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-[#4B5563] bg-white/5 hover:border-blue-500 hover:bg-white/10"
            }`}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <UploadCloud size={32} />
            </div>
            <h2 className="text-lg font-bold text-white sm:text-xl">Drag & Drop Dataset</h2>
            <p className="mt-2 text-sm text-gray-400">or select a file from your computer</p>
            <p className="mt-2 text-xs text-gray-500">Supports CSV, Excel (.xlsx, .xls), and JSON</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleInputChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Choose File
            </button>
          </div>
        )}

        {selectedFile && (
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-xl border border-[#30363D] bg-[#0B0E14] p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  {getFileIcon()}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-semibold text-white sm:max-w-[500px]">
                    {selectedFile.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isUploading}
                className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading Dataset...
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  Upload Dataset
                </>
              )}
            </button>
          </div>
        )}

        {uploadStatus && (
          <div
            className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
              uploadStatus.type === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {uploadStatus.type === "success" ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
            )}
            <p className="text-sm">{uploadStatus.message}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
        <h3 className="font-semibold text-white">Dataset Information</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          <li>• Supported formats: CSV, Excel, and JSON</li>
          <li>• Maximum file size: 10 MB</li>
          <li>• Dataset will be used to update the AI Knowledge Base</li>
          <li>• Ensure the uploaded data matches the system's dataset structure</li>
        </ul>
      </div>
    </div>
  );
}