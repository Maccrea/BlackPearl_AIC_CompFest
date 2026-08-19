import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
} from "lucide-react";

export default function LoginRole() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");


    if (
      email === "admin@tanya.sepuh" &&
      password === "admin123"
    ) {
      localStorage.setItem("role", "admin");
      localStorage.setItem("userEmail", email);

      navigate("/admin");
      return;
    }

    if (
      email === "operator@tanya.sepuh" &&
      password === "operator123"
    ) {
      localStorage.setItem("role", "operator");
      localStorage.setItem("userEmail", email);

      navigate("/operator");
      return;
    }

    setError("Email atau password salah.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] px-4">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">

        <div className="mb-8 flex flex-col items-center">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7C3AED]/10">
            <BrainCircuit
              size={40}
              className="text-[#A855F7]"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="text-2xl font-bold tracking-wide text-white">
            Tanya S.E.P.U.H
          </h1>

          <p className="mt-1 text-sm text-[#8B95A7]">
            System for Equipment Problem Understanding and Handling
          </p>

        </div>

        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-8 shadow-2xl">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="mt-1 text-sm text-[#9CA3AF]">
              Sign in to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#D1D5DB]">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#6B7280] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  required
                />

              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#D1D5DB]">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-[#6B7280] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9] active:scale-[0.98]"
            >
              <LogIn size={18} />
              Sign In
            </button>

          </form>

          <div className="mt-6 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">

            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Demo Account
            </div>

            <div className="space-y-2 text-xs">

              <div className="flex justify-between">
                <span className="text-[#8B95A7]">
                  Admin
                </span>

                <span className="text-[#D1D5DB]">
                  admin@tanya.sepuh
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8B95A7]">
                  Password
                </span>

                <span className="text-[#D1D5DB]">
                  admin123
                </span>
              </div>

              <div className="my-2 border-t border-[#1F2937]" />

              <div className="flex justify-between">
                <span className="text-[#8B95A7]">
                  Operator
                </span>

                <span className="text-[#D1D5DB]">
                  operator@legacymind.ai
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8B95A7]">
                  Password
                </span>

                <span className="text-[#D1D5DB]">
                  operator123
                </span>
              </div>

            </div>

          </div>

        </div>

        <p className="mt-6 text-center text-xs text-[#6B7280]">
          Tanya S.E.P.U.H © 2026
        </p>

      </div>

    </div>
  );
}