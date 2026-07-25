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
} from "lucide-react";

export default function UploadData() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // File yang diperbolehkan
  const allowedExtensions = [".csv", ".xlsx", ".xls", ".json"];

  // Maksimal ukuran file: 10 MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // ==============================
  // VALIDATE FILE
  // ==============================

  const validateFile = (file) => {
    if (!file) {
      return {
        valid: false,
        message: "File tidak ditemukan.",
      };
    }

    const fileName = file.name.toLowerCase();

    const isValidExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isValidExtension) {
      return {
        valid: false,
        message: "Format file tidak didukung. Gunakan CSV, Excel, atau JSON.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: "Ukuran file terlalu besar. Maksimal ukuran file adalah 10 MB.",
      };
    }

    return {
      valid: true,
      message: "File valid.",
    };
  };

  // ==============================
  // HANDLE SELECT FILE
  // ==============================

  const handleFileSelect = (file) => {
    setUploadStatus(null);

    const validation = validateFile(file);

    if (!validation.valid) {
      setSelectedFile(null);

      setUploadStatus({
        type: "error",
        message: validation.message,
      });

      return;
    }

    setSelectedFile(file);
  };

  // ==============================
  // INPUT FILE
  // ==============================

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  // ==============================
  // DRAG & DROP
  // ==============================

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  // ==============================
  // REMOVE FILE
  // ==============================

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==============================
  // FORMAT FILE SIZE
  // ==============================

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${
      sizes[index]
    }`;
  };

  // ==============================
  // FILE ICON
  // ==============================

  const getFileIcon = () => {
    if (!selectedFile) {
      return <FileText size={28} />;
    }

    const fileName = selectedFile.name.toLowerCase();

    if (fileName.endsWith(".json")) {
      return <FileJson size={28} />;
    }

    if (
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      return <FileSpreadsheet size={28} />;
    }

    return <FileText size={28} />;
  };

  // ==============================
  // UPLOAD DATA
  // ==============================

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: "error",
        message: "Silakan pilih file terlebih dahulu.",
      });

      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // ==========================================
      // FORM DATA
      // ==========================================

      const formData = new FormData();

      // "file" harus disesuaikan dengan nama field
      // yang diminta oleh FastAPI leader kamu.
      formData.append("file", selectedFile);

      // ==========================================
      // API REQUEST
      // ==========================================

      const response = await fetch(
        "http://localhost:8000/api/upload",
        {
          method: "POST",

          // JANGAN tambahkan Content-Type manual.
          // Browser akan otomatis membuat:
          // multipart/form-data + boundary
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengunggah dataset.");
      }

      const result = await response.json();

      console.log("Upload response:", result);

      // ==========================================
      // SUCCESS
      // ==========================================

      setUploadStatus({
        type: "success",
        message:
          result.message ||
          "Dataset berhasil diunggah dan diproses.",
      });

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);

      setUploadStatus({
        type: "error",
        message:
          error.message ||
          "Terjadi kesalahan saat mengunggah dataset.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Upload Dataset
        </h1>

        <p className="mt-1 text-gray-400">
          Unggah file dataset untuk memperbarui knowledge base AI.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-8">


        {!selectedFile && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-[#4B5563] bg-white/5 hover:border-blue-500 hover:bg-white/10"
            }`}
          >

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <UploadCloud size={32} />
            </div>

            <h2 className="text-xl font-bold text-white">
              Drag & Drop Dataset
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              atau pilih file dari komputer Anda
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Mendukung CSV, Excel (.xlsx, .xls), dan JSON
            </p>

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

            <div className="rounded-xl border border-[#30363D] bg-[#0B0E14] p-5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    {getFileIcon()}
                  </div>

                  <div>
                    <p className="max-w-[500px] truncate text-sm font-semibold text-white">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>

                </div>

    

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={20} />
                </button>

              </div>

            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {isUploading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

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
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />
            )}

            <p className="text-sm">
              {uploadStatus.message}
            </p>

          </div>
        )}

      </div>

      <div className="rounded-xl border border-[#1F2937] bg-[#121620] p-5">

        <h3 className="font-semibold text-white">
          Dataset Information
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          <li>
            • Format yang didukung: CSV, Excel, dan JSON
          </li>

          <li>
            • Ukuran maksimal file: 10 MB
          </li>

          <li>
            • Dataset akan digunakan untuk memperbarui Knowledge Base AI
          </li>

          <li>
            • Pastikan data yang diunggah sudah sesuai dengan struktur dataset yang digunakan sistem
          </li>
        </ul>

      </div>

    </div>
  );
}