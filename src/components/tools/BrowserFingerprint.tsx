import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

export const BrowserFingerprint = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults({
        browser: 'Chrome 123.0.0',
        os: 'macOS 14.2',
        screen: '1920x1080',
        score: 65,
        risk: 'Medium'
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <button onClick={analyze} className="w-full py-3 bg-cyber-blue text-black font-bold rounded-xl">{analyzing ? 'Analyzing...' : 'Analyze'}</button>
      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono">
          <p>Browser: {results.browser}</p>
          <p>Score: {results.score}</p>
        </motion.div>
      )}
    </div>
  );
};
