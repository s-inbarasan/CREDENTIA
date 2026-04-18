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

export interface Section {
  id: string;
  type: 'intro' | 'concept' | 'decision' | 'summary' | 'ai_prompt';
  title: string;
  
  // Intro / Summary / Concept
  content?: string;
  learningObjectives?: string[];
  
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
  
  // AI Prompt specific
  prompt?: string;
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
