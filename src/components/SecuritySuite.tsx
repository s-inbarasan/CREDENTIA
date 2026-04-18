import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  FileCode, 
  Search, 
  Code, 
  Shield, 
  Zap, 
  Copy, 
  Check, 
  Terminal,
  Activity,
  Tickets,
  Info,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

// --- Utility Components ---

const ToolCard: React.FC<{ 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  colorClass: string; 
  children: React.ReactNode;
  points?: string;
}> = ({ title, icon: Icon, colorClass, children, points }) => {
  const bgClass = colorClass.replace('text-', 'bg-').concat('/10');
  
  return (
    <div className="bg-cyber-card p-5 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col h-full">
      {points && (
        <div className={cn("absolute top-4 right-4 text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-full", bgClass, colorClass)}>
          <Zap className="w-3 h-3" /> {points}
        </div>
      )}
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <Icon className={cn("w-4 h-4", colorClass)} />
        {title}
      </h3>
      <div className="flex-1">
        {children}
      </div>
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
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
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

// --- Main Security Suite Integration ---

export const SecuritySuite: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ToolCard title="Hash Lab" icon={Cpu} colorClass="text-cyber-blue" points="+20 XP">
        <HashLab />
      </ToolCard>
      
      <ToolCard title="Cyber Decoder" icon={FileCode} colorClass="text-cyber-green" points="+15 XP">
        <CyberDecoder />
      </ToolCard>

      <div className="md:col-span-2">
        <ToolCard title="Port & Protocol Explorer" icon={Activity} colorClass="text-cyber-yellow" points="+10 XP">
          <PortExplorer />
        </ToolCard>
      </div>

      <div className="md:col-span-2">
        <ToolCard title="JWT Payload Inspector" icon={Tickets} colorClass="text-cyber-red" points="+25 XP">
          <JWTExplorer />
        </ToolCard>
      </div>

      {/* Decorative Cyber Feed / Status */}
      <div className="md:col-span-2 bg-black/40 rounded-3xl border border-white/5 p-6 border-dashed opacity-60">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Active Platform Sentinel
          </h4>
          <span className="flex items-center gap-2 text-[10px] text-cyber-green font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            STANDALONE_MODE_ACTIVE
          </span>
        </div>
        <p className="text-[10px] text-white/40 leading-relaxed italic">
          These tools operate locally within your browser context. No data leaves your machine during analysis or calculation. Encryption and validation are performed using native browser-side crypto sub-systems.
        </p>
      </div>
    </div>
  );
};
