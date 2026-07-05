import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  Library, ShieldCheck, Lock, UserSearch, Eye, AlertTriangle, HardDrive, Globe, 
  Database, Cpu, Wifi, CheckCircle, ArrowLeft, ChevronRight, 
  PlayCircle, Smartphone, Mail, EyeOff, UserCheck, Zap, Award, 
  Flame, Target, LayoutGrid, Layers, Network, Star, Trophy,
  LucideIcon, Brain, XCircle, Bot, Copy, Briefcase, Atom, Cloud, Box, Ghost, Binoculars, Scan, X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../utils/cn';
import { LEARNING_TOPICS } from '../data/learningTopics';
import { Topic, UserDocument, QuizQuestion } from '../types';
import { CyberOrb } from './CyberOrb';
import { LessonPlayer } from './learning/LessonPlayer';
import { ConversationQuiz } from './learning/ConversationQuiz';
import { MODULE_DIALOGUES } from '../data/moduleDialogues';

interface LearningHubProps {
  userDoc: UserDocument | null;
  onTopicMastered: (topicId: string, score: number, xpReward: number) => void;
  onCompleteTopic?: (topicId: string, xpReward: number) => void;
  onPassQuiz?: (topicId: string, score: number) => void;
  onQuizStateChange?: (isActive: boolean) => void;
  onLogin?: () => void;
}

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck, Lock, Scan, Binoculars, AlertTriangle, Cloud, Globe, Database, Atom, Wifi, 
  Library, Smartphone, Mail, EyeOff, UserCheck, Zap, Award, Flame, Target, LayoutGrid, 
  Box, Network, Star, Trophy, Brain, Ghost
};

const COURSES = [
  {
    id: "BOOTCAMP",
    title: "The Complete Cybersecurity Bootcamp: Zero to Hero",
    difficulty: "Beginner",
    hook: "Master the foundations of digital security. From zero knowledge to practical implementation, learn to protect systems, understand threats, and secure your digital life like a professional.",
    target: "Beginners & Aspiring Security Professionals",
    icon: "Brain",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80",
    color: "text-cyber-blue",
    bg: "bg-cyber-blue/10",
    border: "border-cyber-blue/20",
    glow: "shadow-cyber-blue/20"
  }
];

// --- Sub-components ---

const DialogueScene = ({ section }: { section: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const chars = section.characters ? Object.fromEntries(section.characters.map((c: any) => [c.id, c])) : {};

  const toggleNarration = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActiveLine(null);
    } else {
      setIsPlaying(true);
      playSequence(0);
    }
  };

  const playSequence = (index: number) => {
    if (!section.dialogue || index >= section.dialogue.length) {
      setIsPlaying(false);
      setActiveLine(null);
      return;
    }
    
    setActiveLine(index);
    const line = section.dialogue[index];
    const char = chars[line.characterId] || {};
    
    const utterance = new SpeechSynthesisUtterance(line.text);
    const voices = window.speechSynthesis.getVoices();
    
    const isExpert = char.role === 'expert' || char.role === 'analyst';
    if (isExpert && voices.length > 0) {
      utterance.voice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha')) || voices[0];
      utterance.pitch = 1.1;
    } else if (!isExpert && voices.length > 1) {
      utterance.voice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('daniel')) || voices[1];
      utterance.pitch = 0.9;
    }
    
    utterance.rate = 1.05;

    utterance.onend = () => {
      // Continue to next line
      playSequence(index + 1);
    };
    
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsPlaying(false);
      setActiveLine(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, [section.id]);

  return (
    <div className="bg-[#0A0D14] p-5 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden mb-6 shadow-2xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
          <Library className="w-5 h-5 text-cyber-blue" />
          {section.title}
        </h3>
        <button 
          onClick={toggleNarration}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border",
            isPlaying 
              ? "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
              : "bg-cyber-blue/10 text-cyber-blue border-cyber-blue/30 hover:bg-cyber-blue/20"
          )}
        >
          {isPlaying ? <XCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          {isPlaying ? "Stop Audio" : "Listen via TTS"}
        </button>
      </div>

      <div className="space-y-6">
        {section.dialogue?.map((line: any, idx: number) => {
          const char = chars[line.characterId];
          if (!char) return null;
          
          const isLeft = char.role === 'expert' || char.role === 'analyst';
          const isActive = activeLine === idx;
          const AvatarIcon = ICONS[char.avatarStr] || UserCheck;

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "flex gap-4 w-full",
                isLeft ? "flex-row" : "flex-row-reverse"
              )}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-transform",
                  isLeft ? "bg-black border-cyber-blue" : "bg-black border-cyber-green",
                  isActive ? "scale-110 shadow-[0_0_20px_rgba(0,240,255,0.4)]" : "opacity-80"
                )}>
                  <AvatarIcon className={cn("w-5 h-5", char.color)} />
                </div>
                <span className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-bold">{char.name}</span>
              </div>
              
              <div className={cn(
                "max-w-[80%] rounded-2xl p-4 sm:p-5 relative transition-all duration-300",
                isLeft ? "bg-white/5 border border-white/10 rounded-tl-sm" : "bg-cyber-blue/10 border border-cyber-blue/20 rounded-tr-sm",
                isActive && isLeft ? "border-cyber-blue shadow-[0_0_15px_rgba(0,150,255,0.15)] bg-white/10" : "",
                isActive && !isLeft ? "border-cyber-green shadow-[0_0_15px_rgba(0,255,100,0.15)] bg-cyber-blue/20" : ""
              )}>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed tracking-wide font-medium">
                  {line.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ProgressRing = ({ progress, size = 40, strokeWidth = 3, color = "currentColor" }: { progress: number, size?: number, strokeWidth?: number, color?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        className="opacity-10"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
};

const TiltCard = ({ children, onClick, disabled, className }: { children: React.ReactNode, onClick?: () => void, disabled?: boolean, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled ? onClick : undefined}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "relative group transition-all duration-300",
        !disabled ? "cursor-pointer" : "cursor-not-allowed opacity-50 grayscale",
        className
      )}
    >
      <div style={{ transform: "translateZ(50px)" }} className="h-full">
        {children}
      </div>
      {/* Holographic Light Effect */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </motion.div>
  );
};

