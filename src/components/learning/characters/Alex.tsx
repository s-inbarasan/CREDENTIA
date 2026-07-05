import React from 'react';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';

interface CharacterProps {
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
}

export const Alex: React.FC<CharacterProps> = ({ size = 'md', isSpeaking = false }) => {
  const sizeMap = { sm: 48, md: 72, lg: 96 };
  const px = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center relative">
      <motion.div
        animate={{
          y: [0, -4, 0],
          boxShadow: isSpeaking 
            ? ['0 0 0px #4ade80', '0 0 15px #4ade80', '0 0 0px #4ade80'] 
            : '0 0 0px #4ade80'
        }}
        transition={{
          y: { repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 },
          boxShadow: { repeat: Infinity, duration: 1, ease: 'easeInOut' }
        }}
        style={{ width: px, height: px }}
        className="rounded-full border-[3px] border-[#4ade80] relative overflow-hidden bg-gradient-to-b from-[#001a00] to-[#002800] shrink-0"
      >
        <img 
          src="https://ibb.co/R4gjDN7T" 
          alt="Alex"
          width={px}
          height={px}
          style={{ 
            filter: isSpeaking 
              ? 'drop-shadow(0 0 12px #4ade80)' 
              : 'none',
            transition: 'filter 0.3s ease',
            objectFit: 'cover'
          }}
          className="absolute inset-0 w-full h-full rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://i.ibb.co/R4gjDN7T/image.png';
          }}
        />
      </motion.div>
      <div className="absolute bottom-4 right-0 bg-[#002800] border border-[#4ade80] rounded-full p-0.5">
        <Terminal className="w-3 h-3 text-[#4ade80]" />
      </div>
      <span className="text-[#4ade80] text-[10px] uppercase tracking-widest mt-1 font-bold">Alex</span>
    </div>
  );
}
