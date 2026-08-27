import React, { useState } from 'react';
import { analyzePassword } from '../../utils/analyzer';
import { Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PasswordAnalyzer = () => {
    const [pass, setPass] = useState('');
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const analysis = analyzePassword(pass);

    return (
        <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between items-center pl-1">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Password Input</label>
                {pass && (
                    <div className="flex items-center gap-1.5">
                        {showConfirmClear ? (
                            <div className="flex items-center gap-1.5 bg-black/40 border border-cyber-red/30 px-2 py-0.5 rounded-lg text-[9px] animate-fade-in">
                                <span className="text-cyber-red/80 font-bold">Clear?</span>
                                <button 
                                    onClick={() => {
                                        setPass('');
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
            <input 
                type="text" 
                value={pass} 
                onChange={(e) => {
                    setPass(e.target.value);
                    if (showConfirmClear) setShowConfirmClear(false);
                }} 
                placeholder="Type password..." 
                className="w-full bg-black/30 p-2 rounded border border-white/10 focus:outline-none focus:border-cyber-blue/40" 
            />
            <div className="font-bold">Strength: {analysis.strength} (Score: {analysis.score}/100)</div>
            <div className="text-[10px] text-white/60">Estimated Crack Time: {analysis.crackTime}</div>
            {analysis.suggestions.length > 0 && (
                <ul className="list-disc pl-4 text-cyber-yellow text-[10px] space-y-0.5">
                    {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            )}
        </div>
    );
};

