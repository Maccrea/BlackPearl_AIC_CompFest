import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Activity, Gauge, Thermometer, Zap, AlertTriangle, CheckCircle2,
  Brain, Award, ShieldCheck, XCircle, Send, Wrench, BookOpenCheck, ChevronDown, Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function MachineDiagnosticHub() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [resolvedIds, setResolvedIds] = useState([]);

  const [validationStatus, setValidationStatus] = useState("pending");
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [engineerNote, setEngineerNote] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        const fetchedMachines = Array.isArray(data) ? data : (data.data || []);
        setMachines(fetchedMachines);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data from API:", err);
        setLoading(false);
      });
  }, []);

  const attentionMachines = machines.filter(
    (m) => m.status?.toLowerCase() !== "healthy" && !resolvedIds.includes(m.id)
  );

  useEffect(() => {
    if (!loading && attentionMachines.length > 0 && !id) {
      navigate(`/operator/machine-diagnostic/${attentionMachines[0].id}`, { replace: true });
    }
  }, [loading, attentionMachines, id, navigate]);

  const selectedMachineId = id ? parseInt(id) : null;
  const machine = attentionMachines.find((m) => m.id === selectedMachineId);

  useEffect(() => {
    setValidationStatus("pending");
    setSelectedDecision(null);
    setEngineerNote("");
  }, [selectedMachineId]);

  const handleMachineChange = (e) => {
    const newId = Number(e.target.value);
    navigate(`/operator/machine-diagnostic/${newId}`);
  };

  const similarCaseData = {
    similarityScore: 92,
    caseTitle: "Motor Overheating Issue",
    previousSolution: [
      "Turn off the main power supply to the machine.",
      "Inspect and clean the air filter on the cooling system.",
      "Replace the lubricant on the bearing components if they are dry.",
      "Perform a low-speed test for 5 minutes."
    ]
  };

  const handleFixMachine = () => {
    setValidationStatus("saved");
    
    setTimeout(() => {
      setResolvedIds((prev) => [...prev, selectedMachineId]);
      
      const nextMachines = attentionMachines.filter((m) => m.id !== selectedMachineId);
      
      if (nextMachines.length > 0) {
        navigate(`/operator/machine-diagnostic/${nextMachines[0].id}`);
      } else {
        navigate("/operator"); 
      }
    }, 2000); 
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-gray-400">
        <Loader2 size={48} className="mb-4 animate-spin text-[#7C3AED]" />
        <p>Loading machine diagnostic data...</p>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <CheckCircle2 size={48} className="mb-4 text-[#10B981]" />
        <h1 className="text-xl font-bold text-white">All Systems Normal</h1>
        <p className="mt-2 text-[#8B95A7]">No machines require AI diagnosis at the moment.</p>
        <button onClick={() => navigate("/operator")} className="mt-6 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6D28D9] transition">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const generateDynamicAnalysis = (currentMachine) => {
    const anomalies = [];
    if (currentMachine.temperature > 75) anomalies.push({ parameter: "Temperature", value: currentMachine.temperature, unit: "°C", threshold: 75 });
    if (currentMachine.vibration > 4.5) anomalies.push({ parameter: "Vibration", value: currentMachine.vibration, unit: "mm/s", threshold: 4.5 });
    if (currentMachine.current > 15) anomalies.push({ parameter: "Current", value: currentMachine.current, unit: "A", threshold: 15 });
    if (currentMachine.rpm > 1550) anomalies.push({ parameter: "RPM", value: currentMachine.rpm, unit: "RPM", threshold: 1550 });

    return {
      aiPrediction: anomalies.length > 0 ? (currentMachine.status?.toLowerCase() === "critical" ? "Bearing Wear Detected" : "Motor Overheating") : "Normal Operation",
      aiConfidence: currentMachine.status?.toLowerCase() === "critical" ? 88 : 94,
      detectedAnomalies: anomalies,
    };
  };

  const dynamicAnalysis = generateDynamicAnalysis(machine);
  const hasSimilarCase = machine.status?.toLowerCase() === "warning"; 

  return (
    <div className="space-y-6 pb-12">
      <div>
        <button onClick={() => navigate("/operator")} className="mb-5 flex items-center gap-2 text-sm text-[#9CA3AF] transition hover:text-white">
          <ArrowLeft size={17} /> Back to Dashboard
        </button>

        <div className="mb-2 flex flex-col gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Diagnostic Hub</h1>
            <p className="mt-1 text-sm text-[#8B95A7]">Switch between problematic machines to view AI diagnosis.</p>
          </div>
          <div className="relative w-full sm:w-[320px]">
            <select
              value={selectedMachineId || ""}
              onChange={handleMachineChange}
              className="w-full appearance-none rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 pr-10 text-sm font-bold text-white outline-none transition focus:border-[#7C3AED]"
            >
              {attentionMachines.map((m) => (
                <option key={m.id} value={m.id}>{m.name} - {m.status.toUpperCase()}</option>
              ))}
            </select>
            <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </div>
        <MachineHeader machine={machine} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ParameterCard icon={Thermometer} label="Motor Temperature" value={`${machine.temperature}°C`} threshold={75} abnormal={machine.temperature > 75} />
        <ParameterCard icon={Activity} label="Vibration" value={`${machine.vibration} mm/s`} threshold={4.5} abnormal={machine.vibration > 4.5} />
        <ParameterCard icon={Gauge} label="Speed" value={`${machine.rpm} RPM`} threshold={1550} abnormal={machine.rpm > 1550} />
        <ParameterCard icon={Zap} label="Current" value={`${machine.current} A`} threshold={15} abnormal={machine.current > 15} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <AiDiagnosis analysis={dynamicAnalysis} />
          {hasSimilarCase ? (
            <SimilarCasePanel similarCase={similarCaseData} onFollowSOP={handleFixMachine} />
          ) : (
            <NewRecommendationPanel analysis={dynamicAnalysis} />
          )}
        </div>
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white">Machine Health</h2>
                <p className="mt-1 text-xs text-[#8B95A7]">Overall condition score</p>
              </div>
              <span className={`text-2xl font-bold ${machine.health >= 70 ? "text-[#10B981]" : machine.health >= 40 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
                {machine.health}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#1F2937]">
              <div className={`h-full rounded-full ${machine.health >= 70 ? "bg-[#10B981]" : machine.health >= 40 ? "bg-[#F59E0B]" : "bg-[#EF4444]"}`} style={{ width: `${machine.health}%` }} />
            </div>
          </div>

          {!hasSimilarCase && (
            <ValidationPanel
              status={validationStatus}
              decision={selectedDecision}
              setDecision={setSelectedDecision}
              note={engineerNote}
              setNote={setEngineerNote}
              onSave={handleFixMachine}
            />
          )}

          {hasSimilarCase && validationStatus !== "saved" && (
            <div className="rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6]"><BookOpenCheck size={28} /></div>
              <h3 className="text-lg font-bold text-white">SOP Available</h3>
              <p className="mt-2 text-sm text-[#8B95A7]">This case has been resolved previously. Operators can directly follow the SOP without re-validation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MachineHeader({ machine }) {
  const isCritical = machine.status?.toLowerCase() === "critical";
  const badgeColors = isCritical ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#F59E0B]/10 text-[#F59E0B]";
  const StatusIcon = AlertTriangle;

  return (
    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-white">{machine.name}</h1>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase ${badgeColors}`}>
            <StatusIcon size={14} /> {machine.status}
          </span>
        </div>
        <p className="mt-2 text-[#9CA3AF]">{machine.type} • {machine.line}</p>
      </div>
    </div>
  );
}

