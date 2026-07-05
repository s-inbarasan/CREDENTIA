import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface SpeechBubbleProps {
  text: string;
  speaker: 'sarah' | 'leo' | 'alex';
  position: 'left' | 'right' | 'center';
  isActive: boolean;
}

const speakerThemes = {
  sarah: { text: 'text-[#00f2ff]', border: 'border-[#00f2ff]', bg: 'bg-[#00f2ff]/10', hex: '#00f2ff' },
  leo: { text: 'text-[#a855f7]', border: 'border-[#a855f7]', bg: 'bg-[#a855f7]/10', hex: '#a855f7' },
  alex: { text: 'text-[#4ade80]', border: 'border-[#4ade80]', bg: 'bg-[#4ade80]/10', hex: '#4ade80' }
};

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, speaker, position, isActive }) => {
  const [displayedText, setDisplayedText] = useState('');
  const theme = speakerThemes[speaker];

  useEffect(() => {
    if (!isActive) {
      setDisplayedText(text);
      return;
    }
    
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
    
    return () => clearInterval(interval);
  }, [text, isActive]);

  const pointerStyle = position === 'left' 
    ? { left: '-8px', borderRight: `8px solid ${theme.hex}4D`, borderTop: '8px solid transparent', borderBottom: '8px solid transparent' } 
    : { right: '-8px', borderLeft: `8px solid ${theme.hex}4D`, borderTop: '8px solid transparent', borderBottom: '8px solid transparent' };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        "relative rounded-2xl p-4 min-w-[200px] max-w-sm backdrop-blur-md border border-opacity-30",
        theme.bg,
        theme.border.replace('border-', 'border-').concat('/30')
      )}
      style={{ borderColor: `${theme.hex}4D` }}
    >
      <div className={cn("text-[10px] uppercase font-bold mb-1 tracking-widest", theme.text)}>
        {speaker}
      </div>
      <div className="text-sm leading-relaxed text-white min-h-[20px]">
        {displayedText}
        {isActive && displayedText.length < text.length && <motion.span animate={{opacity: [1,0]}} transition={{repeat: Infinity, duration: 0.5}} className="inline-block w-1 h-3 bg-white ml-1" />}
      </div>
      
      <div 
        className="absolute top-6 w-0 h-0"
        style={pointerStyle}
      />
    </motion.div>
  );
}
