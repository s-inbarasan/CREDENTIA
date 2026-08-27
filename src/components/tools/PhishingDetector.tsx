import React, { useState } from 'react';
import { analyzePhishing } from '../../utils/analyzer';
import { cn } from '../../utils/cn';
import { Trash2 } from 'lucide-react';

export const PhishingDetector = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    const analyze = () => {
        setResult(analyzePhishing(input));
    };

    return (
        <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between items-center pl-1">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Link or Email Content</label>
                {input && (
                    <div className="flex items-center gap-1.5">
                        {showConfirmClear ? (
                            <div className="flex items-center gap-1.5 bg-black/40 border border-cyber-red/30 px-2 py-0.5 rounded-lg text-[9px] animate-fade-in">
                                <span className="text-cyber-red/80 font-bold">Clear?</span>
                                <button 
                                    onClick={() => {
                                        setInput('');
                                        setResult(null);
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
                placeholder="Paste link or email content..." 
                className="w-full bg-black/30 p-2 rounded h-20 border border-white/10 focus:outline-none focus:border-cyber-yellow/40 focus:ring-0" 
            />
            <button onClick={analyze} className="w-full bg-cyber-yellow text-black p-2 rounded font-bold hover:bg-cyber-yellow/80 active:scale-95 transition-all">Scan Potential Phishing</button>
            {result && (
                <div className={cn("p-2 rounded mt-2 border", result.riskLevel === 'High' ? 'border-cyber-red/30' : result.riskLevel === 'Medium' ? 'border-cyber-yellow/30' : 'border-cyber-green/30')}>
                    <div className="font-bold">Risk: {result.riskLevel}</div>
                    <ul className="list-disc pl-4 mt-2">
                        {result.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

