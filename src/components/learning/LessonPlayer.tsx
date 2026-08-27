import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX, CheckCircle, Award, Sparkles, MessageSquare, Info } from 'lucide-react';
import { ModuleDialogue, DialogueLine } from '../../data/moduleDialogues';
import { Topic } from '../../types';
import { cn } from '../../utils/cn';
import { ComicPanel } from './ComicPanel';
import { useNarrator } from './useNarrator';

interface LessonPlayerProps {
  topic: Topic;
  dialogue: ModuleDialogue;
  onComplete: (xpEarned: number) => void;
  onClose: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ topic, dialogue, onComplete, onClose }) => {
  const flattenedLines: { sceneIdx: number; lineIdx: number; line: DialogueLine; panelId: string }[] = [];
  dialogue.scenes.forEach((scene, sceneIdx) => {
    scene.lines.forEach((line, lineIdx) => {
      flattenedLines.push({ sceneIdx, lineIdx, line, panelId: scene.panelId });
    });
  });

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [muted, setMuted] = useState(false);
  
  const { speak, stop, setMuted: setTTSMuted } = useNarrator();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTTSMuted(muted);
  }, [muted, setTTSMuted]);

  useEffect(() => {
    // Scroll to latest panel
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentLineIndex]);

  useEffect(() => {
    if (isFinished) {
      stop();
      return;
    }

    if (isPlaying) {
      const current = flattenedLines[currentLineIndex];
      if (!current) {
        setIsPlaying(false);
        setIsFinished(true);
        return;
      }

      speak(current.line.text, current.line.character, () => {
        // Wait 800ms then advance
        setTimeout(() => {
          if (isPlaying && !isFinished) {
            if (currentLineIndex + 1 < flattenedLines.length) {
              setCurrentLineIndex(prev => prev + 1);
            } else {
              setIsPlaying(false);
              setIsFinished(true);
            }
          }
        }, 800);
      });
    } else {
      stop();
    }

    return () => { stop(); };
  }, [isPlaying, currentLineIndex, isFinished]); 

  const handleNext = () => {
    if (isPlaying) setIsPlaying(false);
    stop();
    if (currentLineIndex + 1 < flattenedLines.length) {
      setCurrentLineIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (isPlaying) setIsPlaying(false);
    stop();
    if (currentLineIndex > 0) {
      setCurrentLineIndex(prev => prev - 1);
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const progressPct = ((currentLineIndex + 1) / flattenedLines.length) * 100;

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-cyber-card border border-cyber-blue/30 rounded-[2rem] p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green" />
          
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-cyber-blue/20 border-2 border-cyber-blue flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-cyber-blue" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Module Completed!</h2>
          <p className="text-white/60 mb-8">You've successfully finished {topic.title}.</p>
          
          <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
            <div className="uppercase text-[10px] tracking-widest text-white/40 font-bold mb-2">XP EARNED</div>
            <div className="flex items-center justify-center gap-2 text-4xl font-bold text-cyber-yellow">
              <Award className="w-8 h-8 fill-cyber-yellow/20" /> +500
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => onComplete(500)} // Triggers closing and quiz
              className="w-full bg-cyber-blue text-black font-bold py-4 rounded-xl hover:bg-cyber-blue/90 transition-colors uppercase tracking-widest"
            >
              Proceed to Quiz
            </button>
            <button 
              onClick={() => {
                setIsFinished(false);
                setCurrentLineIndex(0);
                setIsPlaying(true);
              }}
              className="w-full bg-transparent border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-colors tracking-widest uppercase text-sm"
            >
              Replay Module
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Determine current scene up to currentLineIndex
  const activeLine = flattenedLines[currentLineIndex];
  
  if (!activeLine) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#050810] flex items-center justify-center p-6 text-white font-mono text-center">
        <p className="max-w-md">No dialogue content available for this module yet.<br/><br/><button className="text-cyber-blue underline mt-4" onClick={onClose}>Return to Hub</button></p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#050810] flex flex-col font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md relative z-20">
        <div className="flex-1">
          <div className="text-[10px] uppercase font-bold text-cyber-blue tracking-widest mb-1">STORY MODE</div>
          <div className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">{topic.title}</div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => { stop(); setCurrentLineIndex(0); setIsPlaying(false); setIsFinished(false); }} 
            className="p-2 text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold"
            title="Restart"
          >
            <SkipBack className="w-4 h-4" /> RESTART
          </button>
          <button onClick={() => { stop(); onClose(); }} className="p-2 text-white/50 hover:text-white transition-colors" title="Close">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Progress Line */}
      <div className="h-1 w-full bg-white/10 relative z-20">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyber-blue to-cyber-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Comic Display Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth" ref={scrollRef}>
        <div className="max-w-4xl mx-auto pb-32">
          {dialogue.scenes.filter((s, i) => i <= activeLine.sceneIdx).map((scene, idx) => (
            <ComicPanel 
              key={scene.panelId}
              scene={scene}
              panelIndex={idx}
              isActive={idx === activeLine.sceneIdx}
              activeLineId={activeLine.line.lineId}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-black/90 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev}
              disabled={currentLineIndex === 0}
              className="p-3 bg-white/5 disabled:opacity-20 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              title="Previous"
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>
            
            <button 
              onClick={handlePlayPause} 
              className="px-6 py-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 rounded-xl text-cyber-blue transition-colors border border-cyber-blue/30 flex items-center gap-2 font-bold min-w-[120px] justify-center"
            >
              {isPlaying ? (
                <><Pause className="w-5 h-5 fill-current" /> PAUSE</>
              ) : (
                <><Play className="w-5 h-5 fill-current ml-0.5" /> AUTO-PLAY</>
              )}
            </button>
          </div>
          
          <div className="hidden sm:flex flex-col items-center gap-1">
            <div className="text-white font-mono text-sm tracking-widest font-bold">
              {currentLineIndex + 1} / {flattenedLines.length}
            </div>
            <div className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Dialogue Progress</div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMuted(!muted)} 
              className={cn(
                "p-3 rounded-xl transition-all border",
                muted 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              )}
              title={muted ? "Unmute Narration" : "Mute Narration"}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={handleNext}
              className={cn(
                "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 uppercase tracking-widest",
                currentLineIndex === flattenedLines.length - 1
                  ? "bg-cyber-green text-black hover:bg-cyber-green/90"
                  : "bg-white text-black hover:bg-white/90"
              )}
            >
              {currentLineIndex === flattenedLines.length - 1 ? (
                <>FINISH <CheckCircle className="w-5 h-5" /></>
              ) : (
                <>NEXT <SkipForward className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
