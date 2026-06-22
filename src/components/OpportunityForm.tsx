import React, { useState } from "react";
import { Sparkles, HelpCircle, FileText, Globe, Search, ArrowRight, Lightbulb } from "lucide-react";

interface OpportunityFormProps {
  onSearch: (formData: any) => void;
  isLoading: boolean;
  activeLiveMode: boolean;
}

export default function OpportunityForm({
  onSearch,
  isLoading,
  activeLiveMode,
}: OpportunityFormProps) {
  // Preset solicitation payloads to support the beautiful "Quick Fill" options from the screenshot
  const quickFills = [
    {
      label: "Healthcare IT — VA",
      title: "Medical Equipment Preventive Maintenance and Patient Mobility Supply",
      naics: "423450",
      setAside: "Veteran-Owned Small Business",
      scope: "The Department of Veterans Affairs (VA) requires enterprise-level procurement, preventive maintenance, repair, and distribution of state-of-the-art medical devices. This includes surgical tables, patient monitors, diagnostic imaging systems, manual wheelchairs, portable ultrasound systems, and specialized clinical software integrations to ensure safe, continuous health delivery.",
      value: "$5M–$10M",
      place: "Austin, TX / Grand Rapids, MI",
      keywords: "medical equipment, surgical tables, patient safety, ultrasound, wheelchair, sterilizers, healthcare logistics",
    },
    {
      label: "Fraud Detection — SSA",
      title: "Artificial Intelligence and Machine Learning Platform for Fraud Detection at the Social Security Administration",
      naics: "541511",
      setAside: "Any / Not specified",
      scope: "The Social Security Administration (SSA) Office of Anti-Fraud Programs requires a contractor to design, develop, and operate an AI/ML-powered fraud detection platform capable of processing 10+ million benefit transactions daily in near real-time. The platform shall include supervised and unsupervised ML models for anomaly detection, model explainability layer, and MLOps pipeline.",
      value: "$10M–$25M",
      place: "Washington, DC",
      keywords: "AI/ML, fraud detection, anomaly detection, MLOps, model explainability, OMB M-24-10, real-time processing, FedRAMP",
    },
    {
      label: "Cloud Infra — DHS",
      title: "Secure Enterprise Cloud Infrastructure & Migration Support Services",
      naics: "541512",
      setAside: "Any / Not specified",
      scope: "The Department of Homeland Security (DHS) requires expert cloud systems engineers and DevSecOps professionals to maintain, migrate, and optimize secure hybrid-cloud environments. The provider will manage Kubernetes orchestration pipelines and implement Zero Trust authorization models.",
      value: "$25M+",
      place: "Reston, VA / Remote",
      keywords: "DevSecOps, Kubernetes, Hybrid Cloud, Zero Trust, CIS Benchmarks, AWS, Azure, IAM policies",
    },
    {
      label: "Cybersecurity — DoD",
      title: "NIST 800-171 Compliance Auditing & Threat Identification Protocol Suite",
      naics: "541519",
      setAside: "Service-Disabled Veteran-Owned Business",
      scope: "Comprehensive penetration testing, continuous active network monitoring, vulnerability patching, and compliance auditing services to satisfy Department of Defense (DoD) CMMC Level 2 requirements for sensitive logistics programs.",
      value: "$1M–$5M",
      place: "Fort Meade, MD",
      keywords: "CMMC Level 2, NIST 800-171, vulnerability analysis, threat vector logs, pen-testing, SIEM configuration",
    },
  ];

  // Primary form states prefilled with the SSA Fraud Detection opportunity as default
  const [title, setTitle] = useState(quickFills[1].title);
  const [naics, setNaics] = useState(quickFills[1].naics);
  const [setAside, setSetAside] = useState(quickFills[1].setAside);
  const [scope, setScope] = useState(quickFills[1].scope);
  const [value, setValue] = useState(quickFills[1].value);
  const [place, setPlace] = useState(quickFills[1].place);
  const [keywords, setKeywords] = useState(quickFills[1].keywords);

  const applyQuickFill = (fill: typeof quickFills[0]) => {
    setTitle(fill.title);
    setNaics(fill.naics);
    setSetAside(fill.setAside);
    setScope(fill.scope);
    setValue(fill.value);
    setPlace(fill.place);
    setKeywords(fill.keywords);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchText: keywords || title,
      solicitationTitle: title,
      naicsCode: naics,
      setAsideType: setAside,
      scopeOfWork: scope,
      estimatedValue: value,
      placeOfPerformance: place,
      keywordsList: keywords,
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 shadow-2.5xl sm:p-6 lg:p-8">
      
      {/* Introduction Banner */}
      <div className="mb-6 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            Define Solicitation Opportunities
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Parameters entered below are automatically bundled into the JSON payload requested by your API.
          </p>
        </div>

        {activeLiveMode && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 self-start md:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-slow" />
            Wired to Live Endpoint
          </div>
        )}
      </div>

      {/* Quick Fill Buttons */}
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-305 block mb-2 font-mono">
          🚀 One-Click Quick Fill Solicitations:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickFills.map((fill) => (
            <button
              id={`btn-quickfill-${fill.label.replace(/\s+/g, "-").toLowerCase()}`}
              key={fill.label}
              type="button"
              onClick={() => applyQuickFill(fill)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 font-medium hover:border-indigo-400 hover:bg-indigo-500/15 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              {fill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Requirement Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 font-sans">
            Solicitation Title
          </label>
          <input
            id="form-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Artificial Intelligence Platform for Fraud Detection"
            className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-black/35 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
          />
        </div>

        {/* NAICS & Set-Aside Inputs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 font-sans">
              NAICS Code
            </label>
            <input
              id="form-naics"
              type="text"
              value={naics}
              onChange={(e) => setNaics(e.target.value)}
              placeholder="e.g. 541511"
              className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-black/35 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 font-sans">
              Set-aside Type
            </label>
            <select
              id="form-set-aside"
              value={setAside}
              onChange={(e) => setSetAside(e.target.value)}
              className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:bg-black/35 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
            >
              <option value="Any / Not specified" className="bg-slate-900 text-white">Any / Not specified</option>
              <option value="Total Small Business" className="bg-slate-900 text-white">Total Small Business</option>
              <option value="Veteran-Owned Small Business" className="bg-slate-900 text-white">Veteran-Owned Small Business (VOSB)</option>
              <option value="Service-Disabled Veteran-Owned Business" className="bg-slate-900 text-white">Service-Disabled Veteran-Owned (SDVOSB)</option>
              <option value="SBA-Certified Women-Owned Small Business" className="bg-slate-900 text-white">SBA Women-Owned (WOSB)</option>
              <option value="Minority-Owned Business" className="bg-slate-900 text-white">Minority-Owned Business</option>
              <option value="AbilityOne Non Profit Agency" className="bg-slate-900 text-white">AbilityOne Non Profit</option>
            </select>
          </div>
        </div>

        {/* Scope of Work */}
        <div>
          <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 font-sans">
            Scope of Work / Opportunity Description
          </label>
          <textarea
            id="form-scope"
            rows={5}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="Describe the clinical, engineering, administrative, or analytical needs..."
            className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-black/35 focus:ring-1 focus:ring-indigo-400 transition-all outline-none font-sans leading-relaxed"
          />
        </div>

        {/* Value and Performance Place */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 font-sans">
              Estimated Contract Value
            </label>
            <input
              id="form-value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. $5M–$10M"
              className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-black/35 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 font-sans">
              Place of Performance
            </label>
            <input
              id="form-place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. Washington, DC"
              className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-black/35 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 font-sans">
            Key Requirements / Keywords (Transmitted as <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 font-mono">searchText</code>)
          </label>
          <input
            id="form-keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. medical equipment, surgical tables, patient safety, ultrasound, wheelchair"
            className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-black/35 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            id="btn-find-vendors"
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-center text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:from-indigo-550 hover:to-purple-550 focus:outline-none focus:ring-2 focus:ring-indigo-405 disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Bid & Sourcing Candidates...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Find Qualified Vendors</span>
                <ArrowRight className="h-4 w-4 text-indigo-200 ml-1" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
