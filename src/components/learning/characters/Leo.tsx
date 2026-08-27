import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

interface CharacterProps {
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
}

export const Leo: React.FC<CharacterProps> = ({ size = 'md', isSpeaking = false }) => {
  const sizeMap = { sm: 48, md: 72, lg: 96 };
  const px = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center relative">
      <motion.div
        animate={{
          y: [0, -4, 0],
          boxShadow: isSpeaking 
            ? ['0 0 0px #a855f7', '0 0 15px #a855f7', '0 0 0px #a855f7'] 
            : '0 0 0px #a855f7'
        }}
        transition={{
          y: { repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.5 },
          boxShadow: { repeat: Infinity, duration: 1, ease: 'easeInOut' }
        }}
        style={{ width: px, height: px }}
        className="rounded-full border-[3px] border-[#a855f7] relative overflow-hidden bg-gradient-to-b from-[#1a0033] to-[#2d0055] shrink-0"
      >
        <img 
          src="https://ibb.co/BHj9Z714" 
          alt="Leo"
          width={px}
          height={px}
          style={{ 
            filter: isSpeaking 
              ? 'drop-shadow(0 0 12px #a855f7)' 
              : 'none',
            transition: 'filter 0.3s ease',
            objectFit: 'cover'
          }}
          className="absolute inset-0 w-full h-full rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://i.ibb.co/BHj9Z714/image.png';
          }}
        />
      </motion.div>
      <div className="absolute bottom-4 right-0 bg-[#2d0055] border border-[#a855f7] rounded-full p-0.5">
        <Shield className="w-3 h-3 text-[#a855f7]" />
      </div>
      <span className="text-[#a855f7] text-[10px] uppercase tracking-widest mt-1 font-bold">Leo</span>
    </div>
  );
}
