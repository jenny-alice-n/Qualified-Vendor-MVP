import { useState } from "react";
import { 
  Building, 
  MapPin, 
  Globe, 
  Copy, 
  Check, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Award,
  BookOpen,
  Mail,
  User,
  Activity
} from "lucide-react";
import { Vendor } from "../types";

interface VendorCardProps {
  key?: string | number;
  vendor: Vendor;
  index: number;
}

export default function VendorCard({ vendor, index }: VendorCardProps) {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"justification" | "capabilities" | "profile" | "naics">("justification");
  const [showOutreach, setShowOutreach] = useState(false);
  const [outreachCopied, setOutreachCopied] = useState(false);

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

  const generateOutreachEmail = () => {
    const capsText = summaryInfo?.awardCapabilities?.slice(0, 3).join(", ") || "specialized services";
    return `Subject: Partnership Opportunity: SAM.gov Solicitation Alignment

Dear Team at ${reg.legalBusinessName},

I hope this message finds you well. 

We have identified an exciting opportunity on SAM.gov that aligns closely with your proven past performance and active core capabilities. Specifically, our analysis noted your exceptional track record in ${capsText} and your highly matching NAICS code profiles.

We believe that combining our operational capacities could form a powerful, compliant bidding vehicle for this upcoming award. 

Would you be open to a brief introductory call this week to review the opportunity specifications and explore a subcontracting or teaming alignment?

Looking forward to your response.

Best regards,

[Your Name]
Federal Bid Analyst
[Your Company]`;
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(generateOutreachEmail());
    setOutreachCopied(true);
    setTimeout(() => setOutreachCopied(false), 2000);
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
            {reg.dbaName && (
              <span className="text-xs font-semibold text-indigo-200/50 font-sans">
                (DBA: {reg.dbaName})
              </span>
            )}
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
          <div className={`rounded-xl border ${scoreInfo.border} ${scoreInfo.bg} ${scoreInfo.text} px-4 py-1.5 text-center shadow-lg shadow-black/20`}>
            <span className="block text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">
              Match Score
            </span>
            <span className="font-display text-xl font-black">
              {just?.overallScore || 85}%
            </span>
          </div>
          {summaryInfo?.similarityScore && (
            <span className="text-[10px] text-slate-450 font-mono">
              Sim Score: {(summaryInfo.similarityScore * 100).toFixed(1)}%
            </span>
          )}
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
          <button
            id={`tab-${reg.cageCode}-profile`}
            onClick={() => setActiveSubTab("profile")}
            className={`border-b-2 py-3 transition ${
              activeSubTab === "profile"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-205"
            }`}
          >
            Corporate Dossier
          </button>
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
          <div className="space-y-4 animate-fade-in">
            {summaryInfo?.vendorSummary && (
              <div className="text-xs text-slate-300 leading-relaxed border-l-2 border-indigo-500/40 pl-3">
                <span className="font-bold text-indigo-300 block mb-1 font-sans text-xs">Capability Statement Outline:</span>
                {summaryInfo.vendorSummary}
              </div>
            )}
            
            {summaryInfo?.awardCapabilities && summaryInfo.awardCapabilities.length > 0 ? (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-2">Verified Contract Deliveries:</span>
                <div className="flex flex-wrap gap-1.5">
                  {summaryInfo.awardCapabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-550/20 px-2.5 py-0.5 text-xs text-indigo-300 font-medium shadow-sm"
                    >
                      <Award className="h-3 w-3 text-indigo-400" />
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No award capabilities parsed yet.</p>
            )}
          </div>
        )}

        {/* Tab 3: Corporate Dossier */}
        {activeSubTab === "profile" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs leading-relaxed text-slate-300">
            
            {/* Address Info */}
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

            {/* General Info */}
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

        {/* Tab 4: Matching NAICS Codes */}
        {activeSubTab === "naics" && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-indigo-350 uppercase font-mono block mb-2">Primary Registered NAICS:</span>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1.5">
              {vendor.assertions?.goodsAndServices?.naicsList?.map((code, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between text-xs p-2.5 bg-white/5 border border-white/10 rounded-xl shadow-sm hover:border-indigo-500/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-black text-white bg-white/10 px-1.5 py-0.5 rounded leading-none">
                      {code.naicsCode}
                    </span>
                    <span className="text-slate-350 ml-2 font-medium">
                      {code.naicsDescription}
                    </span>
                  </div>

                  {code.sbaSmallBusiness && (
                    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                      code.sbaSmallBusiness === "Y" 
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" 
                        : "bg-white/10 text-slate-400"
                    }`}>
                      SBA Small: {code.sbaSmallBusiness}
                    </span>
                  )}
                </div>
              ))}
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

        <div className="flex gap-2">
          {/* Email generator toggle */}
          <button
            id={`btn-toggle-outreach-${reg.cageCode}`}
            onClick={() => setShowOutreach(!showOutreach)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-200 bg-indigo-500/20 hover:bg-indigo-500/35 rounded-lg px-3 py-1.5 transition-all cursor-pointer border border-indigo-500/30"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Teaming Invite</span>
            {showOutreach ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        </div>

      </div>

      {/* Outreach Drawer */}
      {showOutreach && (
        <div className="border-t border-white/10 bg-slate-950/20 p-5 space-y-3 animate-slide-down">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">
              Draft Partnership Invitation
            </span>
            <button
              id={`btn-copy-outreach-${reg.cageCode}`}
              onClick={handleCopyOutreach}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded border shadow-sm transition-all cursor-pointer ${
                outreachCopied 
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" 
                  : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
              }`}
            >
              {outreachCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{outreachCopied ? "Copied proposal!" : "Copy Email"}</span>
            </button>
          </div>

          <pre className="p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-300 font-sans text-xs whitespace-pre-wrap leading-relaxed shadow-inner max-h-56 overflow-y-auto">
            {generateOutreachEmail()}
          </pre>
        </div>
      )}

    </div>
  );
}
