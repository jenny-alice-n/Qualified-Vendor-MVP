import { useState } from "react";
import { 
  MapPin, 
  Copy, 
  Check, 
  ShieldCheck, 
  Calendar, 
  ExternalLink,
} from "lucide-react";
import { Vendor } from "../types";

interface VendorCardProps {
  vendor: Vendor;
  index: number;
  searchedNaics?: string;
  isSelectedForCompare?: boolean;
  onToggleCompare?: () => void;
}

export default function VendorCard({ vendor, index, searchedNaics, isSelectedForCompare, onToggleCompare }: VendorCardProps) {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"justification" | "capabilities" | "profile" | "naics">("justification");

  const reg = vendor.entityRegistration;
  const core = vendor.coreData;
  const just = vendor.justification;
  const summaryInfo = vendor.vendorSummaryInfo;
  
  // Extract business types description list
  const businessTypes = core.businessTypes?.businessTypeList || [];
  
  // Colors based on score range
  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20", fill: "bg-emerald-500" };
    if (score >= 80) return { bg: "bg-indigo-500/10", text: "text-indigo-305", border: "border-indigo-500/20", fill: "bg-indigo-500" };
    return { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/20", fill: "bg-amber-500" };
  };

  const scoreInfo = getScoreColor(just?.overallScore || 85);

  const handleCopyUei = () => {
    if (reg.ueiSAM) {
      navigator.clipboard.writeText(reg.ueiSAM);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-slide-up">
      
      {/* Card Header Banner */}
      <div className={`px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 bg-slate-900/30`}>
        
        {/* Company Title */}
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-extrabold text-white tracking-tight sm:text-lg">
              {reg.legalBusinessName}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400 animate-fade-in">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              Active in SAM
            </span>
            <span className="text-white/10">•</span>
            <span>CAGE: <strong className="text-indigo-200 font-mono font-medium">{reg.cageCode || "N/A"}</strong></span>
            <span className="text-white/10">•</span>
            <span className="flex items-center gap-1 font-mono">
              UEI: <strong className="text-indigo-200 font-medium">{reg.ueiSAM || "N/A"}</strong>
              {reg.ueiSAM && (
                <button
                  id={`btn-copy-uei-${reg.ueiSAM}`}
                  onClick={handleCopyUei}
                  className="rounded p-1 text-slate-405 hover:bg-white/10 hover:text-white transition"
                  title="Copy Uni Entity ID to clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-450" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              )}
            </span>
          </div>
        </div>

        {/* Alignment Score Badge */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
          {onToggleCompare && (
            <button
              onClick={onToggleCompare}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer border ${
                isSelectedForCompare
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isSelectedForCompare ? "✓ Selected" : "Compare"}
            </button>
          )}
          <div className="rounded-xl border border-white/15 bg-white/5 text-white px-4 py-1.5 text-center shadow-lg shadow-black/20">
            <span className="block text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">
              Match Score
            </span>
            <span className="font-display text-xl font-black">
              {just?.overallScore || 85}%
            </span>
          </div>
        </div>

      </div>

      {/* Business Classification Pills (SBA / Socioeconomic Certifications) */}
      {businessTypes.length > 0 && (
        <div className="px-5 py-2.5 bg-slate-900/10 border-b border-white/10 flex flex-wrap gap-1.5">
          {businessTypes.slice(0, 5).map((t, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded bg-white/10 border border-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase tracking-wide font-sans shadow-2xs"
            >
              <ShieldCheck className="h-3 w-3 text-indigo-400" />
              {t.businessTypeDesc}
            </span>
          ))}
          {businessTypes.length > 5 && (
            <span className="text-[10px] font-medium text-slate-500 self-center">
              +{businessTypes.length - 5} classifications
            </span>
          )}
        </div>
      )}

      {/* Core Tabs Menu */}
      <div className="border-b border-white/10 px-5 bg-slate-900/20">
        <div className="flex space-x-4 sm:space-x-6 text-xs font-semibold">
          <button
            id={`tab-${reg.cageCode}-justification`}
            onClick={() => setActiveSubTab("justification")}
            className={`border-b-2 py-3 transition ${
              activeSubTab === "justification"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-205"
            }`}
          >
            AI Justification
          </button>
          <button
            id={`tab-${reg.cageCode}-capabilities`}
            onClick={() => setActiveSubTab("capabilities")}
            className={`border-b-2 py-3 transition ${
              activeSubTab === "capabilities"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-205"
            }`}
          >
            Award Capabilities
          </button>
          {/* <button
            id={`tab-${reg.cageCode}-profile`}
            onClick={() => setActiveSubTab("profile")}
            className={`border-b-2 py-3 transition ${
              activeSubTab === "profile"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-205"
            }`}
          >
            Corporate Dossier
          </button> */}
          <button
            id={`tab-${reg.cageCode}-naics`}
            onClick={() => setActiveSubTab("naics")}
            className={`border-b-2 py-3 transition ${
              activeSubTab === "naics"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-205"
            }`}
          >
            NAICS Fits
          </button>
        </div>
      </div>

      {/* Tab Contents Frame */}
      <div className="p-5 min-h-[170px] bg-transparent">
        
        {/* Tab 1: AI Justification */}
        {activeSubTab === "justification" && (
          <div className="space-y-4">
            <div className="text-sm text-slate-300 leading-relaxed font-sans">
              <p>{just?.justification || "No justification analysis available. Fill opportunity data and research vendors to analyze."}</p>
            </div>
            
            {/* Grid scores */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
              {[
                { label: "Technical Core", val: just?.technicalCapability || 28, max: 30 },
                { label: "Past Performance", val: just?.pastPerformance || 38, max: 40 },
                { label: "NAICS Fit", val: just?.naicsSetAsideFit || 15, max: 15 },
                { label: "Agency History", val: just?.agencyRelationship || 7, max: 15 }
              ].map((subScore, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2.5 shadow-sm">
                  <span className="text-[10px] text-indigo-300 font-bold block leading-none mb-1 uppercase font-mono">{subScore.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-white">{subScore.val}</span>
                    <span className="text-[10px] text-slate-450 font-medium">/{subScore.max}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${scoreInfo.fill}`} 
                      style={{ width: `${(subScore.val / subScore.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Award Capabilities */}
        {activeSubTab === "capabilities" && (
          <div className="animate-fade-in">
            {summaryInfo?.awardCapabilities && summaryInfo.awardCapabilities.length > 0 ? (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-3">Award Capabilities:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-300">
                  {summaryInfo.awardCapabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No award capabilities parsed yet.</p>
            )}
          </div>
        )}

        {/* Tab 3: Corporate Dossier - commented out
        {activeSubTab === "profile" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs leading-relaxed text-slate-300">
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-indigo-350 uppercase font-mono block">Mailing & Physical Location</span>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2 shadow-md">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">{core.physicalAddress?.addressLine1 || "No physical address"}</p>
                  <p className="text-slate-300">{core.physicalAddress?.city}, {core.physicalAddress?.stateOrProvinceCode} {core.physicalAddress?.zipCode}</p>
                  <p className="text-slate-450 uppercase font-bold tracking-wide mt-1">Country Code: {core.physicalAddress?.countryCode || "USA"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-indigo-350 uppercase font-mono block">Dossier Details</span>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1.5 shadow-md">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-400">Structure</span>
                  <span className="font-bold text-white">{core.generalInformation?.entityStructureDesc || "LLC / Partnership"}</span>
                </div>
                {core.entityInformation?.entityURL && (
                  <div className="flex justify-between border-b border-white/5 pb-1 items-center">
                    <span className="text-slate-400">Website</span>
                    <a 
                      href={core.entityInformation?.entityURL} 
                      target="_blank" 
                      referrerPolicy="no-referrer" 
                      className="text-indigo-300 font-bold hover:text-indigo-200 hover:underline flex items-center gap-0.5"
                    >
                      <span>{core.entityInformation?.entityURL.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Date</span>
                  <span className="font-medium text-white">{reg.registrationDate || "N/A"}</span>
                </div>
              </div>
            </div>

          </div>
        )}
        */}

        {/* Tab 4: Matching NAICS Codes */}
        {activeSubTab === "naics" && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-indigo-350 uppercase font-mono block mb-2">Registered NAICS Codes:</span>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1.5">
              {vendor.assertions?.goodsAndServices?.naicsList?.map((code, idx) => {
                const isMatch = searchedNaics && code.naicsCode === searchedNaics;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center text-xs p-2.5 rounded-xl shadow-sm ${
                      isMatch
                        ? "bg-emerald-500/15 border border-emerald-500/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <span className={`font-mono font-black px-1.5 py-0.5 rounded leading-none ${
                      isMatch ? "text-emerald-300 bg-emerald-500/20" : "text-white bg-white/10"
                    }`}>
                      {code.naicsCode}
                    </span>
                    <span className={`ml-2 font-medium ${isMatch ? "text-emerald-200" : "text-slate-350"}`}>
                      {code.naicsDescription}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Card Actions Bottom */}
      <div className="bg-slate-900/30 border-t border-white/10 px-5 py-3 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>Activation: <strong className="text-slate-300 font-medium">{reg.activationDate || "Active"}</strong></span>
        </div>

      </div>

    </div>
  );
}
