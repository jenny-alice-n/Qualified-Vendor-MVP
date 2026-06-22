import { HelpCircle, Terminal, Cpu, Database, Network, KeyRound } from "lucide-react";

export default function HowItWorks() {
  const sampleBody = {
    "searchText": "medical equipments",
    "startIndex": 1,
    "batchSize": 7,
    "generateJustification": true,
    "vendorSource": "AWARD_SUMMARY",
    "solicitationTitle": "Artificial Intelligence and Machine Learning Platform for Fraud Detection",
    "naicsCode": "541511",
    "setAsideType": "Total Small Business",
    "scopeOfWork": "The contractor will operate an AI/ML anomaly detection platform...",
    "estimatedValue": "$5M-$10M",
    "placeOfPerformance": "Washington, DC"
  };

  const sampleExpressReceiver = `// Live Node/Express API Receiver Example
import express from 'express';

const app = express();
app.use(express.json());

app.post('/v1/qualified-vendors', (req, res) => {
  // 1. Parse params provided by your applet
  const { searchText, naicsCode, batchSize, vendorSource } = req.body;
  
  console.log(\`Searching for [\${searchText}] in source [\${vendorSource}]\`);

  // 2. Query SAM.gov/USASpending or your own Elasticsearch database
  const matches = queryMySupplierRepository({ naicsCode, searchText, size: batchSize });

  // 3. Optional: pipeline description to Gemini to generate justifications
  const responseData = {
    totalRecords: matches.length,
    entityData: matches.map(match => ({
      entityRegistration: {
        ueiSAM: match.uei,
        cageCode: match.cage,
        legalBusinessName: match.companyName,
        registrationStatus: "Active"
      },
      justification: {
        overallScore: match.computeAlignmentScore(),
        justification: \`\${match.companyName} is selected because...\`
      }
    }))
  };

  res.json(responseData);
});

app.listen(8080);`;

  return (
    <div className="space-y-6 text-slate-300 tracking-normal leading-relaxed animate-fade-in max-w-4xl mx-auto">
      
      {/* Introduction */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <h3 className="font-display text-lg font-extrabold text-white flex items-center gap-2 sm:text-xl">
          <Cpu className="h-5.5 w-5.5 text-indigo-400" />
          The Science of Federal Sourcing
        </h3>
        <p className="text-sm text-slate-350 font-sans">
          Federal Sourcing uses structured historical federal data integrated with artificial intelligence. 
          By cross-referencing your solicitation variables with active SAM.gov registrations and historic award histories from USAspending.gov, the system identifies top-matching supplier candidates in seconds.
        </p>
 
        {/* 3 Pillars */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-3">
          <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-1.5 shadow-md">
            <Database className="h-5 w-5 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono">1. Award Mining</h4>
            <p className="text-[11px] text-slate-400">Searches past contract deliverables so you target suppliers with verifiable delivery experience.</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-1.5 shadow-md">
            <Network className="h-5 w-5 text-purple-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono">2. Semantic Search</h4>
            <p className="text-[11px] text-slate-400">Goes beyond basic keywords like "medical" to understand the full context of NAICS codes and performance scopes.</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-1.5 shadow-md">
            <KeyRound className="h-5 w-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono">3. Compliance Fit</h4>
            <p className="text-[11px] text-slate-400">Auto-evaluates set-aside suitability (SDVOSB, WOSB, etc.) and filters for active registration statuses.</p>
          </div>
        </div>
      </div>
 
      {/* API Reference Guide */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <h3 className="font-display text-base font-extrabold text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-400" />
          API Request Blueprint Specification
        </h3>
        <p className="text-xs text-slate-405 font-sans">
          When the <strong>Live API Mode</strong> is toggled active, submitting a scan triggers an HTTP <code>POST</code> request containing the following payload structure:
        </p>
 
        {/* Code Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-305 font-mono mb-1.5">JSON Express Body Payload:</span>
            <pre className="p-3.5 bg-slate-950/40 border border-white/10 text-slate-100 rounded-xl text-[11px] font-mono whitespace-pre overflow-x-auto shadow-inner leading-relaxed">
              {JSON.stringify(sampleBody, null, 2)}
            </pre>
          </div>
 
          <div className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-305 font-mono mb-1.5">Alignment Scoring Definitions:</span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">90+</span>
                <span><strong>Prime Tier Match:</strong> Impeccable technical eligibility, matching primary NAICS codes, and verifiable past delivery record with US government agencies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">80+</span>
                <span><strong>High Tier Match:</strong> Eligible socio-economic fits and active Capabilities, but may lack identical historic target descriptions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">GD</span>
                <span><strong>General Delivery:</strong> General wholesalers or services that matches primary classification headers without extensive specialized award history.</span>
              </li>
            </ul>
          </div>
        </div>
 
        {/* Code Integration Accordion */}
        <div className="pt-3">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-305 font-mono mb-2">Build your live Receiver API:</span>
          <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 p-4">
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              You can deploy this simple code snippet in your live backend server, enter the endpoint URL inside the <strong>Connection Settings Panel</strong> in your header and watch the live data populate seamlessly!
            </p>
            <pre className="p-3 bg-slate-950/40 border border-white/10 text-slate-100 rounded-lg text-[10px] font-mono whitespace-pre overflow-x-auto shadow-md leading-relaxed max-h-60">
              {sampleExpressReceiver}
            </pre>
          </div>
        </div>
      </div>
 
    </div>
  );
}
