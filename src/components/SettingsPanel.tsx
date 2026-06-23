import { KeyRound, Server, Sliders, ToggleLeft, ToggleRight, X, Sparkles, HelpCircle, AlertCircle } from "lucide-react";
import { SavedConnectionSettings } from "../types";

interface SettingsPanelProps {
  settings: SavedConnectionSettings;
  setSettings: (updater: (prev: SavedConnectionSettings) => SavedConnectionSettings) => void;
  isOpen: boolean;
  onClose: () => void;
  error?: string | null;
  onClearError?: () => void;
}

export default function SettingsPanel({
  settings,
  setSettings,
  isOpen,
  onClose,
  error,
  onClearError,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  const handleChange = <K extends keyof SavedConnectionSettings>(
    key: K,
    value: SavedConnectionSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform glass-card border-l border-white/10 shadow-2xl transition-all">
          <div className="flex h-full flex-col overflow-y-scroll bg-slate-950/70 backdrop-blur-xl">
            
            {/* Header */}
            <div className="border-b border-white/10 bg-slate-900/45 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 animate-pulse-slow">
                    <Sliders className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-white">
                      API Connection Wizard
                    </h2>
                  </div>
                </div>
                <button
                  id="btn-close-settings"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-405 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 px-6 py-6 space-y-6">
              
              {/* Connection Error Banner */}
              {error && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 shadow-lg shadow-black/20 animate-fade-in space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-200">Live API Error Occurred</h4>
                      <p className="text-[11px] text-red-100/75 leading-relaxed mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-red-500/10">
                    <button
                      onClick={() => {
                        handleChange("useLiveApi", false);
                        if (onClearError) onClearError();
                      }}
                      className="rounded bg-red-500/20 hover:bg-red-500/30 text-[10px] font-bold text-red-200 px-2.5 py-1 transition border border-red-500/30 cursor-pointer"
                    >
                      Use Sandbox (Offline)
                    </button>
                    {onClearError && (
                      <button
                        onClick={onClearError}
                        className="text-[10px] font-medium text-slate-400 hover:text-white px-2 py-1 transition"
                      >
                        Dismiss Error
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Integration Status Toggle */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 shadow-lg shadow-black/20 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-mono">
                      Route Controller
                    </span>
                    <h3 className="font-display text-sm font-bold text-white">
                      Enable Live API Requests
                    </h3>
                  </div>
                  <button
                    id="toggle-live-api"
                    onClick={() => handleChange("useLiveApi", !settings.useLiveApi)}
                    className="text-slate-600 cursor-pointer focus:outline-none"
                  >
                    {settings.useLiveApi ? (
                      <ToggleRight className="h-10 w-10 text-indigo-400" />
                    ) : (
                      <ToggleLeft className="h-10 w-10 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Endpoint URLs */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-display text-sm font-bold text-white">
                  <Server className="h-4 w-4 text-indigo-450 animate-pulse-slow" />
                  <span>Server Connection</span>
                </h4>

                <div className="space-y-1">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-305 mb-1 uppercase tracking-wide font-mono">
                      Target Endpoint URL
                    </label>
                    <input
                      id="input-endpoint-url"
                      type="url"
                      value={settings.endpointUrl}
                      onChange={(e) => handleChange("endpointUrl", e.target.value)}
                      placeholder="https://your-api.com/v1/qualified-vendors"
                      className="w-full rounded-lg border border-white/12 bg-black/35 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-indigo-305 mb-1 uppercase tracking-wide font-mono">
                      API Authorization Key / Token
                    </label>
                    <div className="relative">
                      <input
                        id="input-api-key"
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => handleChange("apiKey", e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="w-full rounded-lg border border-white/12 bg-black/35 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
                      />
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-indigo-305 mb-1 uppercase tracking-wide font-mono">
                      API Key Header Field
                    </label>
                    <input
                      id="input-api-key-header"
                      type="text"
                      value={settings.apiKeyHeaderName}
                      onChange={(e) => handleChange("apiKeyHeaderName", e.target.value)}
                      placeholder="X-API-Key"
                      className="w-full rounded-lg border border-white/12 bg-black/35 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payload Options */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="flex items-center gap-2 font-display text-sm font-bold text-white">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Request Payload Parameter Rules</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-305 mb-1 uppercase tracking-wide font-mono">
                      Batch Size
                    </label>
                    <input
                      id="input-batch-size"
                      type="number"
                      min={1}
                      max={50}
                      value={settings.batchSize}
                      onChange={(e) => handleChange("batchSize", parseInt(e.target.value) || 7)}
                      className="w-full rounded-lg border border-white/12 bg-black/35 px-4 py-2.5 text-sm text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-305 mb-1 uppercase tracking-wide font-mono">
                      Start Index
                    </label>
                    <input
                      id="input-start-index"
                      type="number"
                      min={1}
                      value={settings.startIndex}
                      onChange={(e) => handleChange("startIndex", parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border border-white/12 bg-black/35 px-4 py-2.5 text-sm text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-305 mb-1 uppercase tracking-wide font-mono">
                      Vendor Source
                    </label>
                    <select
                      id="select-vendor-source"
                      value={settings.vendorSource}
                      onChange={(e) => handleChange("vendorSource", e.target.value)}
                      className="w-full rounded-lg border border-white/12 bg-black/35 px-4 py-2.5 text-sm text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none"
                    >
                      <option value="VENDOR_SUMMARY" className="bg-slate-900 text-white">VENDOR_SUMMARY</option>
                      <option value="AWARD_SUMMARY" className="bg-slate-900 text-white">AWARD_SUMMARY</option>
                      <option value="MIXED" className="bg-slate-900 text-white">MIXED</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-1">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-semibold text-indigo-305 uppercase tracking-wide font-mono">
                        Generate AI Justification
                      </span>
                    </div>
                    <button
                      id="toggle-generate-just"
                      onClick={() => handleChange("generateJustification", !settings.generateJustification)}
                      className="rounded-lg bg-white/10 p-1 hover:bg-white/15"
                    >
                      {settings.generateJustification ? (
                        <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">ON</span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded">OFF</span>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-slate-900/40 px-6 py-4">
              <button
                id="btn-save-wizard"
                onClick={onClose}
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-550 hover:to-purple-550 transition-all cursor-pointer"
              >
                Apply & Save Settings
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
