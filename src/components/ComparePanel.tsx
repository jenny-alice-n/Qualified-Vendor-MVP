import { X } from "lucide-react";
import { Vendor } from "../types";

interface ComparePanelProps {
  vendors: Vendor[];
  searchedNaics: string;
  searchedKeywords: string;
  onClose: () => void;
}

export default function ComparePanel({ vendors, searchedNaics, searchedKeywords, onClose }: ComparePanelProps) {
  const hasNaicsMatch = (vendor: Vendor) => {
    if (!searchedNaics) return false;
    return vendor.assertions?.goodsAndServices?.naicsList?.some(n => n.naicsCode === searchedNaics) || false;
  };

  if (vendors.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-300">No vendors found for comparison.</p>
          <button onClick={onClose} className="rounded-lg bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/15 transition cursor-pointer">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-auto rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-xl shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/95 backdrop-blur-xl">
          <h2 className="font-display text-lg font-bold text-white">Vendor Comparison</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Table */}
        <div className="p-4">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase font-mono w-36">Metric</th>
                {vendors.map((v, i) => (
                  <th key={i} className="px-4 py-3 text-sm font-bold text-white">
                    {v.entityRegistration.legalBusinessName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">UEI</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-slate-200 font-mono">{v.entityRegistration.ueiSAM}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">CAGE</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-slate-200 font-mono">{v.entityRegistration.cageCode}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">Address</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-slate-200">
                    {v.coreData.physicalAddress?.city}, {v.coreData.physicalAddress?.stateOrProvinceCode} {v.coreData.physicalAddress?.zipCode}
                  </td>
                ))}
              </tr>
              <tr className="bg-white/[0.02]">
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">Overall Score</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3">
                    <span className="text-lg font-black text-white">{v.justification?.overallScore ?? "—"}%</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">Technical Core</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-slate-200">{v.justification?.technicalCapability ?? "—"}/30</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">Past Performance</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-slate-200">{v.justification?.pastPerformance ?? "—"}/40</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">NAICS Fit</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-slate-200">{v.justification?.naicsSetAsideFit ?? "—"}/15</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">Agency History</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-slate-200">{v.justification?.agencyRelationship ?? "—"}/15</td>
                ))}
              </tr>
              <tr className="bg-white/[0.02]">
                <td className="px-4 py-3 text-slate-400 font-mono font-bold">NAICS Match</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3">
                    {!searchedNaics ? (
                      <span className="text-slate-500 italic">No input</span>
                    ) : hasNaicsMatch(v) ? (
                      <span className="text-emerald-300 font-bold">✓ {searchedNaics}</span>
                    ) : (
                      <span className="text-slate-500">✗ No match</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold align-top">Relevant Capabilities</td>
                {vendors.map((v, i) => {
                  const caps = v.justification?.relevantCapabilities;
                  return (
                    <td key={i} className="px-4 py-3 align-top">
                      {caps?.length ? (
                        <ul className="space-y-1">
                          {caps.map((cap, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-slate-300">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                              {cap}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic">None</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-400 font-mono font-bold align-top">Business Types</td>
                {vendors.map((v, i) => (
                  <td key={i} className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {(v.coreData.businessTypes?.businessTypeList || []).map((t, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 rounded bg-white/10 border border-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                          {t.businessTypeDesc}
                        </span>
                      ))}
                      {!(v.coreData.businessTypes?.businessTypeList?.length) && (
                        <span className="text-slate-500 italic text-[10px]">None listed</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
