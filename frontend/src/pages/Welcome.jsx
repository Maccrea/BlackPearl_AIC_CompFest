import React from "react";
import { ArrowRight, BrainCircuit, Factory, Activity, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080A0F] text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#2563EB]/5 blur-[120px]" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10 shadow-inner">
            <BrainCircuit size={22} className="text-[#A855F7]" />
          </div>
          <div>
            <div className="font-bold tracking-wide text-white">
              tanya SEPUH
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-[#6B7280]">
              System for Equipment Problem Understanding
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="rounded-xl border border-[#374151] px-5 py-2 text-sm font-medium text-gray-300 transition-all hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 hover:text-white"
        >
          Sign In
        </button>
      </nav>

      <main className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            
            <div>
              {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-4 py-2 text-xs font-medium text-[#A78BFA]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#A855F7]" />
                Smart Industrial Monitoring
              </div> */}

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Boost Reliability.
                <br />
                <span className="bg-gradient-to-r from-[#A855F7] to-[#6366F1] bg-clip-text text-transparent">
                  Minimize Downtime.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#9CA3AF] sm:text-lg">
                Monitor your production lines in real-time. Detect machine anomalies early and make precise maintenance decisions powered by intelligent analytics.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#7C3AED]/20 transition-all hover:bg-[#6D28D9] hover:shadow-xl hover:shadow-[#7C3AED]/30"
                >
                  Access Workspace
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() => navigate("/help")}
                  className="rounded-xl border border-[#374151] px-6 py-3.5 text-sm font-medium text-gray-300 transition-all hover:border-[#4B5563] hover:bg-white/5 hover:text-white"
                >
                  Explore Platform
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[#7C3AED]/10 blur-3xl" />
              
              <div className="relative rounded-[2rem] border border-[#1F2937] bg-[#0D1017]/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between border-b border-[#1F2937] pb-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      System Overview
                    </div>
                    <div className="mt-1 text-lg font-bold text-white">
                      Live Dashboard
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1.5 text-xs font-semibold text-[#10B981]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#10B981]" />
                    Online
                  </div>
                </div>

                <div className="space-y-3">
                  <MachinePreview
                    icon={Factory}
                    name="Production Line A"
                    status="All Systems Normal"
                    statusColor="text-[#10B981]"
                    indicatorColor="bg-[#10B981]"
                  />
                  <MachinePreview
                    icon={Activity}
                    name="Production Line B"
                    status="1 Machine Needs Attention"
                    statusColor="text-[#F59E0B]"
                    indicatorColor="bg-[#F59E0B]"
                  />
                  <MachinePreview
                    icon={Zap}
                    name="Power & Electrical"
                    status="Stable Output"
                    statusColor="text-[#10B981]"
                    indicatorColor="bg-[#10B981]"
                  />
                </div>

                <div className="mt-6 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={18} className="text-[#A855F7]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">
                      Smart Diagnostic Active
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#D1D5DB]">
                    The system is ready to analyze machine anomalies and cross-reference them with the Historical Knowledge Base for actionable repair recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-6 border-t border-[#1F2937] pt-10 sm:grid-cols-3">
            <Feature
              title="Real-time Monitoring"
              description="Monitor machine temperature, vibration, and RPM directly from a single centralized dashboard."
            />
            <Feature
              title="Anomaly Detection"
              description="The system provides automated alerts whenever machine parameters exceed safe operational thresholds."
            />
            <Feature
              title="Knowledge-Driven SOP"
              description="Leverage validated historical problem-solving records (SOPs) to accelerate repairs by your technical team."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-component for machine list
function MachinePreview({ icon: Icon, name, status, statusColor, indicatorColor }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#121620] p-4 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F2937] text-[#9CA3AF]">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{name}</div>
          <div className={`mt-0.5 text-[11px] font-medium ${statusColor}`}>
            {status}
          </div>
        </div>
      </div>
      <div className={`h-2 w-2 rounded-full ${indicatorColor} shadow-[0_0_8px_currentColor]`} />
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-2xl p-4 transition-colors hover:bg-white/[0.02]">
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#8B95A7]">
        {description}
      </p>
    </div>
  );
}