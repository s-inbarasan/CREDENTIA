import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  BookOpen, Shield, Lock, Key, Eye, AlertTriangle, Server, Globe, 
  Database, Cpu, Wifi, CheckCircle, ArrowLeft, ChevronRight, 
  PlayCircle, Smartphone, Mail, EyeOff, UserCheck, Zap, Award, 
  Flame, Target, LayoutGrid, Layers, Network, Star, Trophy,
  LucideIcon, Brain, ShieldCheck, XCircle, Bot, Copy, Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../utils/cn';
import { LEARNING_TOPICS } from '../data/learningTopics';
import { Topic, UserDocument, QuizQuestion } from '../types';
import { CyberOrb } from './CyberOrb';

interface LearningHubProps {
  userDoc: UserDocument | null;
  onCompleteTopic: (topicId: string, xpReward: number) => void;
  onPassQuiz: (topicId: string, score: number) => void;
  onQuizStateChange?: (isActive: boolean) => void;
}

const ICONS: Record<string, LucideIcon> = {
  Shield, Lock, Key, Eye, AlertTriangle, Server, Globe, Database, Cpu, Wifi, BookOpen, Smartphone, Mail, EyeOff, UserCheck, Zap, Award, Flame, Target, LayoutGrid, Layers, Network, Star, Trophy, Brain, ShieldCheck
};

const COURSES = [
  {
    id: "B",
    title: "Cybersecurity Fundamentals: Train Your Brain",
    difficulty: "Beginner",
    hook: "Start your cybersecurity journey here. Learn the essential mindset, privacy practices, and defensive tools to protect yourself online.",
    target: "Everyone (Foundational skills).",
    icon: "Brain",
    color: "text-cyber-green",
    bg: "bg-cyber-green/10",
    border: "border-cyber-green/20",
    glow: "shadow-cyber-green/20"
  },
  {
    id: "C-SWA",
    title: "The Synthetic Web & AI Defense",
    difficulty: "Beginner",
    hook: "You can no longer trust your eyes or ears. This course teaches users how to survive in an internet flooded with AI-generated content, autonomous hacking agents, and deepfakes.",
    target: "Everyone (Mandatory survival skills).",
    icon: "Eye",
    color: "text-cyber-blue",
    bg: "bg-cyber-blue/10",
    border: "border-cyber-blue/20",
    glow: "shadow-cyber-blue/20"
  },
  {
    id: "C-IPF",
    title: "Identity 3.0 & The Passwordless Future",
    difficulty: "Intermediate",
    hook: "Passwords are dead. This course transitions users from outdated security models to the modern standard of biometric and cryptographic identity.",
    target: "General users and corporate employees.",
    icon: "Key",
    color: "text-cyber-purple",
    bg: "bg-cyber-purple/10",
    border: "border-cyber-purple/20",
    glow: "shadow-cyber-purple/20"
  },
  {
    id: "C-SPZ",
    title: "Spatial Privacy & Zero-Trust Living",
    difficulty: "Intermediate",
    hook: "The internet is no longer just on a screen; it’s in your home, your car, and your headset. This course secures the physical-digital bridge.",
    target: "Smart home owners, remote workers, and AR/VR users.",
    icon: "Layers",
    color: "text-cyber-yellow",
    bg: "bg-cyber-yellow/10",
    border: "border-cyber-yellow/20",
    glow: "shadow-cyber-yellow/20"
  },
  {
    id: "C-CSD",
    title: "Cloud Sovereignty & The Data Wars",
    difficulty: "Advanced",
    hook: "Data is the new oil, and you are the well. This course teaches users how to reclaim their digital footprint and secure their data in other people's computers (the Cloud).",
    target: "Freelancers, privacy advocates, and IT beginners.",
    icon: "Server",
    color: "text-cyber-red",
    bg: "bg-cyber-red/10",
    border: "border-cyber-red/20",
    glow: "shadow-cyber-red/20"
  },
  {
    id: "C-QRF",
    title: "Quantum-Ready Foundations",
    difficulty: "Expert",
    hook: "Looking over the horizon. This is a prestige course that prepares forward-thinking users for the next massive shift in global technology.",
    target: "Tech enthusiasts, developers, and advanced learners.",
    icon: "Cpu",
    color: "text-cyber-green",
    bg: "bg-cyber-green/10",
    border: "border-cyber-green/20",
    glow: "shadow-cyber-green/20"
  }
];

// --- Sub-components ---

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

