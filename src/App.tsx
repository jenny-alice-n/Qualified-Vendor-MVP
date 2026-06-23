import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  AlertCircle,
  Info,
  Activity
} from "lucide-react";
import { SavedConnectionSettings, Vendor, SearchResponse } from "./types";
import { defaultMockResponse } from "./data/mockVendors";
import Navbar from "./components/Navbar";
import SettingsPanel from "./components/SettingsPanel";
import OpportunityForm from "./components/OpportunityForm";
import VendorCard from "./components/VendorCard";
import ComparePanel from "./components/ComparePanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<"search" | "results">("search");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchedNaics, setSearchedNaics] = useState("");
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);
  const [searchedKeywords, setSearchedKeywords] = useState("");

  // Load and manage saved live-connection parameters from localStorage
  const [settings, setSettings] = useState<SavedConnectionSettings>(() => {
    const saved = localStorage.getItem("sam_fvi_settings_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          bypassBackendProxy: parsed.bypassBackendProxy ?? false,
        };
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      endpointUrl: "",
      apiKey: "",
      apiKeyHeaderName: "X-API-Key",
      batchSize: 7,
      startIndex: 1,
      vendorSource: "AWARD_SUMMARY",
      generateJustification: true,
      useLiveApi: false,
      bypassBackendProxy: false,
    };
  });

  // Persist configurations upon changes
  useEffect(() => {
    localStorage.setItem("sam_fvi_settings_v1", JSON.stringify(settings));
  }, [settings]);

  // Current queried list of matching SAM vendors
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // App Sharing URL
  const appUrl = "https://ais-pre-vu47tdf4uy7utbxckfpxsq-1057002491055.asia-southeast1.run.app";

  const handleSearch = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    if (settings.useLiveApi) {
      if (!settings.endpointUrl || !settings.endpointUrl.trim()) {
        setError("Your Live API Target Endpoint URL is empty. Please enter a valid URL in the Connection Settings Panel, or toggle off 'Live API Requests' to run in Sandbox Mode.");
        setIsSettingsOpen(true);
        setIsLoading(false);
        return;
      }
      
      const endpointTrimmed = settings.endpointUrl.trim();
      if (!endpointTrimmed.startsWith("http://") && !endpointTrimmed.startsWith("https://")) {
        setError("Your Live API Endpoint URL must start with 'http://' or 'https://'. Please fix it in the Connection Settings Panel or deactivate Live Mode.");
        setIsSettingsOpen(true);
        setIsLoading(false);
        return;
      }

      // Switch tab "results" directly to show loading transition states
      setActiveTab("results");

      try {
        const payload = {
          endpointUrl: settings.endpointUrl,
          apiKey: settings.apiKey,
          apiKeyHeaderName: settings.apiKeyHeaderName,
          searchText: formData.searchText,
          startIndex: settings.startIndex,
          batchSize: settings.batchSize,
          generateJustification: settings.generateJustification,
          vendorSource: settings.vendorSource,
          
          // Enrich with sub-fields defined on form
          solicitationTitle: formData.solicitationTitle,
          naicsCode: formData.naicsCode,
          setAsideType: formData.setAsideType,
          scopeOfWork: formData.scopeOfWork,
          estimatedValue: formData.estimatedValue,
          placeOfPerformance: formData.placeOfPerformance,
        };

        let response;
        if (settings.bypassBackendProxy) {
          // Direct Client-Side Request: Execute search from user's current network (VPN allowed)
          console.log("[Direct Fetch] Sending query directly from browser to:", settings.endpointUrl);
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };
          if (settings.apiKey && settings.apiKeyHeaderName) {
            headers[settings.apiKeyHeaderName] = settings.apiKey;
            // Support Bearer auth format fallback if standard header is Authorization
            if (settings.apiKeyHeaderName.toLowerCase() === "authorization" && !settings.apiKey.toLowerCase().startsWith("bearer ")) {
              headers[settings.apiKeyHeaderName] = `Bearer ${settings.apiKey}`;
            }
          }
          try {
            response = await fetch(settings.endpointUrl.trim(), {
              method: "POST",
              headers,
              body: JSON.stringify({
                searchText: formData.searchText,
                startIndex: settings.startIndex,
                batchSize: settings.batchSize,
                generateJustification: settings.generateJustification,
                vendorSource: settings.vendorSource,
                solicitationTitle: formData.solicitationTitle,
                naicsCode: formData.naicsCode,
                setAsideType: formData.setAsideType,
                scopeOfWork: formData.scopeOfWork,
                estimatedValue: formData.estimatedValue,
                placeOfPerformance: formData.placeOfPerformance,
              }),
            });
          } catch (fetchErr: any) {
            console.error("Direct browser fetch block:", fetchErr);
            throw new Error(`Direct connection failed. If you see CORS warnings, configure your VPN endpoints to respond with 'Access-Control-Allow-Origin: *', or check your browser console for security restrictions. Context: ${fetchErr.message || fetchErr}`);
          }
        } else {
          // Standard proxied request through Node server container (avoids browser CORS, but requires public API access)
          console.log("[Proxy Fetch] Querying through Node container server proxy...");
          response = await fetch("/api/query-vendors", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${response.status} Error: ${response.statusText || "(API returned error status)"}`);
        }

        const data: SearchResponse = await response.json();
        
        if (data && Array.isArray(data.entityData)) {
          setVendors(data.entityData);
          setTotalRecords(data.totalRecords || data.entityData.length);
          setSearchedNaics(formData.naicsCode || "");
          setSearchedKeywords(`${formData.solicitationTitle || ""} ${formData.keywordsList || ""}`);
          setSelectedForCompare([]);
          setShowCompareView(false);
          setSearchPerformed(true);
        } else {
          throw new Error("Invalid API response format. Missing 'entityData' array.");
        }
      } catch (err: any) {
        console.error("Search failed:", err);
        setError(err.message || "An unexpected network or gateway error occurred.");
        // Revert back so user can review/edit settings
        setActiveTab("search");
        setIsSettingsOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Switch tab "results" directly to show loading transition states
      setActiveTab("results");
      // Offline Sandbox Mode: Simulated analysis using the high-fidelity mock vendors
      console.log("[Sandbox] Searching mock database for:", formData.searchText);
      
      // Artificial delay to make search process feels incredibly rich
      setTimeout(() => {
        let list = [...defaultMockResponse.entityData];
        const searchRaw = (formData.searchText || "").toLowerCase();

        // Perform smart dynamic client-filtering inside sandbox!
        if (searchRaw && searchRaw !== "medical equipments") {
          list = list.filter((v) => {
            const name = v.entityRegistration.legalBusinessName.toLowerCase();
            const desc = (v.vendorSummaryInfo?.vendorSummary || "").toLowerCase();
            const just = (v.justification?.justification || "").toLowerCase();
            const types = (v.coreData.businessTypes?.businessTypeList || [])
              .map((t) => t.businessTypeDesc.toLowerCase())
              .join(" ");

            return name.includes(searchRaw) || desc.includes(searchRaw) || just.includes(searchRaw) || types.includes(searchRaw);
          });
        }

        // If no filter matched, keep the whole set so they can always view the gorgeous cards!
        if (list.length === 0) {
          list = [...defaultMockResponse.entityData];
        }

        // Apply pagination limit (batchSize)
        const paginatedList = list.slice(0, settings.batchSize);

        setVendors(paginatedList);
        setTotalRecords(list.length);
        setSearchedNaics(formData.naicsCode || "");
        setSearchedKeywords(`${formData.solicitationTitle || ""} ${formData.keywordsList || ""}`);
        setSelectedForCompare([]);
        setShowCompareView(false);
        setSearchPerformed(true);
        setIsLoading(false);
      }, 1200);
    }
  };

  const handleResetSearch = () => {
    setVendors([]);
    setTotalRecords(0);
    setSearchPerformed(false);
    setActiveTab("search");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Navbar Header */}
      <Navbar
        useLiveApi={settings.useLiveApi}
        appUrl={appUrl}
        onOpenSettings={() => setIsSettingsOpen(true)}
        resultsCount={vendors.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Floating warning when using live configuration in empty state */}
      {!settings.useLiveApi && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-300 font-sans font-medium flex items-center justify-center gap-1.5 shrink-0">
          <Info className="h-4 w-4 shrink-0 text-amber-450" />
          <span>Currently in <strong>Sandbox Mode</strong>. Click <strong><button onClick={() => setIsSettingsOpen(true)} className="underline hover:text-indigo-300 font-bold transition">Connection Drawer</button></strong> to bridge with your live API endpoint.</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Tab 1: Sourcing Form */}
        {activeTab === "search" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Header info */}
            <div className="text-center space-y-2 max-w-2xl mx-auto mb-4">
              <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl bg-gradient-to-r from-indigo-300 via-purple-350 to-pink-350 bg-clip-text text-transparent">
                Identify Top Bidding Vendors
              </h2>
            </div>

            {/* Sourcing Error Banner */}
            {error && (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5 shadow-xl max-w-4xl mx-auto animate-fade-in space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-red-500/15 p-2 text-red-100 border border-red-500/20 shrink-0 mt-0.5">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-bold text-red-200">Connection Failed</h3>
                    <p className="text-xs text-red-150/75 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 pl-12">
                  <button
                    onClick={() => {
                      setSettings((prev) => ({ ...prev, useLiveApi: false }));
                      setError(null);
                    }}
                    className="rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-250 px-3.5 py-1.5 transition-all border border-red-500/35 cursor-pointer"
                  >
                    Switch back to Sandbox (Offline Mode)
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-350 px-3.5 py-1.5 transition-all border border-white/10 cursor-pointer"
                  >
                    Adjust API Endpoint URL in Drawer
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs font-medium text-slate-405 hover:text-white px-2 py-1.5 transition"
                  >
                    Dismiss Warning
                  </button>
                </div>
              </div>
            )}

            <OpportunityForm
              onSearch={handleSearch}
              isLoading={isLoading}
              activeLiveMode={settings.useLiveApi}
            />
          </div>
        )}

        {/* Tab 2: Sourcing Results Screen */}
        {activeTab === "results" && (
          <div className="space-y-6">
            
            {/* Loading Grid Skeleton */}
            {isLoading ? (
              <div className="space-y-6 py-12 max-w-4xl mx-auto">
                <div className="text-center space-y-4">
                  <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Activity className="h-6 w-6 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white animate-pulse">Running Analytics pipeline...</h3>
                  </div>
                </div>

                {/* Skeletons */}
                <div className="space-y-4 pt-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 animate-pulse backdrop-blur-md">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="h-5 w-48 rounded bg-white/15" />
                          <div className="h-3 w-32 rounded bg-white/10" />
                        </div>
                        <div className="h-10 w-16 rounded bg-white/10" />
                      </div>
                      <div className="h-2 w-full rounded bg-white/5" />
                      <div className="space-y-1">
                        <div className="h-3 w-full rounded bg-white/5" />
                        <div className="h-3 w-5/6 rounded bg-white/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Results Display Mode
              <div className="space-y-6 max-w-5xl mx-auto">
                
                {/* Results Stats header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/12 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-xl">
                  <div>
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest font-mono block">
                      Compliance Sourcing Report
                    </span>
                    <h3 className="font-display text-lg font-black text-white mt-0.5">
                      Sourced qualified candidates ({vendors.length} matched)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">

                    {searchPerformed && (
                      <button
                        id="btn-clear-search"
                        onClick={handleResetSearch}
                        className="rounded-xl bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 text-xs font-semibold hover:border-white/20 transition cursor-pointer border border-white/10"
                      >
                        Reset Candidates
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid list of cards */}
                {vendors.length > 0 ? (
                  <div className="space-y-6">
                    {[...vendors].sort((a, b) => (b.justification?.overallScore || 0) - (a.justification?.overallScore || 0)).map((vendor, index) => (
                      <VendorCard
                        key={vendor.entityRegistration.ueiSAM || index}
                        vendor={vendor}
                        index={index}
                        searchedNaics={searchedNaics}
                        isSelectedForCompare={selectedForCompare.includes(vendor.entityRegistration.ueiSAM)}
                        onToggleCompare={() => {
                          const id = vendor.entityRegistration.ueiSAM;
                          if (!id) return;
                          setSelectedForCompare(prev =>
                            prev.includes(id)
                              ? prev.filter(x => x !== id)
                              : prev.length < 4 ? [...prev, id] : prev
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center max-w-md mx-auto space-y-4 shadow-xl backdrop-blur-xl">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-indigo-400 border border-white/10">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-white">No matching vendors located</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Try modifying search keywords or clearing NAICS filter checks.
                      </p>
                    </div>
                    <button
                      id="btn-retry-search"
                      onClick={() => setActiveTab("search")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition cursor-pointer"
                    >
                      Modify Parameters
                    </button>
                  </div>
                )}
                
              </div>
            )}
            
          </div>
        )}

      </main>

      {/* Floating Compare Bar */}
      {selectedForCompare.length >= 2 && activeTab === "results" && !isLoading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-slate-900/95 backdrop-blur-xl px-5 py-3 shadow-2xl">
          <span className="text-xs font-semibold text-slate-300">{selectedForCompare.length} vendors selected</span>
          <button
            onClick={() => setShowCompareView(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition cursor-pointer"
          >
            Compare
          </button>
          <button
            onClick={() => setSelectedForCompare([])}
            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/15 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Compare Panel Overlay */}
      {showCompareView && (
        <ComparePanel
          vendors={vendors.filter(v => selectedForCompare.includes(v.entityRegistration.ueiSAM))}
          searchedNaics={searchedNaics}
          searchedKeywords={searchedKeywords}
          onClose={() => setShowCompareView(false)}
        />
      )}

      {/* Settings Side Drawer Panel */}
      <SettingsPanel
        settings={settings}
        setSettings={setSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        error={error}
        onClearError={() => setError(null)}
      />

      {/* Portal Footer */}
      <footer className="bg-slate-950/40 border-t border-white/10 py-6 mt-12 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 space-y-1 sm:px-6 lg:px-8">
          <p>© 2026 Qualified Vendor MVP</p>
        </div>
      </footer>

    </div>
  );
}
