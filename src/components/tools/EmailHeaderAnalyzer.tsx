import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export const EmailHeaderAnalyzer = () => {
  const [input, setInput] = useState('');
  return (
    <div className="space-y-4">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-black/30 p-4 rounded-xl border border-white/10" placeholder="Paste headers..." />
    </div>
  );
};
