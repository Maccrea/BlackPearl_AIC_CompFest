import React from "react";
import { Menu, Clock, Bell, CircleHelp } from "lucide-react";

export default function Topbar({ role = "admin" }) {
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    // Tambahkan px-8 (padding kiri kanan) dan pt-6 (padding atas) di sini
    <header className="mb-8 flex w-full flex-col px-8 pt-6">
      
      {/* Hamburger Menu (Di Atas) */}
      <button className="mb-5 w-fit text-[#6B7280] transition-colors hover:text-white">
        <Menu size={24} />
      </button>

      {/* Baris Bawah: Teks Sapaan dan Widget */}
      <div className="flex w-full items-end justify-between">
        
        {/* Teks Sapaan */}
        <div>
          <h2 className="mb-1 text-[26px] font-bold text-white">
            Selamat Pagi, {displayRole} 👋
          </h2>
          <p className="text-[14px] text-[#8B95A7]">
            Berikut kondisi line produksi hari ini.
          </p>
        </div>

        {/* Widget Kanan */}
        <div className="flex items-center gap-4">
          
          {/* Jam & Tanggal */}
          <div className="flex h-[48px] items-center gap-3 rounded-xl border border-[#1F2937] bg-[#121620] px-4">
            <Clock size={18} className="text-[#9CA3AF]" />
            <div className="flex flex-col justify-center">
              <span className="text-[13px] font-bold leading-tight text-white">
                09:24:36
              </span>
              <span className="text-[11px] leading-tight text-[#8B95A7]">
                19 Mei 2025
              </span>
            </div>
          </div>

          {/* Notifikasi */}
          <button className="relative flex h-[48px] w-[48px] items-center justify-center rounded-xl border border-[#1F2937] bg-[#121620] text-[#9CA3AF] transition-colors hover:text-white">
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white ring-2 ring-[#121620]">
              3
            </span>
          </button>

          {/* Tombol Bantuan */}
          <button className="flex h-[48px] items-center gap-2 rounded-xl bg-[#7C3AED] px-5 font-medium text-white transition-colors hover:bg-[#6D28D9]">
            <CircleHelp size={18} />
            <span className="text-[14px]">Bantuan</span>
          </button>

        </div>
      </div>
    </header>
  );
}