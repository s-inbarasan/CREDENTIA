import React, { useState, useEffect } from 'react';
import { 
  Cpu, FileCode, Search, Shield, Zap, Lock, Terminal, Activity, Tickets, Server, BookOpen, AlertOctagon, Info, Code, Aperture as ApertureIcon, X, Copy, Check, PlugZap, Radar,
  ChevronDown, ChevronUp, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import zxcvbn from 'zxcvbn';

// --- Utility Components ---

const CollapsibleToolCard: React.FC<{ 
  title: string; 
  description: string;
  usage: string;
  icon: React.ComponentType<{ className?: string }>; 
  colorClass: string; 
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, description, usage, icon: Icon, colorClass, children, isExpanded, onToggle }) => {
  return (
    <div className={cn(
      "bg-cyber-card/45 border rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col",
      isExpanded 
        ? "border-cyber-blue/45 shadow-[0_0_30px_rgba(0,242,255,0.06)] bg-cyber-card/90" 
        : "border-white/5 hover:border-white/15 hover:bg-cyber-card/60"
    )}>
      {/* Header Bar */}
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full p-5 text-left transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3.5 pr-4 overflow-hidden w-full">
          <div className={cn(
            "p-2.5 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center shrink-0 transition-all",
            isExpanded ? "border-cyber-blue/20 bg-cyber-blue/5 text-cyber-blue" : "text-white/70"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm md:text-base font-bold tracking-tight text-white uppercase">{title}</h3>
            {!isExpanded && (
              <p className="text-[11px] md:text-xs text-white/40 truncate font-medium mt-0.5">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className={cn(
            "w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/50 transition-all",
            isExpanded ? "rotate-180 border-cyber-blue/30 text-cyber-blue bg-cyber-blue/5" : "group-hover:bg-white/10 group-hover:text-white"
          )}>
            <ChevronDown className="w-4 h-4 transition-transform duration-300" />
          </div>
        </div>
      </button>

      {/* Expanded Content with Framer Motion */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-1 border-t border-white/5 flex flex-col gap-6 bg-black/15">
              {/* Tool Protocol Info */}
              <div className="p-4 bg-cyber-blue/5 border border-cyber-blue/10 rounded-2xl flex flex-col gap-1 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyber-blue">
                  <Info className="w-3.5 h-3.5" /> Protocol Parameters
                </div>
                <p className="text-white/60 leading-relaxed font-medium mt-1">{usage}</p>
              </div>

              {/* Tool Interactive Workspace */}
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                {children}
              </div>

              {/* Close Button at bottom of expanded section */}
              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  onClick={onToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  Close Tool <ChevronUp className="w-3.5 h-3.5 text-cyber-blue" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-Tools ---

/**
 * Hash Lab - SHA-256 / SHA-512 Generator using Web Crypto API
 */
const HashLab = () => {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    const generateHash = async () => {
      if (!input) {
        setHash('');
        return;
      }
      const msgUint8 = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
    };
    generateHash();
  }, [input, algo]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center pl-1">
          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Input Text</label>
          {input && (
            <div className="flex items-center gap-1.5">
              {showConfirmClear ? (
                <div className="flex items-center gap-1.5 bg-black/40 border border-cyber-red/30 px-2 py-0.5 rounded-lg text-[9px] animate-fade-in">
                  <span className="text-cyber-red/80 font-bold">Clear?</span>
                  <button 
                    onClick={() => {
                      setInput('');
                      setShowConfirmClear(false);
                    }}
                    className="text-cyber-green hover:underline font-black uppercase cursor-pointer"
                  >
                    Yes
                  </button>
                  <span className="text-white/20">|</span>
                  <button 
                    onClick={() => setShowConfirmClear(false)}
                    className="text-white/40 hover:text-white hover:underline uppercase cursor-pointer"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirmClear(true)}
                  className="text-[9px] font-black uppercase tracking-wider text-cyber-red/60 hover:text-cyber-red flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (showConfirmClear) setShowConfirmClear(false);
          }}
          placeholder="Paste text to hash..."
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-cyber-blue/50 h-24 resize-none font-mono"
        />
      </div>
      
      <div className="flex gap-2">
        {(['SHA-256', 'SHA-512'] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAlgo(a)}
            className={cn(
              "flex-1 py-2 rounded-xl text-[10px] font-bold transition-all",
              algo === a 
                ? "bg-cyber-blue text-black" 
                : "bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Output Hash</label>
        <div className="group relative">
          <div className="w-full bg-black/50 border border-white/5 rounded-xl p-3 pr-10 font-mono text-[10px] break-all min-h-[40px] text-cyber-blue bg-gradient-to-br from-cyber-blue/5 to-transparent">
            {hash || 'Hash will appear here...'}
          </div>
          {hash && (
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-2 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Cyber Decoder - Base64, Hex, URL
 */
const CyberDecoder = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('decode');
  const [format, setFormat] = useState<'Base64' | 'Hex' | 'URL'>('Base64');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(false);
      return;
    }

    try {
      setError(false);
      if (mode === 'decode') {
        if (format === 'Base64') setOutput(atob(input));
        else if (format === 'URL') setOutput(decodeURIComponent(input));
        else if (format === 'Hex') {
          const hex = input.replace(/\s+/g, '');
          const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
          setOutput(new TextDecoder().decode(bytes));
        }
      } else {
        if (format === 'Base64') setOutput(btoa(input));
        else if (format === 'URL') setOutput(encodeURIComponent(input));
        else if (format === 'Hex') {
          const bytes = new TextEncoder().encode(input);
          setOutput(Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
        }
      }
    } catch (e) {
      setError(true);
      setOutput('Invalid input for selected format/mode');
    }
  }, [input, mode, format]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('decode')}
          className={cn(
            "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
            mode === 'decode' ? "bg-white/10 text-cyber-green" : "text-white/20 hover:text-white/40"
          )}
        >
          Decode
        </button>
        <button
          onClick={() => setMode('encode')}
          className={cn(
            "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
            mode === 'encode' ? "bg-white/10 text-cyber-blue" : "text-white/20 hover:text-white/40"
          )}
        >
          Encode
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['Base64', 'Hex', 'URL'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={cn(
              "py-2 rounded-xl text-[10px] font-bold transition-all border",
              format === f ? "bg-white/5 border-white/20 text-white" : "bg-transparent border-transparent text-white/40 hover:bg-white/5"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center pl-1">
            <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Input</label>
            {input && (
              <div className="flex items-center gap-1.5">
                {showConfirmClear ? (
                  <div className="flex items-center gap-1.5 bg-black/40 border border-cyber-red/30 px-2 py-0.5 rounded-lg text-[9px] animate-fade-in">
                    <span className="text-cyber-red/80 font-bold">Clear?</span>
                    <button 
                      onClick={() => {
                        setInput('');
                        setShowConfirmClear(false);
                      }}
                      className="text-cyber-green hover:underline font-black uppercase cursor-pointer"
                    >
                      Yes
                    </button>
                    <span className="text-white/20">|</span>
                    <button 
                      onClick={() => setShowConfirmClear(false)}
                      className="text-white/40 hover:text-white hover:underline uppercase cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowConfirmClear(true)}
                    className="text-[9px] font-black uppercase tracking-wider text-cyber-red/60 hover:text-cyber-red flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (showConfirmClear) setShowConfirmClear(false);
            }}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono h-24 resize-none"
            placeholder="Input data..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Result</label>
          <div className={cn(
            "w-full bg-black/50 border rounded-xl px-4 py-3 text-xs font-mono h-24 overflow-y-auto break-all",
            error ? "border-cyber-red/30 text-cyber-red/70" : "border-white/5 text-cyber-green"
          )}>
            {output || 'Result will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Port Reference - Interactive Port Lookup
 */
const PortExplorer = () => {
  const [search, setSearch] = useState('');
  
  const PORTS = [
    { port: 20, service: 'FTP-DATA', risk: 'Low', desc: 'File Transfer Protocol (Data)' },
    { port: 21, service: 'FTP', risk: 'Medium', desc: 'Control connection for FTP. Vulnerable to sniffing.' },
    { port: 22, service: 'SSH', risk: 'Low/Med', desc: 'Secure Shell. Vulnerable to Brute Force if not hardened.' },
    { port: 23, service: 'TELNET', risk: 'High', desc: 'Unencrypted remote access. DO NOT USE IN PRODUCTION.' },
    { port: 25, service: 'SMTP', risk: 'Low', desc: 'Simple Mail Transfer Protocol. Vulnerable to spoofing.' },
    { port: 53, service: 'DNS', risk: 'Medium', desc: 'Domain Name System. DNS amplification/poisoning risks.' },
    { port: 80, service: 'HTTP', risk: 'High', desc: 'Insecure web traffic. Susceptible to MITM attacks.' },
    { port: 110, service: 'POP3', risk: 'Medium', desc: 'Post Office Protocol. Often unencrypted.' },
    { port: 443, service: 'HTTPS', risk: 'Low', desc: 'Secure web traffic using SSL/TLS.' },
    { port: 445, service: 'SMB', risk: 'High', desc: 'Microsoft-DS. WannaCry and eternalblue target this.' },
    { port: 3306, service: 'MYSQL', risk: 'Medium', desc: 'Database access. Vulnerable to remote SQL injection.' },
    { port: 3389, service: 'RDP', risk: 'High', desc: 'Remote Desktop. Massive target for ransomware.' }
  ];

  const filtered = PORTS.filter(p => 
    p.port.toString().includes(search) || 
    p.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Search by port or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-cyber-blue/50"
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filtered.map(p => (
          <div key={p.port} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center font-mono text-xs text-cyber-blue border border-cyber-blue/20">
                {p.port}
              </div>
              <div>
                <p className="text-xs font-bold text-white/80">{p.service}</p>
                <p className="text-[10px] text-white/40 truncate max-w-[150px] md:max-w-[250px]">{p.desc}</p>
              </div>
            </div>
            <div className={cn(
              "text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
              p.risk === 'High' ? "bg-cyber-red/10 text-cyber-red" :
              p.risk === 'Medium' ? "bg-cyber-yellow/10 text-cyber-yellow" :
              "bg-cyber-green/10 text-cyber-green"
            )}>
              {p.risk}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 opacity-20 italic text-xs">No records found.</div>
        )}
      </div>
    </div>
  );
};

/**
 * Regex Pattern Tester
 */
const RegexTester = () => {
  const [pattern, setPattern] = useState('^[a-zA-Z0-9]+$');
  const [testString, setTestString] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!testString || !pattern) {
      setIsValid(null);
      return;
    }
    try {
      const regex = new RegExp(pattern);
      setIsValid(regex.test(testString));
    } catch {
      setIsValid(null);
    }
  }, [pattern, testString]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Regex Pattern</label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-cyber-blue/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Test String</label>
        <input
          type="text"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyber-blue/50"
        />
      </div>
      {isValid !== null && (
        <div className={cn(
          "p-3 rounded-xl border flex items-center gap-3 text-xs font-bold",
          isValid ? "bg-cyber-green/10 border-cyber-green/20 text-cyber-green" : "bg-cyber-red/10 border-cyber-red/20 text-cyber-red"
        )}>
          {isValid ? <Check className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
          {isValid ? 'Pattern Matched' : 'Pattern Mismatch'}
        </div>
      )}
    </div>
  );
};

/**
 * Data Privacy Calculator
 */
const DataPrivacyCalculator = () => {
  const [dataPoints, setDataPoints] = useState(0);
  const riskScore = Math.min(100, dataPoints * 12);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Data Types Exposed (e.g. Email, Name, DOB)</label>
        <input
          type="range"
          min="0"
          max="10"
          value={dataPoints}
          onChange={(e) => setDataPoints(parseInt(e.target.value))}
          className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyber-purple"
        />
        <div className="text-right text-xs font-mono text-white/60">{dataPoints} types</div>
      </div>
      <div className={cn("p-4 rounded-xl border", riskScore > 60 ? "bg-cyber-red/10 border-cyber-red/20" : "bg-cyber-blue/10 border-cyber-blue/20")}>
        <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Privacy Risk Score</p>
        <div className={cn("text-3xl font-black", riskScore > 60 ? "text-cyber-red" : "text-cyber-blue")}>
          {riskScore}/100
        </div>
      </div>
    </div>
  );
};

/**
 * Network Traffic Anomaly Detector
 */
const TrafficDetector = () => {
  const [packets, setPackets] = useState(0);
  const [isAnomalous, setIsAnomalous] = useState(false);

  const simulateTraffic = () => {
    const val = Math.floor(Math.random() * 100);
    setPackets(val);
    setIsAnomalous(val > 80);
  };

  return (
    <div className="space-y-4 text-center">
      <div className="text-4xl font-mono font-bold text-white/80">{packets} <span className="text-sm text-white/20">pps</span></div>
      <button 
        onClick={simulateTraffic}
        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
      >
        Simulate Network Scan
      </button>
      {isAnomalous && (
        <div className="p-3 bg-cyber-yellow/10 border border-cyber-yellow/20 text-cyber-yellow text-[10px] font-bold rounded-xl animate-pulse">
          ⚠️ TRAFFIC ANOMALY DETECTED
        </div>
      )}
    </div>
  );
};

/**
 * JWT Decoder - Static inspector
 */
const JWTExplorer = () => {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{ header: any; payload: any } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setDecoded(null);
      setError(false);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT');
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      setDecoded({ header, payload });
      setError(false);
    } catch {
      setError(true);
      setDecoded(null);
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT here (header.payload.signature)..."
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-24 resize-none break-all"
        />
      </div>

      <AnimatePresence>
        {decoded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase text-white/30 ml-1">Header</p>
              <pre className="bg-cyber-red/5 border border-cyber-red/20 p-3 rounded-xl text-[9px] font-mono text-cyber-red overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase text-white/30 ml-1">Payload</p>
              <pre className="bg-cyber-purple/5 border border-cyber-purple/20 p-3 rounded-xl text-[9px] font-mono text-cyber-purple overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
        {error && token && (
          <div className="text-[10px] text-cyber-red bg-cyber-red/10 p-3 rounded-xl border border-cyber-red/20">
            Malformed JWT structure. Ensure it has 3 parts separated by dots.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Security Header Scorer
 */
const HeaderScorer = () => {
  const [headers, setHeaders] = useState('Strict-Transport-Security: max-age=31536000\nX-Frame-Options: SAMEORIGIN');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const criticalHeaders = ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options'];
    let count = 0;
    criticalHeaders.forEach(h => {
      if (headers.includes(h)) count += 25;
    });
    setScore(count);
  }, [headers]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Response Headers</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-24 resize-none"
        />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[10px] text-white/40 uppercase font-bold">Security Score</span>
        <span className={cn("text-xl font-black", score > 75 ? "text-cyber-green" : score > 50 ? "text-cyber-yellow" : "text-cyber-red")}>
          {score}/100
        </span>
      </div>
    </div>
  );
};

// No extra imports here.

import { BrowserFingerprint } from './tools/BrowserFingerprint';
import { FileIntegrityVerifier } from './tools/FileIntegrityVerifier';
import { HomographDetector } from './tools/HomographDetector';
import { EmailHeaderAnalyzer } from './tools/EmailHeaderAnalyzer';
import { AESPlayground, SocialEngineeringAnalyzer, VulnerableCodeScanner, TOTPSimulator, SteganographyTool, PasswordPatternVisualizer } from './tools/AdvancedTools';
import { PasswordAnalyzer } from './tools/PasswordAnalyzer';
import { PhishingDetector } from './tools/PhishingDetector';
import { ExifAnalyzer } from './ExifAnalyzer';

// ... HashLab, CyberDecoder, etc are still defined in this file (lines 79 onwards) ...

const MASTER_TOOLS = [
  { id: 'password', name: 'Password Analyzer', desc: 'Evaluates password entropy.', usage: 'Enter password to analyze strength, estimated crack time, and suggestions.', icon: Lock, color: 'text-cyber-blue', component: <PasswordAnalyzer /> },
  { id: 'phishing', name: 'Phishing Detector', desc: 'Identifies suspicious URLs.', usage: 'Paste links or email body text to scan for phishing triggers.', icon: AlertOctagon, color: 'text-cyber-yellow', component: <PhishingDetector /> },
  { id: 'exif', name: 'Metadata Analyzer', desc: 'Extracts EXIF forensic data.', usage: 'Upload image files to view hidden metadata and GPS coordinates.', icon: ApertureIcon, color: 'text-cyber-green', component: <ExifAnalyzer /> },
  { id: 'fingerprint', name: 'Browser Fingerprint', desc: 'Analyzes browser signals.', usage: 'Generates a canvas-based fingerprint ID for privacy risk assessment.', icon: Shield, color: 'text-cyber-purple', component: <BrowserFingerprint /> },
  { id: 'emailheader', name: 'Email Header Analyzer', desc: 'Parses email routing data.', usage: 'Checks SPF, DKIM, DMARC for authenticity.', icon: Server, color: 'text-cyber-yellow', component: <EmailHeaderAnalyzer /> },
  { id: 'aes', name: 'AES Playground', desc: 'AES-256-GCM encryption.', usage: 'Provides local data encryption with PBKDF2 key derivation.', icon: Lock, color: 'text-cyber-blue', component: <AESPlayground /> },
  { id: 'codescan', name: 'Vulnerable Code Scan', desc: 'Identifies common security flaws.', usage: 'Detects dangerous functions (eval, innerHTML) in source code.', icon: Code, color: 'text-cyber-purple', component: <VulnerableCodeScanner /> },
  { id: 'totp', name: 'TOTP 2FA Sim', desc: 'Shows time-based 2FA tokens.', usage: 'Generates live tokens to illustrate 2FA mechanisms.', icon: Shield, color: 'text-cyber-green', component: <TOTPSimulator /> },
  { id: 'stego', name: 'Steganography Tool', desc: 'Hides secrets in images.', usage: 'Embeds data into pixels for covert storage.', icon: Zap, color: 'text-cyber-yellow', component: <SteganographyTool /> },
  { id: 'passpattern', name: 'Pattern Visualizer', desc: 'Maps typing paths.', usage: 'Visualizes keyboard-walk patterns for password security.', icon: Lock, color: 'text-cyber-blue', component: <PasswordPatternVisualizer /> },
  // Adding the existing ones too to keep them
  { id: 'hashlab', name: 'Hash Lab', desc: 'Secure hash generation.', usage: 'Creates SHA-256/512 hashes.', icon: Cpu, color: 'text-cyber-blue', component: <HashLab /> },
  { id: 'decoder', name: 'Cyber Decoder', desc: 'Encoding/decoding utility', usage: 'Translates Base64, Hex, and URL formats.', icon: FileCode, color: 'text-cyber-green', component: <CyberDecoder /> },
  { id: 'port', name: 'Port Explorer', desc: 'Common port risks.', usage: 'Search and inspect network port vulnerabilities.', icon: PlugZap, color: 'text-cyber-yellow', component: <PortExplorer /> },
  { id: 'jwt', name: 'JWT Inspector', desc: 'JWT structure decoder.', usage: 'Inspect header and payload of a JSON Web Token.', icon: Tickets, color: 'text-cyber-red', component: <JWTExplorer /> },
  { id: 'regex', name: 'Regex Tester', desc: 'Regex pattern validator.', usage: 'Tests strings against regular expression patterns.', icon: Terminal, color: 'text-cyber-green', component: <RegexTester /> },
  { id: 'header', name: 'Header Scorer', desc: 'Security header audit.', usage: 'Analyzes HTTP security headers.', icon: Server, color: 'text-cyber-yellow', component: <HeaderScorer /> },
  { id: 'traffic', name: 'Traffic Anomaly', desc: 'Detects traffic spikes.', usage: 'Simulates network flow monitoring.', icon: Radar, color: 'text-cyber-red', component: <TrafficDetector /> },
];

export const SecuritySuite: React.FC = () => {
    const [search, setSearch] = useState('');
    const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

    const filtered = MASTER_TOOLS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    const handleToggle = (id: string) => {
        setExpandedToolId(prev => prev === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <input 
                    value={search} 
                    onChange={e => {
                        setSearch(e.target.value);
                        setExpandedToolId(null);
                    }}
                    placeholder="Search security protocols & tools..."
                    className="w-full bg-cyber-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-cyber-blue/40"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
            
            <div className="flex flex-col gap-4">
               {filtered.length > 0 ? (
                 filtered.map(tool => (
                   <CollapsibleToolCard 
                     key={tool.id} 
                     title={tool.name} 
                     description={tool.desc} 
                     usage={tool.usage} 
                     icon={tool.icon} 
                     colorClass={tool.color}
                     isExpanded={expandedToolId === tool.id}
                     onToggle={() => handleToggle(tool.id)}
                   >
                     {tool.component}
                   </CollapsibleToolCard>
                 ))
               ) : (
                 <div className="text-center text-white/40 italic py-10 bg-cyber-card/25 rounded-3xl border border-white/5">
                   No tools found matching "{search}"
                 </div>
               )}
            </div>
        </div>
    );
};
