import React from 'react';
import { motion } from 'motion/react';

interface CharacterProps {
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
}

export const Sarah: React.FC<CharacterProps> = ({ size = 'md', isSpeaking = false }) => {
  const sizeMap = { sm: 48, md: 72, lg: 96 };
  const px = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{
          y: [0, -4, 0],
          boxShadow: isSpeaking 
            ? ['0 0 0px #00f2ff', '0 0 15px #00f2ff', '0 0 0px #00f2ff'] 
            : '0 0 0px #00f2ff'
        }}
        transition={{
          y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
          boxShadow: { repeat: Infinity, duration: 1, ease: 'easeInOut' }
        }}
        style={{ width: px, height: px }}
        className="rounded-full border-[3px] border-[#00f2ff] relative overflow-hidden bg-gradient-to-b from-[#001a2e] to-[#002a4a] shrink-0"
      >
        <img 
          src="https://ibb.co/0j382kvj" 
          alt="Sarah"
          width={px}
          height={px}
          style={{ 
            filter: isSpeaking 
              ? 'drop-shadow(0 0 12px #00f2ff)' 
              : 'none',
            transition: 'filter 0.3s ease',
            objectFit: 'cover'
          }}
          className="absolute inset-0 w-full h-full rounded-full"
          onError={(e) => {
            // Fallback to the ID based i.ibb.co link if the direct one fails
            (e.target as HTMLImageElement).src = 'https://i.ibb.co/0j382kvj/image.png';
          }}
        />
      </motion.div>
      <span className="text-[#00f2ff] text-[10px] uppercase tracking-widest mt-1 font-bold">Sarah</span>
    </div>
  );
}
