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
}

export interface UserProfile {
  uid: string;
  email: string;
  riskScore: number;
  lastAnalyzed?: string;
  preferences?: UserPreferences;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export interface PublicProfile {
  uid: string;
  displayName: string;
  points: number;
  badges: string[];
  photoURL?: string;
  stats?: {
    aiQueries: number;
    actionsTaken: number;
    strongPasswords: number;
    phishingDetected: number;
    threatsAnalyzed: number;
    toolsUsed: string[];
    simulationsCompleted: number;
    topicsCompleted: number;
    quizzesPassed: number;
  };
  achievements?: {
    accountCreated: string;
    firstQuizCompleted?: string;
    firstBadgeUnlocked?: string;
    levelUpgrades: { level: string; date: string }[];
  };
  completedTopics?: string[];
  quizScores?: Record<string, number>;
  simulationScores?: Record<string, number>;
  chatSessions?: ChatSession[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon: string;
  overview: string;
  simpleExplanation: string;
  whyItMatters: string;
  explanation: string;
  realWorldExample: string;
  securityTips: string[];
  summary: string;
  quiz: QuizQuestion[];
}

export interface SimulationScenario {
  id: string;
  title: string;
  type: 'Phishing' | 'FakeLogin' | 'SuspiciousLink' | 'SocialEngineering';
  description: string;
  content: string; // URL, email body, or scenario details
  correctAnswer: 'Safe' | 'Suspicious' | 'Malicious';
  explanation: string;
  prevention: string;
  xpReward: number;
}