const SkillTreeModal = ({ isOpen, onClose, completedTopics }: { isOpen: boolean, onClose: () => void, completedTopics: string[] }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-cyber-card border border-white/10 rounded-[2.5rem] p-8 overflow-y-auto max-h-[80vh] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyber-blue/10 rounded-2xl">
                  <Network className="w-6 h-6 text-cyber-blue" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Skill Tree</h2>
                  <p className="text-white/40 text-xs">Visualizing your path to mastery</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <ChevronRight className="w-6 h-6 rotate-90" />
              </button>
            </div>

            <div className="space-y-8">
              {COURSES.map((course) => {
                const courseTopics = LEARNING_TOPICS.filter(t => t.chapterId === course.id);
                const courseCompleted = courseTopics.filter(t => completedTopics.includes(t.id));
                const progress = (courseCompleted.length / courseTopics.length) * 100;

                return (
                  <div key={course.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">{course.title}</h3>
                      <span className="text-[10px] font-mono text-cyber-blue">{Math.round(progress)}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {courseTopics.map((topic) => {
                        const isDone = completedTopics.includes(topic.id);
                        return (
                          <div 
                            key={topic.id} 
                            className={cn(
                              "aspect-square rounded-lg border flex items-center justify-center transition-all",
                              isDone ? "bg-cyber-blue/20 border-cyber-blue text-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.3)]" : "bg-white/5 border-white/10 text-white/20"
                            )}
                            title={topic.title}
                          >
                            <Star className={cn("w-4 h-4", isDone ? "fill-current" : "")} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export function LearningHub({ userDoc, onTopicMastered, onCompleteTopic, onPassQuiz, onQuizStateChange, onLogin }: LearningHubProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isCourseStarted, setIsCourseStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<Topic | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Filter out old progress (CRITICAL RESET)
  const completedTopics = useMemo(() => {
    const topics = userDoc?.completedTopics || [];
    // Allow both old 'module-' format and new 'B-M1', 'I-M1', 'A-M1', 'BC-M1' formats
    return topics.filter(id => id.startsWith('module-') || /^[A-Z]+-M\d+$/.test(id));
  }, [userDoc]);

  useEffect(() => {
    if (onQuizStateChange) {
      const isQuizActive = !!activeQuiz && !showQuizResult;
      onQuizStateChange(isQuizActive);
    }
  }, [activeQuiz, showQuizResult, onQuizStateChange]);

  const quizScores = useMemo(() => userDoc?.quizScores || {}, [userDoc]);

  // --- Logic for Unlock Mechanics ---
  const totalProgress = (completedTopics.length / LEARNING_TOPICS.length) * 100;

  // --- Active Track Logic ---
  const currentTopic = useMemo(() => {
    return LEARNING_TOPICS.find(t => !completedTopics.includes(t.id)) || LEARNING_TOPICS[0];
  }, [completedTopics]);

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentSectionIndex(0);
  };

  const handleLessonPlayerComplete = (xpEarned: number) => {
    if (selectedTopic) {
      if (onCompleteTopic) onCompleteTopic(selectedTopic.id, xpEarned);
      setActiveQuiz(selectedTopic);
    }
  };

  const handleBack = () => {
    if (activeQuiz) {
      setActiveQuiz(null);
      setShowQuizResult(false);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else if (selectedTopic) {
      setSelectedTopic(null);
      setCurrentSectionIndex(0);
    } else if (isCourseStarted) {
      setIsCourseStarted(false);
    } else {
      setSelectedCourseId(null);
    }
  };

  const cleanText = (text: string | string[]) => {
    if (!text) return "";
    const content = Array.isArray(text) ? text.join(' ') : text;
    return content
      .replace(/^###\s+/gm, '')
      .replace(/^##\s+/gm, '')
      .replace(/^#\s+/gm, '')
      .replace(/\*\*/g, '')
      .replace(/\[|\]/g, '')
      .replace(/Introduction to Introduction to/gi, 'Introduction to')
      .trim();
  };

  const startQuiz = () => {
    setActiveQuiz(selectedTopic);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setShowQuizResult(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSubmit = (index: number) => {
    if (selectedAnswer !== null || !activeQuiz) return;
    
    setSelectedAnswer(index);
    const correct = index === activeQuiz.quiz[currentQuestionIndex].correctAnswerIndex;
    setIsAnswerCorrect(correct);
    
    if (correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    
    const totalQuestions = activeQuiz.quiz.length;
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      setShowQuizResult(true);
    }
  };

  const handleSaveAndContinue = () => {
    if (!activeQuiz) return;
    const totalQuestions = activeQuiz.quiz.length;
    const percentage = (quizScore / totalQuestions) * 100;
    
    if (quizScore === totalQuestions) {
      const courseModules = LEARNING_TOPICS.filter(t => t.chapterId === activeQuiz.chapterId);
      const willBeComplete = courseModules.filter(t => completedTopics.includes(t.id) || t.id === activeQuiz.id).length === courseModules.length;
      const totalXp = willBeComplete ? 150 : 50;
      
      onTopicMastered(activeQuiz.id, percentage, totalXp);
    }
    
    handleBack();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLevelColor = (level: string): { text: string; bg: string; border: string; glow: string } => {
    switch (level) {
      case 'Beginner': return { text: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/20', glow: 'shadow-cyber-blue/20' };
      case 'Intermediate': return { text: 'text-cyber-purple', bg: 'bg-cyber-purple/10', border: 'border-cyber-purple/20', glow: 'shadow-cyber-purple/20' };
      case 'Advanced': return { text: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', border: 'border-cyber-yellow/20', glow: 'shadow-cyber-yellow/20' };
      default: return { text: 'text-white/50', bg: 'bg-white/5', border: 'border-white/10', glow: 'shadow-white/5' };
    }
  };

  // --- Render Quiz Result ---
  if (showQuizResult && activeQuiz) {
    const totalQuestions = activeQuiz.quiz.length;
    const passed = quizScore === totalQuestions;
    const percentage = (quizScore / totalQuestions) * 100;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Lesson
        </button>
        <div className="bg-cyber-card p-8 rounded-3xl border border-white/5 text-center space-y-6 backdrop-blur-xl">
          <div className={cn(
            "w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4",
            passed ? "border-cyber-green/50 bg-cyber-green/10 text-cyber-green shadow-[0_0_30px_rgba(0,255,157,0.2)]" : "border-cyber-red/50 bg-cyber-red/10 text-cyber-red shadow-[0_0_30px_rgba(255,70,70,0.2)]"
          )}>
            {passed ? <Trophy className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{passed ? 'Mastery Achieved!' : 'Mastery Failed'}</h2>
            <p className="text-white/60 mt-2">
              {passed 
                ? 'You have successfully validated your knowledge of this module.' 
                : `You got ${quizScore}/${totalQuestions} correct. 3/3 required for mastery.`}
            </p>
          </div>
          <div className="flex gap-4 justify-center pt-4">
            {passed ? (
              <button onClick={handleSaveAndContinue} className="px-8 py-3 rounded-xl font-bold bg-cyber-green text-black hover:bg-cyber-green/90 transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)]">
                Save Progress & Continue
              </button>
            ) : (
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button onClick={startQuiz} className="w-full py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all">
                  Retry Analysis
                </button>
                <button onClick={() => setShowQuizResult(false)} className="w-full py-3 rounded-xl font-bold bg-cyber-blue text-black hover:bg-cyber-blue/90 transition-all">
                  Review Content
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // --- Render Quiz / Test ---
  if (activeQuiz) {
    const question = activeQuiz.quiz[currentQuestionIndex];
    const totalQuestions = activeQuiz.quiz.length;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-3xl mx-auto px-4 sm:px-0">
        <div className="flex items-center justify-between">
          <button onClick={() => { setActiveQuiz(null); }} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4" /> Abort Mission
          </button>
          <div className="flex items-center gap-4">
            <div className="h-1 w-24 sm:w-32 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-cyber-blue" animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-cyber-blue">{currentQuestionIndex + 1}/{totalQuestions}</span>
          </div>
        </div>
        <div className="bg-cyber-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 backdrop-blur-xl">
          <h2 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 leading-relaxed">{cleanText(question.question)}</h2>
          <div className="grid gap-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctAnswerIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSubmit(idx)}
                  disabled={selectedAnswer !== null}
                  className={cn(
                    "w-full text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-between text-sm sm:text-base",
                    selectedAnswer === null ? "border-white/10 hover:border-cyber-blue/50 hover:bg-white/5" :
                    isCorrect ? "border-cyber-green bg-cyber-green/10 text-cyber-green" :
                    isSelected ? "border-cyber-red bg-cyber-red/10 text-cyber-red" : "border-white/5 opacity-50"
                  )}
                >
                  <span>{cleanText(option)}</span>
                  {selectedAnswer !== null && isCorrect && <CheckCircle className="w-5 h-5" />}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {selectedAnswer !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-6 sm:pt-8 space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/70 italic">
                  {cleanText(question.explanation)}
                </div>
                {question.industryInsight && (
                  <div className="p-4 rounded-xl bg-cyber-blue/10 border border-cyber-blue/20 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-cyber-blue font-bold mb-1 uppercase tracking-wider text-[10px]">
                      <Briefcase className="w-3 h-3" /> Industry Insight
                    </div>
                    <p className="text-white/80">{cleanText(question.industryInsight)}</p>
                  </div>
                )}
                <button onClick={nextQuestion} className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold bg-cyber-blue text-black hover:bg-cyber-blue/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] text-sm sm:text-base">
                  {currentQuestionIndex < totalQuestions - 1 ? 'Next Phase' : 'Complete Analysis'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // --- Render Course Landing (Overview & Module List) ---
  if (selectedCourseId && !selectedTopic) {
    const course = COURSES.find(c => c.id === selectedCourseId)!;
    const courseTopics = LEARNING_TOPICS.filter(t => t.chapterId === selectedCourseId);
    const Icon = ICONS[course.icon] || Library;

    // STEP 2: Course Overview Screen
    return (
      <AnimatePresence mode="wait">
        {!isCourseStarted ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-8 sm:py-12 px-4 sm:px-0"
          >
            <button onClick={() => setSelectedCourseId(null)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4" /> Back to Academy
            </button>

            <div className="bg-cyber-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-4 text-center md:text-left">
                <div className={cn("inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl mx-auto md:mx-0", course.bg, course.color)}>
                  <Icon className="w-6 h-6 sm:w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">{course.title}</h1>
                  <p className="text-xs sm:text-sm text-white/50 max-w-xl leading-relaxed mx-auto md:mx-0">{course.hook}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-[9px] sm:text-xs font-mono text-white/40">
                  <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-cyber-blue" /> {course.target}</span>
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-cyber-purple" /> {courseTopics.length} Modules</span>
                  <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-cyber-yellow" /> {course.difficulty}</span>
                </div>
                <div className="pt-2 sm:pt-4">
                  <button 
                    onClick={() => {
                      if (!userDoc || !userDoc.email) {
                        toast.error("Account Required", {
                          description: "Please log in or sign up to start the course and save your progress."
                        });
                        if (onLogin) onLogin();
                        return;
                      }
                      setIsCourseStarted(true);
                    }}
                    className="w-full md:w-auto px-6 py-3 bg-cyber-blue text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] flex items-center justify-center gap-2 text-xs"
                  >
                    START COURSE <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // STEP 3: Module List View
          <motion.div 
            key="modules"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto space-y-6 sm:space-y-8 py-8 sm:py-12 px-4 sm:px-0"
          >
            <div className="flex items-center justify-between">
              <button onClick={() => setIsCourseStarted(false)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4" /> Back to Overview
              </button>
              <div className="text-right">
                <h2 className="text-[10px] sm:text-sm font-bold text-white/40 uppercase tracking-widest">{course.title}</h2>
                <p className="text-[8px] sm:text-[10px] font-mono text-cyber-blue">Curriculum Progress</p>
              </div>
            </div>

            <div className="grid gap-4">
              {courseTopics.map((topic, index) => {
                const isCompleted = completedTopics.includes(topic.id);
                
                // Linear progression logic (Module Level)
                let isLocked = false;
                if (index > 0) {
                  const prevTopic = courseTopics[index - 1];
                  if (!completedTopics.includes(prevTopic.id)) {
                    isLocked = true;
                  }
                }

                return (
                  <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    disabled={isLocked}
                    onClick={() => handleTopicClick(topic)}
                    className={cn(
                      "w-full p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border flex items-center justify-between transition-all group relative overflow-hidden",
                      isLocked ? "bg-black/20 border-white/5 cursor-not-allowed" :
                      isCompleted ? "bg-cyber-blue/5 border-cyber-blue/20 hover:border-cyber-blue/40" :
                      "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className={cn("flex items-center gap-4 sm:gap-8", isLocked && "blur-[2px]")}>
                      <div className={cn(
                        "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl transition-all",
                        isLocked ? "bg-white/5 text-white/10" :
                        isCompleted ? "bg-cyber-blue text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]" : "bg-white/10 text-white"
                      )}>
                        {isLocked ? <Lock className="w-5 h-5 sm:w-6 sm:h-6" /> : index + 1}
                      </div>
                      <div className="text-left relative">
                        <h4 className={cn("text-base sm:text-xl font-bold flex flex-wrap items-center gap-2", isLocked ? "text-white/20" : "text-white")}>
                          {cleanText(topic.title.includes(': ') ? topic.title.split(': ')[1] : topic.title)}
                          {MODULE_DIALOGUES.find(d => d.id === topic.id) && !isLocked && (
                            <span className="text-[9px] bg-cyber-blue/20 text-cyber-blue px-2 py-0.5 rounded-full border border-cyber-blue/30 uppercase tracking-widest shrink-0">
                              Story Mode
                            </span>
                          )}
                        </h4>
                        <p className={cn("text-xs sm:text-sm mt-1 line-clamp-1", isLocked ? "text-white/10" : "text-white/40")}>
                          {isLocked ? "Complete previous module to unlock" : cleanText(topic.sections?.[0]?.content?.substring(0, 80) || "") + "..."}
                        </p>
                      </div>
                    </div>

                    {!isLocked && (
                      <div className="flex items-center gap-4">
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-cyber-blue text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                            <CheckCircle className="w-4 h-4 sm:w-5 h-5" /> <span className="hidden sm:inline">Mastered</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyber-blue group-hover:text-black transition-all">
                            <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
                          </div>
                        )}
                      </div>
                    )}

                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Lock className="w-6 h-6 sm:w-8 h-8 text-white/10" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- Render Topic Detail ---
  if (selectedTopic) {
    const dialogue = MODULE_DIALOGUES.find(d => d.id === selectedTopic.id);

    if (dialogue) {
      if (activeQuiz) {
        return (
          <ConversationQuiz 
            questions={selectedTopic.quiz} 
            onComplete={(score) => {
              if (onPassQuiz) onPassQuiz(selectedTopic.id, score);
              setActiveQuiz(null);
              setSelectedTopic(null);
            }} 
          />
        );
      }

      return (
        <LessonPlayer 
          topic={selectedTopic} 
          dialogue={dialogue} 
          onComplete={handleLessonPlayerComplete} 
          onClose={() => setSelectedTopic(null)} 
        />
      );
    }

    const Icon = ICONS[selectedTopic.icon] || Library;
    const colors = getLevelColor(selectedTopic.level);
    return (
      <motion.div className="fixed inset-0 z-[100] bg-cyber-bg overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <button onClick={handleBack} className="mb-6 sm:mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>
          <div className="bg-cyber-card p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-white/5 space-y-6 sm:space-y-8 backdrop-blur-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className={`p-4 sm:p-5 rounded-2xl ${colors.bg} ${colors.text}`}>
                <Icon className="w-8 h-8 sm:w-10 h-10" />
              </div>
              <div>
                <span className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-2 inline-block", colors.border, colors.text)}>
                  {selectedTopic.level}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{cleanText(selectedTopic.title)}</h1>
              </div>
            </div>
            <div className="grid gap-6 sm:gap-8">
              {/* Sequential Content Structure */}
              <div className="space-y-6 sm:space-y-8">
                <AnimatePresence mode="wait">
                  {selectedTopic.sections.map((section, index) => {
                    if (index !== currentSectionIndex) return null;

                    return (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 sm:space-y-8"
                      >
                        {section.type === 'intro' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-blue mb-4 flex items-center gap-2">
                              <Brain className="w-5 h-5 sm:w-6 h-6" />
                              {cleanText(section.title)}
                            </h3>
                            <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                              {cleanText(section.content || "")}
                            </p>
                            {section.learningObjectives && section.learningObjectives.length > 0 && (
                              <div className="bg-black/20 p-4 sm:p-6 rounded-xl border border-white/5">
                                <h4 className="font-bold text-white/60 mb-3 uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                                  <Target className="w-4 h-4" /> Learning Objectives
                                </h4>
                                <ul className="space-y-2">
                                  {section.learningObjectives.map((obj, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                                      <span className="text-cyber-blue mt-1">•</span>
                                      <span>{cleanText(obj)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {section.type === 'concept' && (
                          <div className="space-y-6">
                            <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                              <h3 className="text-lg sm:text-xl font-bold text-cyber-purple mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 sm:w-6 h-6" />
                                {cleanText(section.title)}
                              </h3>
                              {section.definition && (
                                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                                  {cleanText(section.definition)}
                                </p>
                              )}
                              {section.howItWorks && (
                                <div className="bg-black/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 mb-6">
                                  <h4 className="font-bold text-white/60 mb-2 uppercase tracking-widest text-[10px] sm:text-xs">Technical Breakdown</h4>
                                  <p className="text-sm sm:text-base text-white/80">{cleanText(section.howItWorks)}</p>
                                </div>
                              )}
                              {section.example && (
                                <div className="bg-cyber-blue/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cyber-blue/20 mb-6">
                                  <h4 className="font-bold text-cyber-blue mb-2 uppercase tracking-widest text-[10px] sm:text-xs">Practical Example</h4>
                                  <p className="text-sm sm:text-base text-white/80">{cleanText(section.example)}</p>
                                </div>
                              )}
                              {section.caseStudy && (
                                <div className="bg-cyber-yellow/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cyber-yellow/30 mb-6">
                                  <div className="flex items-center gap-2 mb-3 text-cyber-yellow">
                                    <Briefcase className="w-4 h-4 sm:w-5 h-5" />
                                    <h4 className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">Real-World Case Study</h4>
                                  </div>
                                  <h5 className="font-bold text-white mb-2">{cleanText(section.caseStudy.title)}</h5>
                                  <p className="text-sm sm:text-base text-white/80 mb-3">{cleanText(section.caseStudy.description)}</p>
                                  <div className="bg-black/30 p-3 rounded-lg border border-cyber-yellow/20">
                                    <span className="text-xs text-cyber-yellow font-bold uppercase tracking-wider block mb-1">Impact</span>
                                    <p className="text-sm text-white/90">{cleanText(section.caseStudy.impact)}</p>
                                  </div>
                                </div>
                              )}
                              {section.whyItMatters && (
                                <div className="bg-cyber-red/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cyber-red/30 mb-6">
                                  <div className="flex items-center gap-3 mb-2 text-cyber-red">
                                    <AlertTriangle className="w-4 h-4 sm:w-5 h-5" />
                                    <h4 className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">Why It Matters</h4>
                                  </div>
                                  <p className="text-xs sm:text-sm text-white/70 italic border-l-2 border-cyber-red pl-4">
                                    {cleanText(section.whyItMatters)}
                                  </p>
                                </div>
                              )}
                              {section.keyPrinciple && (
                                <div className="bg-cyber-green/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cyber-green/20">
                                  <h4 className="font-bold text-cyber-green mb-2 uppercase tracking-widest text-[10px] sm:text-xs">Key Principle</h4>
                                  <p className="text-sm sm:text-base text-white/80 font-bold">{cleanText(section.keyPrinciple)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {section.type === 'decision' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-yellow mb-4 flex items-center gap-2">
                              <Target className="w-5 h-5 sm:w-6 h-6" />
                              {cleanText(section.title)}
                            </h3>
                            {section.scenario && (
                              <div className="bg-black/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 mb-6">
                                <p className="text-base sm:text-lg text-white/90">{cleanText(section.scenario)}</p>
                              </div>
                            )}
                            <p className="text-lg sm:text-xl font-bold mb-6">{cleanText(section.question || "")}</p>
                            <div className="space-y-3">
                              {section.options?.map((option, i) => {
                                const isSelected = selectedAnswer === i;
                                const isCorrect = i === section.correctAnswerIndex;
                                const showResult = selectedAnswer !== null;
                                
                                return (
                                  <button
                                    key={i}
                                    disabled={showResult}
                                    onClick={() => {
                                      setSelectedAnswer(i);
                                      setIsAnswerCorrect(i === section.correctAnswerIndex);
                                    }}
                                    className={cn(
                                      "w-full p-3 sm:p-4 rounded-xl border text-left transition-all flex items-center justify-between text-sm sm:text-base",
                                      !showResult && "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30",
                                      showResult && isCorrect && "bg-cyber-green/20 border-cyber-green text-cyber-green",
                                      showResult && isSelected && !isCorrect && "bg-cyber-red/20 border-cyber-red text-cyber-red",
                                      showResult && !isSelected && !isCorrect && "bg-white/5 border-white/10 opacity-50"
                                    )}
                                  >
                                    <span>{cleanText(option)}</span>
                                    {showResult && isCorrect && <CheckCircle className="w-5 h-5" />}
                                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {selectedAnswer !== null && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                  "mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl border",
                                  isAnswerCorrect ? "bg-cyber-green/10 border-cyber-green/30" : "bg-cyber-red/10 border-cyber-red/30"
                                )}
                              >
                                <p className="font-bold mb-2">{isAnswerCorrect ? "Correct!" : "Incorrect."}</p>
                                <p className="text-sm sm:text-base text-white/80">{cleanText(section.explanation || "")}</p>
                                {section.insight && (
                                  <p className="mt-4 text-xs sm:text-sm text-cyber-blue italic">Insight: {cleanText(section.insight)}</p>
                                )}
                              </motion.div>
                            )}
                          </div>
                        )}

                        {section.type === 'summary' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-blue mb-4 flex items-center gap-2">
                              <Library className="w-5 h-5 sm:w-6 h-6" />
                              {cleanText(section.title)}
                            </h3>
                            {section.content && (
                              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                                {cleanText(section.content)}
                              </p>
                            )}
                            {section.keyFindings && (
                              <div className="space-y-4 mb-6">
                                <h4 className="font-bold text-white/60 uppercase tracking-widest text-[10px] sm:text-xs">Key Findings</h4>
                                {section.keyFindings.map((finding, i) => (
                                  <div key={i} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-black/20 rounded-xl border border-white/5">
                                    <div className="w-5 h-5 sm:w-6 h-6 rounded-full bg-cyber-blue/20 text-cyber-blue flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                                      {i + 1}
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/80">{cleanText(finding)}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            {section.corePrinciple && (
                              <div className="bg-cyber-green/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cyber-green/20 mb-6">
                                <h4 className="font-bold text-cyber-green mb-2 uppercase tracking-widest text-[10px] sm:text-xs">Core Principle</h4>
                                <p className="text-sm sm:text-base text-white/80 font-bold">{cleanText(section.corePrinciple)}</p>
                              </div>
                            )}
                            {section.actionableTakeaways && section.actionableTakeaways.length > 0 && (
                              <div className="bg-cyber-blue/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cyber-blue/20">
                                <h4 className="font-bold text-cyber-blue mb-3 uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                                  <Target className="w-4 h-4" /> Actionable Takeaways
                                </h4>
                                <ul className="space-y-2">
                                  {section.actionableTakeaways.map((takeaway, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                                      <CheckCircle className="w-4 h-4 text-cyber-blue shrink-0 mt-1" />
                                      <span>{cleanText(takeaway)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {section.type === 'visual' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-blue mb-4 flex items-center gap-2">
                              <Eye className="w-5 h-5 sm:w-6 h-6" />
                              {cleanText(section.title)}
                            </h3>
                            {section.content && (
                              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                                {cleanText(section.content)}
                              </p>
                            )}
                            {section.imageUrl && (
                              <motion.div 
                                layoutId={`img-container-${section.imageUrl}`}
                                className="rounded-xl overflow-hidden mb-6 border border-white/10 relative group cursor-zoom-in"
                                onClick={() => setExpandedImage(section.imageUrl!)}
                              >
                                <motion.img 
                                  layoutId={`img-${section.imageUrl}`}
                                  src={section.imageUrl} 
                                  alt={section.imageAlt || "Visual explanation"} 
                                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <div className="bg-black/60 backdrop-blur-sm p-3 rounded-full border border-white/20 text-white flex items-center gap-2 text-sm font-bold">
                                    <Scan className="w-4 h-4" /> Expand Image
                                  </div>
                                </div>
                              </motion.div>
                            )}
                            {section.videoUrl && (
                              <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black relative">
                                {(section.videoUrl.includes('youtube.com') || section.videoUrl.includes('youtu.be')) ? (
                                  <iframe 
                                    src={section.videoUrl} 
                                    title="Video explanation" 
                                    className="w-full h-full"
                                    allowFullScreen 
                                  />
                                ) : (
                                  <video 
                                    src={section.videoUrl} 
                                    controls 
                                    className="w-full h-full object-contain"
                                    preload="metadata"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {section.type === 'step_by_step' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-yellow mb-6 flex items-center gap-2">
                              <Target className="w-5 h-5 sm:w-6 h-6" />
                              {cleanText(section.title)}
                            </h3>
                            {section.content && (
                              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                                {cleanText(section.content)}
                              </p>
                            )}
                            <div className="space-y-6">
                              {section.steps?.map((step, i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                                  <div className="w-8 h-8 rounded-full bg-cyber-yellow/20 text-cyber-yellow font-bold flex items-center justify-center shrink-0 border border-cyber-yellow/30 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                                    {i + 1}
                                  </div>
                                  <div className="bg-black/30 p-4 sm:p-6 rounded-xl border border-white/5 flex-grow w-full border-l-2 border-l-cyber-yellow/50">
                                    <h4 className="font-bold text-white mb-2">{cleanText(step.title)}</h4>
                                    <p className="text-sm sm:text-base text-white/80">{cleanText(step.description)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.type === 'real_world' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-green mb-4 flex items-center gap-2">
                              <Globe className="w-5 h-5 sm:w-6 h-6" />
                              {cleanText(section.title)}
                            </h3>
                            {section.content && (
                              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                                {cleanText(section.content)}
                              </p>
                            )}
                            {section.realWorldScenario && (
                              <div className="bg-cyber-green/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cyber-green/20 mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-green/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                                <h4 className="font-bold text-cyber-green mb-2 uppercase tracking-widest text-[10px] sm:text-xs">Scenario</h4>
                                <p className="text-sm sm:text-base text-white/80">{cleanText(section.realWorldScenario)}</p>
                              </div>
                            )}
                            {section.realWorldImpact && (
                              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <h4 className="font-bold text-white/60 mb-2 uppercase tracking-widest text-[10px] sm:text-xs text-cyber-green">The Impact</h4>
                                <p className="text-sm sm:text-base text-white/80 font-medium">{cleanText(section.realWorldImpact)}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {section.type === 'common_mistakes' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-red mb-6 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 sm:w-6 h-6" />
                              {cleanText(section.title)}
                            </h3>
                            {section.content && (
                              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                                {cleanText(section.content)}
                              </p>
                            )}
                            <div className="grid gap-4 sm:grid-cols-2">
                              {section.mistakes?.map((m, i) => (
                                <div key={i} className="bg-black/40 p-5 rounded-xl border border-cyber-red/20 group hover:border-cyber-red/40 transition-colors">
                                  <div className="flex items-start gap-3 mb-3">
                                    <XCircle className="w-5 h-5 text-cyber-red shrink-0 mt-0.5" />
                                    <p className="text-sm text-white/90 font-medium">{cleanText(m.mistake)}</p>
                                  </div>
                                  <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                                    <CheckCircle className="w-5 h-5 text-cyber-green shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm text-white/70">{cleanText(m.correction)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.type === 'advanced' && (
                          <div className="bg-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
                            <h3 className="text-lg sm:text-xl font-bold text-cyber-purple mb-4 flex items-center gap-2">
                              <Zap className="w-5 h-5 sm:w-6 h-6 group-hover:animate-pulse" />
                              {cleanText(section.title)}
                            </h3>
                            {section.content && (
                              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                                {cleanText(section.content)}
                              </p>
                            )}
                            {section.deepDive && (
                              <div className="bg-cyber-purple/5 p-5 rounded-xl border border-cyber-purple/20 mb-6 shadow-inner font-mono text-sm leading-relaxed text-white/80">
                                {cleanText(section.deepDive)}
                              </div>
                            )}
                            {section.advancedInsight && (
                              <div className="flex items-start gap-4 p-4 bg-black/30 rounded-xl border-l-2 border-l-cyber-purple">
                                <Brain className="w-6 h-6 text-cyber-purple shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold text-cyber-purple uppercase tracking-widest mb-1">Expert Insight</h4>
                                  <p className="text-sm sm:text-base text-white/90">{cleanText(section.advancedInsight)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Navigation Controls */}
                        <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-white/10">
                          <button
                            onClick={() => {
                              setCurrentSectionIndex(prev => Math.max(0, prev - 1));
                              setSelectedAnswer(null);
                              setIsAnswerCorrect(null);
                            }}
                            disabled={currentSectionIndex === 0}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm sm:text-base",
                              currentSectionIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5 text-white/70 hover:text-white"
                            )}
                          >
                            <ArrowLeft className="w-4 h-4" /> Previous
                          </button>
                          
                          <div className="flex gap-1">
                            {selectedTopic.sections.map((_, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full transition-all",
                                  i === currentSectionIndex ? "bg-cyber-blue w-4" : "bg-white/20"
                                )}
                              />
                            ))}
                          </div>

                          <button
                            onClick={() => {
                              if (currentSectionIndex < selectedTopic.sections.length - 1) {
                                setCurrentSectionIndex(prev => prev + 1);
                                setSelectedAnswer(null);
                                setIsAnswerCorrect(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                startQuiz();
                              }
                            }}
                            className={cn(
                              "flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base",
                              currentSectionIndex === selectedTopic.sections.length - 1
                                ? "bg-cyber-green text-black hover:shadow-[0_0_20px_rgba(0,255,170,0.4)]"
                                : "bg-cyber-blue text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                            )}
                          >
                            {currentSectionIndex === selectedTopic.sections.length - 1 ? (
                              <>Take Module Assessment <CheckCircle className="w-4 h-4 sm:w-5 h-5" /></>
                            ) : (
                              <>Next <ChevronRight className="w-4 h-4 sm:w-5 h-5" /></>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- Main Hub Dashboard (STEP 1) ---
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-10 sm:space-y-16 pb-32 max-w-6xl mx-auto px-4 sm:px-0"
    >
      <SkillTreeModal 
        isOpen={isSkillTreeOpen} 
        onClose={() => setIsSkillTreeOpen(false)} 
        completedTopics={completedTopics} 
      />

      {/* Entry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-white/40 text-base sm:text-lg max-w-xl">Master the frontiers of cybersecurity through our structured certification paths.</p>
        </div>
        <button 
          onClick={() => setIsSkillTreeOpen(true)}
          className="flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:border-cyber-blue/50 transition-all group w-fit"
        >
          <Network className="w-4 h-4 sm:w-5 h-5 text-cyber-blue" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">View Progress Tree</span>
        </button>
      </div>

      {/* 3. The Library (Course Grid) - Compact with Images */}
      <section className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
          {COURSES.map((course) => {
            const courseTopics = LEARNING_TOPICS.filter(t => t.chapterId === course.id);
            const courseCompletedCount = courseTopics.filter(t => completedTopics.includes(t.id)).length;
            const progress = courseTopics.length > 0 ? (courseCompletedCount / courseTopics.length) * 100 : 0;
            const isLocked = false;
            const Icon = ICONS[course.icon] || Library;

            return (
              <TiltCard 
                key={course.id} 
                disabled={isLocked}
                onClick={() => handleCourseClick(course.id)}
                className="h-full"
              >
                <div className="bg-cyber-card rounded-2xl sm:rounded-3xl border border-white/5 h-full flex flex-col overflow-hidden hover:border-white/20 transition-all group relative">
                  <div className="h-32 sm:h-40 w-full relative overflow-hidden bg-black/50">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] to-transparent opacity-100" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className={cn("p-2 rounded-xl backdrop-blur-md bg-black/40", course.color)}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-[#0A0D14] relative z-10 -mt-1">
                    <h4 className="text-white font-bold text-lg sm:text-xl leading-tight mb-2">{course.title}</h4>
                    <p className="text-xs sm:text-sm text-white/50 mb-6 line-clamp-2">{course.hook}</p>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">{course.difficulty}</span>
                        <span className={cn("text-[10px] sm:text-xs font-bold", course.color)}>{Math.round(progress)}% Mastery</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", course.bg.replace('/10', ''))} 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Upcoming Courses Announcement */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-3xl bg-cyber-card/30 border border-dashed border-white/10 text-center flex flex-col items-center justify-center gap-2 max-w-md mx-auto mt-8"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/30">
            <Trophy className="w-5 h-5 text-cyber-yellow" />
          </div>
          <p className="text-xs font-bold text-white/80 uppercase tracking-widest">More courses are yet to come</p>
          <p className="text-[11px] text-white/40 leading-relaxed max-w-xs">
            Our security researchers are hard at work formulating advanced chapters on DevSecOps, Smart Contract auditing, and AI defense vectors.
          </p>
        </motion.div>
      </section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {expandedImage && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setExpandedImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out" 
            />
            <motion.div 
              layoutId={`img-container-${expandedImage}`}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 shadow-2xl bg-black flex items-center justify-center cursor-default"
            >
              <button 
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 sm:p-3 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors border border-white/10 backdrop-blur-md"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <motion.img 
                layoutId={`img-${expandedImage}`}
                src={expandedImage} 
                alt="Expanded view" 
                className="w-full max-h-[90vh] object-contain cursor-zoom-out"
                onClick={() => setExpandedImage(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
