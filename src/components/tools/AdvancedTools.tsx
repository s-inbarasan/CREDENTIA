import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

// Helper for AES (Web Crypto API)
const deriveKey = async (passphrase: string, salt: Uint8Array) => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
};

export const AESPlayground = () => {
    const [text, setText] = useState('');
    const [pass, setPass] = useState('');
    const [result, setResult] = useState('');

    const encrypt = async () => {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(pass, salt);
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
        setResult(btoa(String.fromCharCode(...new Uint8Array(encrypted))));
    };

    return (
        <div className="space-y-2 text-xs font-mono">
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to encrypt..." className="w-full bg-black/30 p-2 rounded" />
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Passphrase..." className="w-full bg-black/30 p-2 rounded" />
            <button onClick={encrypt} className="w-full bg-cyber-blue text-black p-2 rounded font-bold">Encrypt (AES-GCM)</button>
            <div className="bg-black/50 p-2 rounded break-all">{result || 'Encrypted output...'}</div>
        </div>
    );
};

export const SocialEngineeringAnalyzer = () => {
    const [text, setText] = useState('');
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!text) return setScore(0);
        const triggers = ['act now', 'immediately', 'suspended', 'verify', 'password', 'urgent'];
        const found = triggers.filter(t => text.toLowerCase().includes(t));
        setScore(Math.min(100, found.length * 20));
    }, [text]);

    return (
        <div className="space-y-2 text-xs font-mono">
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste message..." className="w-full bg-black/30 p-2 rounded h-20" />
            <div className="font-bold text-cyber-red">Manipulation Score: {score}/100</div>
        </div>
    );
};

export const VulnerableCodeScanner = () => {
    const [code, setCode] = useState('');
    const [findings, setFindings] = useState<string[]>([]);

    const scan = () => {
        const vulnerabilities = [];
        if (code.includes('eval(')) vulnerabilities.push('Potential eval() usage!');
        if (code.includes('innerHTML')) vulnerabilities.push('Potential XSS via innerHTML!');
        setFindings(vulnerabilities);
    };

    return (
        <div className="space-y-2 text-xs font-mono">
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste code..." className="w-full bg-black/30 p-2 rounded h-20" />
            <button onClick={scan} className="w-full bg-cyber-purple text-white p-2 rounded font-bold">Scan Code</button>
            {findings.map((f, i) => <div key={i} className="text-cyber-red">{f}</div>)}
        </div>
    );
};

export const TOTPSimulator = () => {
    const [code, setCode] = useState('------');
    
    useEffect(() => {
        const gen = async () => {
            const timeStep = Math.floor(Date.now() / 30000);
            const enc = new TextEncoder();
            const key = await crypto.subtle.importKey("raw", enc.encode("SECRETKEY"), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
            const sig = await crypto.subtle.sign("HMAC", key, enc.encode(timeStep.toString()));
            const hash = new Uint8Array(sig);
            const offset = hash[hash.length - 1] & 0xf;
            const otp = ((hash[offset] & 0x7f) << 24 | (hash[offset + 1] & 0xff) << 16 | (hash[offset + 2] & 0xff) << 8 | (hash[offset + 3] & 0xff)) % 1000000;
            setCode(otp.toString().padStart(6, '0'));
        };
        gen();
        const interval = setInterval(gen, 1000);
        return () => clearInterval(interval);
    }, []);

    return <div className="text-4xl text-center font-mono font-bold text-cyber-green">{code}</div>;
};

export const SteganographyTool = () => {
    const [mode, setMode] = useState<'hide' | 'reveal'>('hide');
    const [text, setText] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(r => img.onload = r);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        
        if (mode === 'hide') {
            const data = new TextEncoder().encode(text);
            for (let i = 0; i < data.length; i++) {
                imageData.data[i * 4] = (imageData.data[i * 4] & 0xFE) | (data[i] & 0x01);
            }
            ctx.putImageData(imageData, 0, 0);
            setResult(canvas.toDataURL());
        } else {
            let decoded = "";
            for (let i = 0; i < 100; i++) { // Simple extraction for demo
                const charCode = imageData.data[i * 4] & 0x01;
                if (charCode === 0) break; 
                decoded += String.fromCharCode(charCode);
            }
            setResult(decoded);
        }
    };

    return (
        <div className="space-y-2 text-xs">
            <div className="flex gap-2">
                <button onClick={() => setMode('hide')} className={cn("flex-1 p-1", mode==='hide'?'bg-cyber-blue':'bg-white/10')}>Hide</button>
                <button onClick={() => setMode('reveal')} className={cn("flex-1 p-1", mode==='reveal'?'bg-cyber-blue':'bg-white/10')}>Reveal</button>
            </div>
            {mode === 'hide' && <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Secret message" className="w-full bg-black/30 p-2 rounded" />}
            <input type="file" onChange={handleFile} className="w-full" />
            {result && mode === 'reveal' && <div className="p-2 bg-black/50 rounded font-mono">{result}</div>}
            {result && mode === 'hide' && <a href={result} download="stego.png" className="text-cyber-green underline">Download Image</a>}
        </div>
    );
};

export const PasswordPatternVisualizer = () => {
    const [pass, setPass] = useState('');
    return (
        <div className="space-y-2">
            <input type="text" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Type password..." className="w-full bg-black/30 p-2 rounded" />
            <div className="grid grid-cols-10 gap-1 mt-2">
                {'qwertyuiopasdfghjklzxcvbnm'.split('').map(char => (
                    <div key={char} className={cn("p-2 rounded text-center text-xs", pass.includes(char) ? "bg-cyber-blue" : "bg-black/50")}>{char.toUpperCase()}</div>
                ))}
            </div>
        </div>
    );
};
