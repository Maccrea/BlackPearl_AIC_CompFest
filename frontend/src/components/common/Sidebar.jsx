import {
  Home,
  Network,
  MonitorCheck,
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Upload,
  Factory,
  Users,
  Settings,
  Sun,
  Hexagon,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { NavLink } from "react-router-dom";

const menuSections = {
  operator: {
    title: "OPERATOR PANEL",
    items: [
      {
        name: "Dashboard",
        path: "/operator",
        icon: Home,
      },
      {
        name: "Production Line",
        path: "/operator/production-line",
        icon: Network,
      },
      {
        name: "Machine Status",
        path: "/operator/machine-status",
        icon: MonitorCheck,
      },
      {
        name: "AI Analysis",
        path: "/operator/ai-analysis",
        icon: BrainCircuit,
      },
      {
        name: "Recommendation",
        path: "/operator/recommendation",
        icon: Sparkles,
      },
      {
        name: "Engineer Validation",
        path: "/operator/validation",
        icon: ShieldCheck,
      },
    ],
  },

  admin: {
    title: "ADMIN PANEL",
    items: [
      {
        name: "Dashboard",
        icon: Home,
        path: "/admin",
      },
      {
        name: "Knowledge AI",
        icon: BookOpen,
        path: "/admin/knowledge-ai",
      },
      {
        name: "Upload Data",
        icon: Upload,
        path: "/admin/upload-data",
      },
      {
        name: "Manajemen Mesin",
        icon: Factory,
        path: "/admin/machines",
      },
      {
        name: "Pengguna",
        icon: Users,
        path: "/admin/users",
      },
      {
        name: "Pengaturan",
        icon: Settings,
        path: "/admin/settings",
      },
    ],
  },
};

export default function Sidebar({ role = "operator" }) {
  const visibleSections =
    role === "admin"
      ? [menuSections.admin]
      : [menuSections.operator];

  const navigate = useNavigate();

  return (
    <aside className="sidebar flex w-[260px] shrink-0 flex-col border-r border-[#1F2937] bg-[#0B0E14]">

      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">

          <BrainCircuit
            size={50}
            className="text-[#A855F7]"
          />


          <div>
            <h2 className="text-white font-bold text-[16px]">
              tanya SEPUH
            </h2>

            <p className="text-[#8B95A7] text-[11px]">
              System for Equipment Problem Understanding and Handling
            </p>
          </div>

        </div>
      </div>


      <div className="flex-1 overflow-y-auto px-4">

        {visibleSections.map((section) => (
          <div key={section.title} className="mb-6">

            <h3 className="mb-2 px-3 text-[11px] uppercase tracking-widest text-[#6B7280]">
              {section.title}
            </h3>

            <nav className="space-y-1">

              {section.items.map((menu) => {
                const Icon = menu.icon;

                return (
                  <NavLink
                    key={menu.name}
                    to={menu.path}
                    end={menu.path === "/" || menu.path === "/operator"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${isActive
                        ? "bg-[#1E1B33] text-[#A78BFA]"
                        : "text-[#9CA3AF] hover:bg-[#161B22] hover:text-white"
                      }`
                    }
                  >
                    <Icon size={18} />

                    <span className="text-sm font-medium">
                      {menu.name}
                    </span>

                  </NavLink>
                );
              })}

            </nav>

          </div>
        ))}

      </div>


      <div className="border-t border-[#1F2937] px-4 py-5">

        <div className="mb-4 flex items-center justify-between rounded-xl p-2 hover:bg-[#161B22]">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold uppercase text-black">
              {role[0]}
            </div>

            <div>

              <div className="text-sm font-semibold text-white capitalize">
                {role}
              </div>

              <div className="text-xs text-[#8B95A7]">
                Shift Pagi
              </div>

            </div>

          </div>

          <LogOut
            size={18}
            className="text-[#8B95A7] hover:text-white cursor-pointer"
            onClick={() => navigate("/login")}
          />

        </div>

        <div className="flex items-center justify-between">

          <span className="text-sm text-[#9CA3AF]">
            Theme
          </span>

          <div className="flex items-center gap-2">

            <div className="h-6 w-11 rounded-full bg-[#7C3AED] p-1">
              <div className="h-4 w-4 rounded-full bg-white" />
            </div>

            <Sun
              size={18}
              className="text-[#8B95A7]"
            />

          </div>

        </div>

      </div>

    </aside>
  );
}