export function LearningHub({ userDoc, onCompleteTopic, onPassQuiz, onQuizStateChange }: LearningHubProps) {
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

  // Filter out old progress (CRITICAL RESET)
  const completedTopics = useMemo(() => {
    const topics = userDoc?.completedTopics || [];
    // Allow both old 'module-' format and new 'B-M1', 'I-M1', 'A-M1' formats
    return topics.filter(id => id.startsWith('module-') || /^[BIA]-M\d+$/.test(id));
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
      onPassQuiz(activeQuiz.id, percentage);
      if (!completedTopics.includes(activeQuiz.id)) {
        const courseModules = LEARNING_TOPICS.filter(t => t.chapterId === activeQuiz.chapterId);
        const completedInCourse = courseModules.filter(t => completedTopics.includes(t.id)).length;
        const isCourseComplete = completedInCourse === 3;
        const totalXp = isCourseComplete ? 150 : 50;
        onCompleteTopic(activeQuiz.id, totalXp);
      }
    }
    handleBack();
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
    const Icon = ICONS[course.icon] || BookOpen;

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

            <div className="bg-cyber-card p-6 sm:p-12 rounded-3xl sm:rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-6 sm:p-12 opacity-5 pointer-events-none">
                <Icon className="w-32 h-32 sm:w-64 h-64" />
              </div>
              <div className="relative z-10 space-y-6 sm:space-y-8 text-center md:text-left">
                <div className={cn("inline-flex p-4 sm:p-6 rounded-2xl sm:rounded-3xl mx-auto md:mx-0", course.bg, course.color)}>
                  <Icon className="w-8 h-8 sm:w-12 h-12" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{course.title}</h1>
                  <p className="text-base sm:text-xl text-white/60 max-w-2xl leading-relaxed mx-auto md:mx-0">{course.hook}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-8 text-[10px] sm:text-sm font-mono text-white/40">
                  <span className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-cyber-blue" /> {course.target}</span>
                  <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-cyber-purple" /> 4 Modules</span>
                  <span className="flex items-center gap-2"><Award className="w-4 h-4 text-cyber-yellow" /> {course.difficulty}</span>
                </div>
                <div className="pt-4 sm:pt-8">
                  <button 
                    onClick={() => setIsCourseStarted(true)}
                    className="w-full md:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-cyber-blue text-black font-bold rounded-xl sm:rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] flex items-center justify-center gap-3 text-base sm:text-lg"
                  >
                    START COURSE <ChevronRight className="w-5 h-5" />
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
                        {isLocked ? <Lock className="w-5 h-5 sm:w-6 h-6" /> : index + 1}
                      </div>
                      <div className="text-left">
                        <h4 className={cn("text-base sm:text-xl font-bold", isLocked ? "text-white/20" : "text-white")}>
                          {cleanText(topic.title.includes(': ') ? topic.title.split(': ')[1] : topic.title)}
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
    const Icon = ICONS[selectedTopic.icon] || BookOpen;
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
                              <BookOpen className="w-5 h-5 sm:w-6 h-6" />
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

                        {section.type === 'ai_prompt' && (
                          <div className="bg-gradient-to-br from-cyber-blue/10 to-cyber-purple/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 text-center space-y-4 sm:space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue opacity-50" />
                            <div className="w-12 h-12 sm:w-16 h-16 mx-auto bg-black/50 rounded-xl sm:rounded-2xl flex items-center justify-center text-cyber-blue mb-2 sm:mb-4 border border-cyber-blue/30 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                              <Brain className="w-6 h-6 sm:w-8 h-8" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold">AI Mentor Prompt</h3>
                            <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">
                              Try asking the AI Mentor this prompt to deepen your understanding:
                            </p>
                            <div className="bg-black/60 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 text-left relative group shadow-inner">
                              <p className="text-cyber-blue font-mono text-xs sm:text-sm leading-relaxed">{cleanText(section.prompt || "")}</p>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(section.prompt || "");
                                  toast.success("Prompt copied to clipboard!");
                                }}
                                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 hover:text-cyber-blue"
                              >
                                <Copy className="w-3 h-3 sm:w-4 h-4" />
                              </button>
                            </div>
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

      {/* 3. The Library (Course Grid) */}
      <section className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {COURSES.map((course) => {
            const Icon = ICONS[course.icon] || BookOpen;
            const courseTopics = LEARNING_TOPICS.filter(t => t.chapterId === course.id);
            const courseCompletedCount = courseTopics.filter(t => completedTopics.includes(t.id)).length;
            const progress = (courseCompletedCount / courseTopics.length) * 100;
            
            // ALL COURSES UNLOCKED BY DEFAULT
            const isLocked = false;

            return (
              <TiltCard 
                key={course.id} 
                disabled={isLocked}
                onClick={() => handleCourseClick(course.id)}
                className="h-full"
              >
                <div className="bg-cyber-card p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-white/5 h-full flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6 sm:mb-8">
                      <div className={cn("p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-transform group-hover:scale-110", course.bg, course.color, course.glow)}>
                        <Icon className="w-6 h-6 sm:w-8 h-8" />
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold text-white">{Math.round(progress)}%</div>
                        <div className="text-[8px] uppercase tracking-widest text-white/30">Mastery</div>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="text-xl sm:text-2xl font-bold leading-tight text-white">{course.title}</h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-white/40 line-clamp-2">{course.hook}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 sm:mt-10 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex -space-x-1.5 sm:-space-x-2">
                        {[1, 2, 3, 4].map((m) => (
                          <div 
                            key={m} 
                            className={cn(
                              "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-cyber-bg transition-colors",
                              m <= courseCompletedCount ? "bg-cyber-blue" : "bg-white/10"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-white/20">{courseCompletedCount}/4 Modules</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-cyber-blue uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      {progress === 100 ? 'Review' : 'Enter'} <ChevronRight className="w-3 h-3 sm:w-4 h-4" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
