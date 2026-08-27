export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface PasswordAnalysis {
  strength: 'Weak' | 'Medium' | 'Strong';
  score: number;
  crackTime: string;
  suggestions: string[];
}

export interface PhishingAnalysis {
  riskLevel: 'Low' | 'Medium' | 'High';
  suspicious: boolean;
  reasons: string[];
  tips: string[];
}

export interface RiskState {
  score: number;
  level: 'Safe' | 'Moderate' | 'High Risk';
  color: string;
}

export interface UserPreferences {
  darkMode: boolean;
  highContrast: boolean;
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  hasAcceptedTerms?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export interface UserDocument {
  uid: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  createdAt: string;
  profileImage: string;
  
  badges: string[];
  stats: {
    aiQueries: number;
    actionsTaken: number;
    strongPasswords: number;
    phishingDetected: number;
    toolsUsed: string[];
    topicsCompleted: number;
    quizzesPassed: number;
  };
  achievements?: {
    accountCreated: string;
    firstQuizCompleted?: string;
    firstBadgeUnlocked?: string;
    levelUpgrades: { level: string; date: string }[];
  };
  completedTopics: string[];
  quizScores: Record<string, number>;
  chatSessions?: ChatSession[];
  riskScore: number;
  lastAnalyzed?: string;
  preferences: UserPreferences;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  industryInsight?: string;
}

export interface Character {
  id: string;
  name: string;
  role: 'expert' | 'learner' | 'skeptic' | 'analyst' | 'target';
  avatarStr: string;
  color: string;
}

export interface DialogueLine {
  characterId: string;
  text: string;
  isAction?: boolean; // If true, rendering might highlight it or show it as an event instead of speech
}

export interface Section {
  id: string;
  type: 'intro' | 'concept' | 'decision' | 'summary' | 'visual' | 'step_by_step' | 'real_world' | 'common_mistakes' | 'advanced' | 'dialogue';
  title: string;
  
  // Intro / Summary / Concept / General
  content?: string;
  learningObjectives?: string[];

  // Dialogue specific
  characters?: Character[];
  dialogue?: DialogueLine[];
  
  // Concept specific
  definition?: string;
  howItWorks?: string | string[];
  example?: string;
  caseStudy?: {
    title: string;
    description: string;
    impact: string;
  };
  whyItMatters?: string;
  keyPrinciple?: string;
  
  // Decision specific
  scenario?: string;
  question?: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanation?: string;
  insight?: string;
  
  // Summary specific
  keyFindings?: string[];
  corePrinciple?: string;
  actionableTakeaways?: string[];
  
  // Visual specific
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string; // YouTube or external video URL
  
  // Step-by-Step
  steps?: { title: string; description: string; }[];
  
  // Real world
  realWorldScenario?: string;
  realWorldImpact?: string;
  
  // Common mistakes
  mistakes?: { mistake: string; correction: string; }[];
  
  // Advanced specific
  advancedInsight?: string;
  deepDive?: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon: string;
  isFinalAssessment?: boolean;
  sections: Section[];
  quiz: QuizQuestion[];
}
