import React from 'react';
import { motion } from 'motion/react';
import { Sarah } from './characters/Sarah';
import { Leo } from './characters/Leo';
import { Alex } from './characters/Alex';
import { SpeechBubble } from './SpeechBubble';
import { cn } from '../../utils/cn';

interface ComicPanelProps {
  scene: any;
  panelIndex: number;
  isActive: boolean;
  activeLineId: string | null;
}

const bgMap: Record<string, string> = {
  'dark-blue': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#001a2e]/30 to-transparent',
  'dark-purple': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2d0055]/30 to-transparent',
  'dark-green': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#002800]/30 to-transparent',
};

export const ComicPanel: React.FC<ComicPanelProps> = ({ scene, panelIndex, isActive, activeLineId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: isActive ? 1 : 0.4, x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative w-full rounded-3xl border border-white/10 p-4 sm:p-6 min-h-[300px] flex flex-col justify-end overflow-hidden mb-6",
        isActive ? "" : "scale-[0.98]",
        "bg-[#0A0D14]"
      )}
    >
      <div className={cn("absolute inset-0 pointer-events-none", bgMap[scene.background])} />
      
      <div className="absolute top-4 left-4 bg-white/10 text-white/40 text-[10px] font-bold px-2 py-1 rounded-full z-10">
        PANEL {panelIndex + 1}
      </div>

      <div className="relative z-10 flex flex-col gap-8 pt-8">
        {scene.lines.map((line: any, idx: number) => {
          const posIndex = scene.lines.findIndex((l: any) => l.lineId === line.lineId);
          const currActiveIdx = scene.lines.findIndex((l: any) => l.lineId === activeLineId);
          
          if (isActive && posIndex > currActiveIdx && currActiveIdx !== -1) return null;
          
          const lineIsActive = isActive && activeLineId === line.lineId;
          const position = line.character === 'sarah' ? 'left' : 'right';

          return (
            <div key={line.lineId} className={cn("flex w-full items-end gap-3 sm:gap-4", position === 'right' ? 'flex-row-reverse' : 'flex-row')}>
              <div className={cn("shrink-0 transition-transform duration-300", lineIsActive ? 'scale-110' : 'scale-90 opacity-60')}>
                {line.character === 'sarah' && <Sarah size="sm" isSpeaking={lineIsActive} />}
                {line.character === 'leo' && <Leo size="sm" isSpeaking={lineIsActive} />}
                {line.character === 'alex' && <Alex size="sm" isSpeaking={lineIsActive} />}
              </div>
              <div className="flex-grow flex" style={{ justifyContent: position === 'right' ? 'flex-end' : 'flex-start' }}>
                 <SpeechBubble 
                   text={line.text}
                   speaker={line.character}
                   position={position}
                   isActive={lineIsActive}
                 />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