function ParameterCard({ icon: Icon, label, value, threshold, abnormal }) {
  return (
    <div className={`rounded-2xl border p-5 ${abnormal ? "border-[#EF4444]/30 bg-[#EF4444]/5" : "border-[#1F2937] bg-[#121620]"}`}>
      <div className="flex items-center justify-between text-[#8B95A7]">
        <div className="flex items-center gap-2"><Icon size={17} /> <span className="text-xs">{label}</span></div>
        {abnormal && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444]/20 text-[10px] font-bold text-[#EF4444]">!</span>}
      </div>
      <div className={`mt-3 text-2xl font-bold ${abnormal ? "text-[#EF4444]" : "text-white"}`}>{value}</div>
      <div className="mt-1 text-[11px] text-[#6B7280]">Threshold: {threshold}</div>
    </div>
  );
}

function AiDiagnosis({ analysis }) {
  return (
    <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#121620] p-6 shadow-[0_0_20px_rgba(124,58,237,0.05)]">
      <div className="mb-5 flex items-center gap-4 border-b border-[#1F2937] pb-5">
        <div className="rounded-xl bg-[#7C3AED]/10 p-3 text-[#A855F7]"><Brain size={24} /></div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">AI Diagnosis</h2>
          <p className="text-sm text-[#8B95A7]">Analysis based on recent parameter anomalies</p>
        </div>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5">
          <p className="text-xs text-[#8B95A7]">Root Cause Prediction</p>
          <p className="mt-1 text-2xl font-bold text-white">{analysis.aiPrediction}</p>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-[#8B95A7]">Confidence Level</span>
              <span className="font-bold text-[#A855F7]">{analysis.aiConfidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#1F2937]">
              <div className="h-1.5 rounded-full bg-[#A855F7]" style={{ width: `${analysis.aiConfidence}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimilarCasePanel({ similarCase, onFollowSOP }) {
  return (
    <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-[#10B981]/10 p-3 text-[#10B981]"><Award size={22} /></div>
        <div>
          <h2 className="text-lg font-bold text-white">Historical Case Match</h2>
          <p className="text-xs text-[#8B95A7]">Case similarity score <span className="font-bold text-[#10B981]">{similarCase.similarityScore}%</span></p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
          <div className="text-xs text-[#8B95A7]">Previous Successful Solution ({similarCase.caseTitle})</div>
          <ol className="mt-3 space-y-2.5">
            {similarCase.previousSolution.map((solution, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-white">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-[11px] font-bold text-[#10B981]">{idx + 1}</span>
                {solution}
              </li>
            ))}
          </ol>
          <button onClick={onFollowSOP} className="mt-5 w-full rounded-xl bg-[#10B981] py-3 text-sm font-bold text-white hover:bg-[#059669] transition">
            Mark as Resolved (Follow SOP)
          </button>
        </div>
      </div>
    </div>
  );
}

function NewRecommendationPanel({ analysis }) {
  if (!analysis.detectedAnomalies || analysis.detectedAnomalies.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6 text-center text-gray-400">
        Waiting for anomalies to be detected...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-[#F59E0B]/10 p-3 text-[#F59E0B]"><Wrench size={22} /></div>
        <div>
          <h2 className="text-lg font-bold text-white">AI Recommended Actions</h2>
          <p className="text-xs text-[#8B95A7]">New case. AI recommends actions based on parameters.</p>
        </div>
      </div>
      <div className="space-y-3">
        {analysis.detectedAnomalies.map((anomaly, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-xl border border-[#F59E0B]/20 bg-[#0B0E14] p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/20 text-[11px] font-bold text-[#F59E0B]">{idx + 1}</span>
            <div>
              <p className="text-sm font-bold text-white">Inspect {anomaly.parameter}</p>
              <p className="mt-1 text-xs text-[#8B95A7]">Detected {anomaly.value} {anomaly.unit} (threshold: {anomaly.threshold}).</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValidationPanel({ status, decision, setDecision, note, setNote, onSave }) {
  if (status === "saved") {
    return (
      <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981]"><CheckCircle2 size={28} /></div>
        <h3 className="text-lg font-bold text-white">SOP Successfully Saved</h3>
        <p className="mt-2 text-sm text-[#8B95A7]">Issue resolved. You will be redirected...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-[#3B82F6]/10 p-3 text-[#3B82F6]"><ShieldCheck size={22} /></div>
        <div>
          <h2 className="text-lg font-bold text-white">Engineer Validation</h2>
          <p className="text-xs text-[#8B95A7]">Approval required (New Case)</p>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => setDecision("approved")}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${decision === "approved" ? "border-[#10B981] bg-[#10B981]/10 text-[#10B981]" : "border-[#374151] bg-[#0B0E14] text-white hover:border-[#10B981]/50"}`}
        >
          <CheckCircle2 size={16} /> Approve Recommendation
        </button>
        <button
          onClick={() => setDecision("rejected")}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${decision === "rejected" ? "border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]" : "border-[#374151] bg-[#0B0E14] text-white hover:border-[#EF4444]/50"}`}
        >
          <XCircle size={16} /> Provide Manual Correction
        </button>
      </div>
      {decision === "rejected" && (
        <div className="mt-4 animate-in slide-in-from-top-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type engineering correction instructions here..."
            className="w-full resize-none rounded-lg border border-[#374151] bg-[#0B0E14] p-3 text-sm text-white outline-none focus:border-[#7C3AED]"
            rows={3}
          />
        </div>
      )}
      {decision && (
        <button
          onClick={onSave}
          disabled={decision === "rejected" && !note.trim()}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9] disabled:opacity-50"
        >
          <Send size={16} /> Mark as Resolved (Save SOP)
        </button>
      )}
    </div>
  );
}