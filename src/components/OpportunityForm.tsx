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
    },/*
    {
      label: "Cloud Infra — DHS",
      title: "Secure Enterprise Cloud Infrastructure & Migration Support Services",
      naics: "541512",
      setAside: "Any / Not specified",
      scope: "The Department of Homeland Security (DHS) requires expert cloud systems engineers and DevSecOps professionals to maintain, migrate, and optimize secure hybrid-cloud environments. The provider will manage Kubernetes orchestration pipelines and implement Zero Trust authorization models.",
      value: "$25M+",
      place: "Reston, VA / Remote",
      keywords: "DevSecOps, Kubernetes, Hybrid Cloud, Zero Trust, CIS Benchmarks, AWS, Azure, IAM policies",
    },*/
    /*
    {
      label: "Cybersecurity — DoD",
      title: "NIST 800-171 Compliance Auditing & Threat Identification Protocol Suite",
      naics: "541519",
      setAside: "Service-Disabled Veteran-Owned Business",
      scope: "Comprehensive penetration testing, continuous active network monitoring, vulnerability patching, and compliance auditing services to satisfy Department of Defense (DoD) CMMC Level 2 requirements for sensitive logistics programs.",
      value: "$1M–$5M",
      place: "Fort Meade, MD",
      keywords: "CMMC Level 2, NIST 800-171, vulnerability analysis, threat vector logs, pen-testing, SIEM configuration",
    },*/
    {
      label: "Facilities Mgmt — GSA",
      title: "Integrated Facilities Management and Building Operations Services",
      naics: "561210",
      setAside: "Total Small Business",
      scope: "The General Services Administration (GSA) requires a contractor to provide full-spectrum facilities management services including janitorial, HVAC maintenance, electrical systems, plumbing, grounds maintenance, pest control, and emergency repairs across 15+ federal buildings in the National Capital Region.",
      value: "$10M–$25M",
      place: "Washington, DC / Arlington, VA",
      keywords: "facilities management, HVAC, building operations, janitorial, grounds maintenance, federal buildings, preventive maintenance",
    },/*
    {
      label: "Training — OPM",
      title: "Federal Workforce Leadership Development and E-Learning Platform",
      naics: "611430",
      setAside: "SBA-Certified Women-Owned Small Business",
      scope: "The Office of Personnel Management (OPM) requires development and delivery of a comprehensive leadership training program for GS-13 through SES-level federal employees. Deliverables include an LMS platform, instructor-led virtual workshops, executive coaching, and competency assessment tools aligned with OPM's ECQs.",
      value: "$1M–$5M",
      place: "Washington, DC / Virtual",
      keywords: "leadership development, e-learning, LMS, executive coaching, federal workforce training, ECQ, competency assessment, OPM",
    },*/
    {
      label: "Environmental — EPA",
      title: "Hazardous Waste Site Assessment and Remediation Support Services",
      naics: "562910",
      setAside: "Total Small Business",
      scope: "The Environmental Protection Agency (EPA) requires qualified environmental engineering firms to conduct Phase I/II site assessments, develop remediation action plans, perform soil and groundwater sampling, and manage cleanup operations at Superfund sites. Contractor must hold relevant state certifications and maintain 24-hour emergency response capability.",
      value: "$5M–$10M",
      place: "Edison, NJ / Cincinnati, OH",
      keywords: "hazardous waste, Superfund, site remediation, groundwater sampling, environmental engineering, CERCLA, Phase II ESA, emergency response",
    },/*
    {
      label: "Telecom — FCC",
      title: "5G Spectrum Monitoring and Wireless Infrastructure Assessment",
      naics: "517312",
      setAside: "Any / Not specified",
      scope: "The Federal Communications Commission (FCC) requires specialized RF engineering services to monitor 5G spectrum utilization, detect unauthorized transmissions, assess small-cell deployment compliance, and develop interference mitigation strategies across major metropolitan areas.",
      value: "$1M–$5M",
      place: "Columbia, MD / Nationwide",
      keywords: "5G, spectrum monitoring, RF engineering, wireless infrastructure, small-cell, interference mitigation, FCC compliance, telecommunications",
    },*/
    {
      label: "Shipbuilding — Navy",
      title: "Naval Vessel Maintenance, Repair, and Overhaul (MRO) Services",
      naics: "336611",
      setAside: "Any / Not specified",
      scope: "Naval Sea Systems Command (NAVSEA) requires qualified shipyard contractors to perform depot-level maintenance, dry-dock repairs, hull preservation, propulsion system overhauls, and combat systems upgrades on DDG-51 class destroyers during scheduled maintenance availabilities.",
      value: "$25M+",
      place: "Norfolk, VA / San Diego, CA",
      keywords: "shipbuilding, naval maintenance, dry-dock, MRO, DDG-51, propulsion overhaul, hull repair, NAVSEA, combat systems",
    },
  ];

  // Primary form states - blank by default
  const [title, setTitle] = useState("");
  const [naics, setNaics] = useState("");
  const [setAside, setSetAside] = useState("Any / Not specified");
  const [scope, setScope] = useState("");
  const [value, setValue] = useState("");
  const [place, setPlace] = useState("");
  const [keywords, setKeywords] = useState("");

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
    let searchText = keywords || title;
    if (naics) searchText += `, naics: ${naics}`;
    if (setAside && setAside !== "Any / Not specified") searchText += `, setAside: ${setAside}`;
    onSearch({
      searchText,
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
          Quick Fill Solicitations:
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
            Key Requirements / Keywords
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
