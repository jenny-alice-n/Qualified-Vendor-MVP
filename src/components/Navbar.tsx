import { Building2, Share2, HelpCircle, Layers, Lightbulb } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  useLiveApi: boolean;
  appUrl: string;
  onOpenSettings: () => void;
  resultsCount: number;
  activeTab: "search" | "results" | "about";
  setActiveTab: (tab: "search" | "results" | "about") => void;
}

export default function Navbar({
  useLiveApi,
  appUrl,
  onOpenSettings,
  resultsCount,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/15 bg-slate-900/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              Federal Vendor Intelligence
            </h1>
            <p className="hidden text-xs text-slate-400 sm:block font-sans">
              SAM.gov intelligence & award analysis engine
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <nav className="flex space-x-1 sm:space-x-2">
          <button
            id="nav-tab-search"
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
              activeTab === "search"
                ? "bg-white/15 text-white border border-white/10 shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Find Vendors</span>
            <span className="sm:hidden">Find</span>
          </button>

          <button
            id="nav-tab-results"
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
              activeTab === "results"
                ? "bg-white/15 text-white border border-white/10 shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Results</span>
            {resultsCount > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {resultsCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-about"
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
              activeTab === "about"
                ? "bg-white/15 text-white border border-white/10 shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>How It Works</span>
          </button>
        </nav>

        {/* Connection status and Share */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <button
            id="btn-conn-status"
            onClick={onOpenSettings}
            className={`group hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium cursor-pointer transition-all md:flex ${
              useLiveApi
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                : "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
            }`}
            title="Click to view API settings"
          >
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse-slow ${
              useLiveApi ? "bg-emerald-400" : "bg-amber-400"
            }`} />
            <span>{useLiveApi ? "Live Mode" : "Sandbox Mode"}</span>
          </button>

          {/* Share button */}
          <button
            id="btn-share-app"
            onClick={handleShare}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all shadow-sm ${
              copied
                ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                : "border-white/10 bg-white/5 text-slate-350 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
