import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  MessageSquare, 
  Lock, 
  AlertTriangle, 
  Zap, 
  Send, 
  User, 
  Bot, 
  ChevronRight, 
  RefreshCw,
  Info,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  Newspaper,
  ExternalLink,
  Trophy,
  Medal,
  Award,
  Star,
  Camera,
  X,
  Edit2,
  Copy,
  Check,
  Settings,
  Bell,
  Eye,
  ShieldAlert,
  PlayCircle,
  BookOpen,
  Home,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Message, RiskState, PasswordAnalysis, PhishingAnalysis, UserProfile, PublicProfile, ChatSession } from './types';
import { analyzePassword, analyzePhishing } from './utils/analyzer';
import { getCyberResponse, analyzeThreat, ThreatAnalysisResult } from './services/geminiService';
import { LearningHub } from './components/LearningHub';
import { SimulationCenter } from './components/SimulationCenter';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { ChatPanel } from './components/ChatPanel';
import { BADGE_DEFINITIONS, checkNewBadges } from './utils/badges';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, collection, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { cn } from './utils/cn';

const RiskMeter = ({ score }: { score: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  let color = "stroke-cyber-green";
  if (score > 40) color = "stroke-cyber-yellow";
  if (score > 70) color = "stroke-cyber-red";

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-white/10"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(color, "transition-colors duration-500")}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-50">Risk</span>
      </div>
    </div>
  );
};

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'learningHub' | 'profile' | 'leaderboard'>('home');
  const [user, setUser] = useState<AppUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBadgeNotification, setShowBadgeNotification] = useState<string | null>(null);
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);
  const [showSimulationCenter, setShowSimulationCenter] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSaveSettings = async (newPrefs: typeof preferences) => {
    if (user && profile) {
      try {
        await setDoc(doc(db, 'userProfiles', user.uid), { ...profile, preferences: newPrefs }, { merge: true });
        setShowSettingsSaved(true);
        setTimeout(() => setShowSettingsSaved(false), 3000);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'userProfiles');
      }
    }
  };

  const addRecentActivity = async (title: string, type: 'topic' | 'quiz' | 'simulation' | 'tool') => {
    if (user) {
      const newActivity = {
        id: Date.now().toString(),
        title,
        type,
        timestamp: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', user.uid, 'recentActivity', newActivity.id), newActivity);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'recentActivity');
      }
    }
  };

  const handleCompleteTopic = async (topicId: string, xpReward: number) => {
    if (!user || !publicProfile) return;
    
    const currentTopics = publicProfile.completedTopics || [];
    if (currentTopics.includes(topicId)) return;
    
    const newTopics = [...currentTopics, topicId];
    const newPoints = publicProfile.points + xpReward;
    
    const newStats = {
      ...publicProfile.stats,
      topicsCompleted: (publicProfile.stats?.topicsCompleted || 0) + 1,
      actionsTaken: (publicProfile.stats?.actionsTaken || 0) + 1
    };
    
    const newBadges = checkNewBadges(newStats, publicProfile.badges);
    
    try {
      addRecentActivity(`Completed: ${topicId.replace(/_/g, ' ')}`, 'topic');
      
      const updatedProfile = {
        ...publicProfile,
        completedTopics: newTopics,
        points: newPoints,
        stats: newStats,
        badges: [...publicProfile.badges, ...newBadges]
      };
      
      await setDoc(doc(db, 'publicProfiles', user.uid), updatedProfile);
      
      if (newBadges.length > 0) {
        setShowBadgeNotification(newBadges[0]);
        setTimeout(() => setShowBadgeNotification(null), 3000);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'publicProfiles');
    }
  };

  const handlePassQuiz = async (topicId: string, score: number) => {
    if (!user || !publicProfile) return;
    
    const currentScores = publicProfile.quizScores || {};
    const newScores = { ...currentScores, [topicId]: Math.max(score, currentScores[topicId] || 0) };
    
    const newStats = {
      ...publicProfile.stats,
      quizzesPassed: (publicProfile.stats?.quizzesPassed || 0) + 1,
      actionsTaken: (publicProfile.stats?.actionsTaken || 0) + 1
    };
    
    const newBadges = checkNewBadges(newStats, publicProfile.badges);
    
    try {
      addRecentActivity(`Passed Quiz: ${topicId.replace(/_/g, ' ')}`, 'quiz');
      
      const updatedProfile = {
        ...publicProfile,
        quizScores: newScores,
        stats: newStats,
        badges: [...publicProfile.badges, ...newBadges]
      };
      
      await setDoc(doc(db, 'publicProfiles', user.uid), updatedProfile);
      
      if (newBadges.length > 0) {
        setShowBadgeNotification(newBadges[0]);
        setTimeout(() => setShowBadgeNotification(null), 3000);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'publicProfiles');
    }
  };

  const handleCompleteSimulation = async (scenarioId: string, xpReward: number, score: number) => {
    if (!user || !publicProfile) return;
    
    const currentScores = publicProfile.simulationScores || {};
    if (currentScores[scenarioId] === 100) return; // Already passed perfectly
    
    const newScores = { ...currentScores, [scenarioId]: Math.max(score, currentScores[scenarioId] || 0) };
    const newPoints = publicProfile.points + xpReward;
    
    const newStats = {
      ...publicProfile.stats,
      simulationsCompleted: (publicProfile.stats?.simulationsCompleted || 0) + 1,
      actionsTaken: (publicProfile.stats?.actionsTaken || 0) + 1
    };
    
    const newBadges = checkNewBadges(newStats, publicProfile.badges);
    
    try {
      addRecentActivity(`Completed Simulation: ${scenarioId.replace(/_/g, ' ')}`, 'simulation');
      
      const updatedProfile = {
        ...publicProfile,
        simulationScores: newScores,
        points: newPoints,
        stats: newStats,
        badges: [...publicProfile.badges, ...newBadges]
      };
      
      await setDoc(doc(db, 'publicProfiles', user.uid), updatedProfile);
      
      if (newBadges.length > 0) {
        setShowBadgeNotification(newBadges[0]);
        setTimeout(() => setShowBadgeNotification(null), 3000);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'publicProfiles');
    }
  };

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [riskScore, setRiskScore] = useState(15);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preferences State
  const [preferences, setPreferences] = useState({
    darkMode: true,
    highContrast: false,
    notifications: true,
    soundEffects: true,
    hapticFeedback: true
  });

  // Analyzers State
  const [passwordInput, setPasswordInput] = useState('');
  const [passAnalysis, setPassAnalysis] = useState<PasswordAnalysis | null>(null);
  
  const [phishingInput, setPhishingInput] = useState('');
  const [phishAnalysis, setPhishAnalysis] = useState<PhishingAnalysis | null>(null);

  const [threatInput, setThreatInput] = useState('');
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysisResult | null>(null);
  const [isAnalyzingThreat, setIsAnalyzingThreat] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auth & Profile Sync
  useEffect(() => {
    let unsubPublicProfile: () => void;
    let unsubUserProfile: () => void;
    let unsubChatSessions: () => void;
    let unsubRecentActivity: () => void;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL
        };
        
        setUser(appUser);
        
        const defaultStats = {
          aiQueries: 0,
          actionsTaken: 0,
          strongPasswords: 0,
          phishingDetected: 0,
          threatsAnalyzed: 0,
          toolsUsed: [],
          simulationsCompleted: 0,
          topicsCompleted: 0,
          quizzesPassed: 0
        };

        const defaultPublicProfile: PublicProfile = {
          uid: firebaseUser.uid,
          displayName: appUser.displayName || 'User',
          points: 0,
          badges: [],
          photoURL: appUser.photoURL || '',
          completedTopics: [],
          quizScores: {},
          simulationScores: {},
          stats: defaultStats
        };

        const defaultUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: appUser.email || '',
          riskScore: 15,
          preferences
        };

        // Initialize documents if they don't exist
        try {
          const publicProfileRef = doc(db, 'publicProfiles', firebaseUser.uid);
          const publicProfileSnap = await getDoc(publicProfileRef);
          if (!publicProfileSnap.exists()) {
            await setDoc(publicProfileRef, defaultPublicProfile);
          }

          const userProfileRef = doc(db, 'userProfiles', firebaseUser.uid);
          const userProfileSnap = await getDoc(userProfileRef);
          if (!userProfileSnap.exists()) {
            await setDoc(userProfileRef, defaultUserProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'profiles');
        }

        // Listen to Public Profile
        unsubPublicProfile = onSnapshot(doc(db, 'publicProfiles', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as PublicProfile;
            setPublicProfile(data);
            setEditDisplayName(data.displayName);
            setEditPhotoURL(data.photoURL || '');
          }
        }, (error) => handleFirestoreError(error, OperationType.GET, 'publicProfiles'));

        // Listen to User Profile
        unsubUserProfile = onSnapshot(doc(db, 'userProfiles', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            setRiskScore(data.riskScore);
            if (data.preferences) {
              setPreferences(data.preferences);
            }
          }
        }, (error) => handleFirestoreError(error, OperationType.GET, 'userProfiles'));

        // Listen to Chat Sessions
        const chatSessionsQuery = query(collection(db, 'users', firebaseUser.uid, 'chatSessions'), orderBy('updatedAt', 'desc'));
        unsubChatSessions = onSnapshot(chatSessionsQuery, (snapshot) => {
          const sessions = snapshot.docs.map(doc => doc.data() as ChatSession);
          setChatSessions(sessions);
        }, (error) => handleFirestoreError(error, OperationType.GET, 'chatSessions'));

        // Listen to Recent Activity
        const recentActivityQuery = query(collection(db, 'users', firebaseUser.uid, 'recentActivity'), orderBy('timestamp', 'desc'), limit(5));
        unsubRecentActivity = onSnapshot(recentActivityQuery, (snapshot) => {
          const activities = snapshot.docs.map(doc => doc.data());
          setRecentActivity(activities);
        }, (error) => handleFirestoreError(error, OperationType.GET, 'recentActivity'));

      } else {
        setUser(null);
        setProfile(null);
        setPublicProfile(null);
        setRiskScore(15);
        setRecentActivity([]);
        setChatSessions([]);
        if (unsubPublicProfile) unsubPublicProfile();
        if (unsubUserProfile) unsubUserProfile();
        if (unsubChatSessions) unsubChatSessions();
        if (unsubRecentActivity) unsubRecentActivity();
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubPublicProfile) unsubPublicProfile();
      if (unsubUserProfile) unsubUserProfile();
      if (unsubChatSessions) unsubChatSessions();
      if (unsubRecentActivity) unsubRecentActivity();
    };
  }, []);

  // Fetch Leaderboard
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      const q = query(collection(db, 'publicProfiles'), orderBy('points', 'desc'), limit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const profiles = snapshot.docs.map(doc => doc.data() as PublicProfile);
        setLeaderboard(profiles);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'publicProfiles'));
      return () => unsubscribe();
    }
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isTyping]);

  const trackAction = async (pointsToAdd: number, actionType: keyof NonNullable<PublicProfile['stats']>, toolName?: string) => {
    if (!user || !publicProfile) return;
    
    let newPoints = publicProfile.points + pointsToAdd;
    let newBadges = [...publicProfile.badges];
    
    // Initialize stats if not present
    let stats = publicProfile.stats || {
      aiQueries: 0,
      actionsTaken: 0,
      strongPasswords: 0,
      phishingDetected: 0,
      threatsAnalyzed: 0,
      toolsUsed: [],
      simulationsCompleted: 0,
      topicsCompleted: 0,
      quizzesPassed: 0
    };

    // Update stats
    stats = { ...stats, actionsTaken: stats.actionsTaken + 1 };
    
    if (toolName && !stats.toolsUsed.includes(toolName)) {
      stats.toolsUsed = [...stats.toolsUsed, toolName];
    }
    
    if (actionType !== 'toolsUsed' && typeof stats[actionType] === 'number') {
      (stats[actionType] as number) += 1;
    }

    // Check for new badges
    const newlyUnlocked = checkNewBadges(stats, newBadges);
    
    if (newlyUnlocked.length > 0) {
      newBadges = [...newBadges, ...newlyUnlocked];
      // Show the first newly unlocked badge notification
      setShowBadgeNotification(newlyUnlocked[0]);
      setTimeout(() => setShowBadgeNotification(null), 3000);
    }
    
    const updatedProfile = { ...publicProfile, points: newPoints, badges: newBadges, stats };
    try {
      await setDoc(doc(db, 'publicProfiles', user.uid), updatedProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'publicProfiles');
    }
  };

  const updateRiskScore = async (newScore: number) => {
    if (!user || !profile) return;
    try {
      await setDoc(doc(db, 'userProfiles', user.uid), { ...profile, riskScore: newScore }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'userProfiles');
    }
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      
      setUser(null);
      setProfile(null);
      setPublicProfile(null);
      setIsGuest(false);
      setShowLogin(false);
      setActiveTab('home');
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const handleResetProgress = async () => {
    if (!user || !publicProfile || !profile) return;
    try {
      const resetPublicProfile = {
        ...publicProfile,
        points: 0,
        badges: [],
        stats: {
          aiQueries: 0,
          actionsTaken: 0,
          strongPasswords: 0,
          phishingDetected: 0,
          threatsAnalyzed: 0,
          toolsUsed: [],
          simulationsCompleted: 0,
          topicsCompleted: 0,
          quizzesPassed: 0
        }
      };
      await setDoc(doc(db, 'publicProfiles', user.uid), resetPublicProfile);
      await setDoc(doc(db, 'userProfiles', user.uid), { ...profile, riskScore: 15 }, { merge: true });
      alert("Progress has been reset.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'publicProfiles/userProfiles');
    }
  };

  const handleExportData = () => {
    if (!user || !publicProfile || !profile) return;
    const data = {
      userEmail: profile.email,
      userXP: publicProfile.points,
      userStats: publicProfile.stats,
      userBadges: publicProfile.badges,
      completedTopics: publicProfile.completedTopics,
      quizScores: publicProfile.quizScores,
      simulationScores: publicProfile.simulationScores,
      chatSessions: chatSessions,
      riskScore: profile.riskScore,
      recentActivity: recentActivity,
      preferences: profile.preferences
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credentia-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Profile Image Upload (Base64 resize)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setEditPhotoURL(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!user || !publicProfile) return;
    try {
      const updated = {
        ...publicProfile,
        displayName: editDisplayName || publicProfile.displayName,
        photoURL: editPhotoURL || publicProfile.photoURL || ''
      };
      
      await setDoc(doc(db, 'publicProfiles', user.uid), updated);
      setIsEditingProfile(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'publicProfiles');
    }
  };

  const onAnalyzePassword = () => {
    const result = analyzePassword(passwordInput);
    setPassAnalysis(result);
    updateRiskScore(Math.min(100, Math.max(0, riskScore + (result.score < 50 ? 10 : -5))));
    
    if (result.score > 80) {
      trackAction(20, 'strongPasswords', 'password');
    } else {
      trackAction(5, 'actionsTaken', 'password');
    }
    addRecentActivity('Password Analyzed', 'tool');
  };

  const onAnalyzePhishing = () => {
    const result = analyzePhishing(phishingInput);
    setPhishAnalysis(result);
    updateRiskScore(Math.min(100, Math.max(0, riskScore + (result.suspicious ? 15 : -2))));
    
    if (result.suspicious) {
      trackAction(15, 'phishingDetected', 'phishing');
    } else {
      trackAction(5, 'actionsTaken', 'phishing');
    }
    addRecentActivity('Phishing Analyzed', 'tool');
  };

  const onAnalyzeThreat = async () => {
    if (!threatInput.trim()) return;
    setIsAnalyzingThreat(true);
    const result = await analyzeThreat(threatInput);
    setThreatAnalysis(result);
    setIsAnalyzingThreat(false);
    
    if (result) {
      updateRiskScore(Math.min(100, Math.max(0, riskScore + (result.suspicious ? 15 : -2))));
      if (result.suspicious) {
        trackAction(15, 'threatsAnalyzed', 'threat');
      } else {
        trackAction(5, 'actionsTaken', 'threat');
      }
      addRecentActivity('Threat Analyzed', 'tool');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestions = [
    "How to spot phishing?",
    "Check my password strength",
    "What is 2FA?",
    "Secure my Wi-Fi"
  ];

  if (loading) {
    return (
      <div className="h-screen bg-cyber-bg flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Shield className="w-12 h-12 text-cyber-blue" />
        </motion.div>
      </div>
    );
  }

  if (!user && !isGuest) {
    if (showLogin) {
      return <Login onBack={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />;
    }
    return <LandingPage onLogin={() => setShowLogin(true)} onGuest={() => setIsGuest(true)} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-cyber-bg text-white overflow-hidden border-x border-white/10 shadow-2xl relative">
      
      {/* Badge Notification Overlay */}
      <AnimatePresence>
        {showBadgeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-24 left-4 right-4 z-50 bg-cyber-card border border-white/20 rounded-2xl p-4 shadow-2xl flex items-center gap-4"
          >
            {(() => {
              const badgeDef = BADGE_DEFINITIONS.find(b => b.id === showBadgeNotification);
              const Icon = badgeDef?.icon || Award;
              return (
                <>
                  <div className={cn("p-3 rounded-full border-2", badgeDef?.colorClass || "text-cyber-yellow border-cyber-yellow/50 bg-cyber-yellow/20")}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold uppercase tracking-wider", badgeDef ? badgeDef.colorClass.split(' ')[0] : "text-cyber-yellow")}>Badge Unlocked!</p>
                    <p className="text-lg font-bold">{showBadgeNotification}</p>
                    {badgeDef && <p className="text-[10px] text-white/50">{badgeDef.description}</p>}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Saved Notification Overlay */}
      <AnimatePresence>
        {showSettingsSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-24 left-4 right-4 z-50 bg-cyber-card border border-cyber-green/50 rounded-2xl p-4 shadow-[0_0_20px_rgba(74,222,128,0.3)] flex items-center gap-4 justify-center"
          >
            <CheckCircle2 className="w-6 h-6 text-cyber-green" />
            <p className="text-sm font-bold">Settings Saved Successfully</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-cyber-card border border-white/10 rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Edit Profile</h3>
                <button onClick={() => setIsEditingProfile(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyber-blue/50 bg-cyber-bg flex items-center justify-center">
                      {editPhotoURL ? (
                        <img src={editPhotoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-white/30" />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <p className="text-[10px] text-white/40 mt-2">Click to upload photo</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue/50"
                    placeholder="Enter your agent name"
                    maxLength={20}
                  />
                </div>

                <button 
                  onClick={saveProfile}
                  className="w-full bg-cyber-blue text-black font-bold py-3 rounded-xl hover:bg-cyber-blue/80 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-6 pt-10 border-b border-white/10 bg-cyber-bg/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyber-blue/30 cyber-glow bg-black flex items-center justify-center">
              <img src="/logo.png" alt="CREDENTIA Logo" className="w-full h-full object-cover" onError={(e) => {
                // Fallback to shield icon if image not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-cyber-blue/10');
                const shield = document.createElement('div');
                shield.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyber-blue"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>';
                e.currentTarget.parentElement?.appendChild(shield.firstChild as Node);
              }} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CREDENTIA</h1>
              <p className="text-[10px] text-cyber-blue font-semibold uppercase tracking-[0.2em]">Cyber AI Mentor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-white/5 transition-colors group relative"
                title="Logout"
              >
                <LogOut className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                className="p-2 rounded-full hover:bg-white/5 transition-colors group relative"
                title="Login"
              >
                <LogIn className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </button>
            )}
            <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <RefreshCw className="w-5 h-5 opacity-50" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6", "pb-24")}>
        {showSimulationCenter ? (
          <SimulationCenter 
            publicProfile={publicProfile}
            onCompleteSimulation={handleCompleteSimulation}
            onClose={() => setShowSimulationCenter(false)}
          />
        ) : activeTab === 'home' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* User Welcome */}
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-bold">
                  {user && publicProfile ? `Welcome back, ${publicProfile.displayName}` : "Welcome, Guest"}
                </h2>
                <p className="text-xs text-white/40">
                  {user ? "Your security profile is synced" : "Login to save your progress"}
                </p>
              </div>
              {user && publicProfile && (
                <div className="relative group cursor-pointer" onClick={() => setIsEditingProfile(true)}>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyber-blue/30 group-hover:border-cyber-blue transition-colors bg-cyber-card flex items-center justify-center">
                    {publicProfile.photoURL ? (
                      <img src={publicProfile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-6 h-6 text-white/30" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-cyber-blue text-black p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>

            {/* Security Score */}
            <section className="bg-cyber-card p-6 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="w-24 h-24" />
              </div>
              <div className="z-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-2">Security Score</h3>
                <p className="text-[10px] text-white/50 max-w-[200px] leading-relaxed">
                  Based on your learning progress, quiz scores, and tool usage.
                </p>
              </div>
              <div className="z-10">
                <RiskMeter score={100 - riskScore} />
              </div>
            </section>

            {/* Learning Progress Summary */}
            <section className="bg-gradient-to-r from-cyber-card to-cyber-bg p-5 rounded-3xl border border-cyber-blue/20 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-cyber-blue font-bold tracking-wider mb-1">Learning Progress</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">{publicProfile?.completedTopics?.length || 0}</span>
                  <span className="text-xs text-white/50 mb-1">/ 50 Topics</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="text-right">
                  <p className="text-[10px] uppercase text-cyber-yellow font-bold tracking-wider mb-1">Cyber XP</p>
                  <div className="flex items-end gap-1 justify-end">
                    <span className="text-xl font-bold">{publicProfile?.points || 0}</span>
                    <span className="text-xs text-white/50 mb-1">pts</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Access Cards */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 px-2">Quick Access</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('learningHub')}
                  className="bg-cyber-card p-5 rounded-3xl border border-white/5 hover:border-cyber-blue/50 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-cyber-blue" />
                  </div>
                  <span className="text-sm font-bold">Learning Hub</span>
                </button>
                <button 
                  onClick={() => setActiveTab('tools')}
                  className="bg-cyber-card p-5 rounded-3xl border border-white/5 hover:border-cyber-purple/50 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-cyber-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="w-6 h-6 text-cyber-purple" />
                  </div>
                  <span className="text-sm font-bold">Security Tools</span>
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 px-2">Recent Activity</h3>
              <div className="bg-cyber-card rounded-3xl border border-white/5 overflow-hidden">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={activity.id} className={cn("p-4 flex items-center gap-3", index !== recentActivity.length - 1 && "border-b border-white/5")}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        activity.type === 'topic' ? "bg-cyber-yellow/10 text-cyber-yellow" :
                        activity.type === 'quiz' ? "bg-cyber-green/10 text-cyber-green" :
                        activity.type === 'simulation' ? "bg-cyber-purple/10 text-cyber-purple" :
                        "bg-cyber-blue/10 text-cyber-blue"
                      )}>
                        {activity.type === 'topic' ? <BookOpen className="w-4 h-4" /> :
                         activity.type === 'quiz' ? <Award className="w-4 h-4" /> :
                         activity.type === 'simulation' ? <Shield className="w-4 h-4" /> :
                         <Bot className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-white/40">
                          {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-white/50 text-sm">
                    No recent activity. Start learning to earn XP!
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : activeTab === 'tools' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="px-2">
              <h2 className="text-xl font-bold">Security Tools</h2>
              <p className="text-xs text-white/40">Analyze threats, passwords, and phishing attempts.</p>
            </div>

            {/* Simulation Center Banner */}
            <section className="bg-gradient-to-r from-orange-500/20 to-cyber-card p-6 rounded-3xl border border-orange-500/30 relative overflow-hidden group cursor-pointer" onClick={() => setShowSimulationCenter(true)}>
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500">
                <ShieldAlert className="w-24 h-24 text-orange-400" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-orange-400" />
                  Cyber Attack Simulator
                </h2>
                <p className="text-sm text-white/70 mb-4 max-w-[80%]">Test your skills against real-world threats like phishing and social engineering.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-bold rounded-xl text-sm hover:bg-orange-400 transition-colors">
                  <PlayCircle className="w-4 h-4" /> Start Simulation
                </div>
              </div>
            </section>

            {/* Analyzers */}
            <section className="space-y-4">
              <div className="bg-cyber-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                {/* Points indicator */}
                <div className="absolute top-4 right-4 text-[10px] text-cyber-blue font-bold flex items-center gap-1 bg-cyber-blue/10 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" /> +XP
                </div>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyber-blue" />
                  Password Analyzer
                </h3>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="password"
                    placeholder="Enter password to test..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyber-blue/50"
                  />
                  <button 
                    onClick={onAnalyzePassword}
                    className="bg-cyber-blue text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-cyber-blue/80 transition-colors"
                  >
                    Test
                  </button>
                </div>
                {passAnalysis && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/50">Strength:</span>
                      <span className={cn(
                        "text-xs font-bold",
                        passAnalysis.strength === 'Strong' ? "text-cyber-green" :
                        passAnalysis.strength === 'Medium' ? "text-cyber-yellow" : "text-cyber-red"
                      )}>{passAnalysis.strength}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${passAnalysis.score}%` }}
                        className={cn(
                          "h-full",
                          passAnalysis.score > 80 ? "bg-cyber-green" :
                          passAnalysis.score > 40 ? "bg-cyber-yellow" : "bg-cyber-red"
                        )}
                      />
                    </div>
                    <p className="text-[10px] text-white/40 italic">Estimated crack time: {passAnalysis.crackTime}</p>
                    {passAnalysis.suggestions.length > 0 && (
                      <ul className="text-[10px] space-y-1">
                        {passAnalysis.suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-1 text-cyber-yellow">
                            <ChevronRight className="w-3 h-3 mt-0.5" /> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="bg-cyber-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                {/* Points indicator */}
                <div className="absolute top-4 right-4 text-[10px] text-cyber-yellow font-bold flex items-center gap-1 bg-cyber-yellow/10 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" /> +XP
                </div>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-cyber-yellow" />
                  Phishing Detector
                </h3>
                <textarea 
                  placeholder="Paste message or link here..."
                  value={phishingInput}
                  onChange={(e) => setPhishingInput(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyber-yellow/50 h-20 mb-3 resize-none"
                />
                <button 
                  onClick={onAnalyzePhishing}
                  className="w-full bg-cyber-yellow text-black font-bold py-2 rounded-xl text-sm hover:bg-cyber-yellow/80 transition-colors"
                >
                  Scan Content
                </button>
                {phishAnalysis && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {phishAnalysis.suspicious ? (
                        <XCircle className="w-5 h-5 text-cyber-red" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                      )}
                      <span className="text-sm font-bold">Risk: {phishAnalysis.riskLevel}</span>
                    </div>
                    {phishAnalysis.reasons.map((r, i) => (
                      <p key={i} className="text-[10px] text-cyber-red bg-cyber-red/5 p-2 rounded-lg border border-cyber-red/10">{r}</p>
                    ))}
                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase text-white/30 mb-2">Prevention Tips</p>
                      <ul className="text-[10px] space-y-1">
                        {phishAnalysis.tips.map((t, i) => (
                          <li key={i} className="flex items-start gap-1 text-cyber-blue">
                            <ChevronRight className="w-3 h-3 mt-0.5" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="bg-cyber-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                {/* Points indicator */}
                <div className="absolute top-4 right-4 text-[10px] text-cyber-red font-bold flex items-center gap-1 bg-cyber-red/10 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" /> +XP
                </div>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyber-red" />
                  Threat Analysis
                </h3>
                <input 
                  type="text"
                  placeholder="Enter suspicious URL or IP address..."
                  value={threatInput}
                  onChange={(e) => setThreatInput(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyber-red/50 mb-3"
                />
                <button 
                  onClick={onAnalyzeThreat}
                  disabled={isAnalyzingThreat}
                  className="w-full bg-cyber-red text-white font-bold py-2 rounded-xl text-sm hover:bg-cyber-red/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzingThreat ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Threat"
                  )}
                </button>
                {threatAnalysis && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {threatAnalysis.suspicious ? (
                        <XCircle className="w-5 h-5 text-cyber-red" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                      )}
                      <span className="text-sm font-bold">Risk: {threatAnalysis.riskLevel}</span>
                    </div>
                    <p className="text-xs text-white/70">{threatAnalysis.details}</p>
                    {threatAnalysis.reasons.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-white/30">Reasons</p>
                        {threatAnalysis.reasons.map((r, i) => (
                          <p key={i} className="text-[10px] text-cyber-red bg-cyber-red/5 p-2 rounded-lg border border-cyber-red/10">{r}</p>
                        ))}
                      </div>
                    )}
                    {threatAnalysis.recommendations.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[10px] font-bold uppercase text-white/30 mb-2">Recommendations</p>
                        <ul className="text-[10px] space-y-1">
                          {threatAnalysis.recommendations.map((t, i) => (
                            <li key={i} className="flex items-start gap-1 text-cyber-blue">
                              <ChevronRight className="w-3 h-3 mt-0.5" /> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </section>
            
            <p className="text-[10px] text-center text-white/20 pb-4">
              CREDENTIA Cyber AI Mentor • For educational purposes only
            </p>
          </motion.div>
        ) : activeTab === 'learningHub' ? (
          <LearningHub 
            publicProfile={publicProfile} 
            onCompleteTopic={handleCompleteTopic}
            onPassQuiz={handlePassQuiz}
          />
        ) : activeTab === 'leaderboard' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-cyber-yellow" />
                Leaderboard
              </h2>
              <span className="text-xs text-white/40">Top Cyber Agents</span>
            </div>

            {!user ? (
              <div className="bg-cyber-card p-6 rounded-2xl border border-white/5 text-center">
                <Lock className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/60">Log in to view the global leaderboard and compete with others.</p>
                <button 
                  onClick={handleLogin}
                  className="mt-4 bg-cyber-blue text-black font-bold px-6 py-2 rounded-xl text-sm hover:bg-cyber-blue/80 transition-colors"
                >
                  Log In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-white/40 text-sm py-10">No agents on the leaderboard yet.</p>
                ) : (
                  leaderboard.map((player, index) => (
                    <div 
                      key={player.uid} 
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                        player.uid === user.uid 
                          ? "bg-cyber-blue/10 border-cyber-blue/30" 
                          : "bg-cyber-card border-white/5"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                        index === 0 ? "bg-cyber-yellow text-black" :
                        index === 1 ? "bg-gray-300 text-black" :
                        index === 2 ? "bg-amber-700 text-white" : "bg-white/10 text-white/50"
                      )}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-black/50 shrink-0 flex items-center justify-center">
                        {player.photoURL ? (
                          <img src={player.photoURL} alt={player.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-white/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">
                          {player.displayName}
                          {player.uid === user.uid && <span className="text-[10px] text-cyber-blue ml-2">(You)</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-white/50">{player.points} XP</span>
                          {player.badges.length > 0 && (
                            <div className="flex gap-1">
                              {player.badges.slice(0, 3).map((badgeId, i) => {
                                const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                                if (!badgeDef) return null;
                                const Icon = badgeDef.icon;
                                return (
                                  <div key={i} className={cn("w-4 h-4 flex items-center justify-center border", badgeDef.shapeClass, badgeDef.colorClass)} title={badgeDef.name}>
                                    <Icon className="w-2 h-2" />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        ) : activeTab === 'profile' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-20"
          >
            {!user || !publicProfile ? (
              <div className="bg-cyber-card p-6 rounded-2xl border border-white/5 text-center mt-6">
                <Lock className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/60">Log in to view your profile and badges.</p>
                <button 
                  onClick={handleLogin}
                  className="mt-4 bg-cyber-blue text-black font-bold px-6 py-2 rounded-xl text-sm hover:bg-cyber-blue/80 transition-colors"
                >
                  Log In
                </button>
              </div>
            ) : (
              <>
                {/* Top Section: Profile Info */}
                <section className="bg-cyber-card p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-cyber-blue/20 to-transparent opacity-50" />
                  
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-20 bg-black/20 rounded-full backdrop-blur-sm"
                  >
                    <Settings className="w-6 h-6" />
                  </button>

                  <div className="relative group cursor-pointer mt-4" onClick={() => setIsEditingProfile(true)}>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyber-bg shadow-[0_0_20px_rgba(0,255,255,0.2)] bg-cyber-card flex items-center justify-center z-10 relative">
                      {publicProfile?.photoURL ? (
                        <img src={publicProfile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-12 h-12 text-white/30" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-cyber-blue text-black p-2 rounded-full z-20 shadow-lg">
                      <Edit2 className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-4">{publicProfile?.displayName || 'Cyber Agent'}</h2>
                  <p className="text-sm text-cyber-blue font-bold uppercase tracking-widest mt-1">
                    {(() => {
                      const xp = publicProfile?.points || 0;
                      if (xp > 1000) return 'Master';
                      if (xp > 500) return 'Expert';
                      if (xp > 100) return 'Intermediate';
                      return 'Cyber Recruit';
                    })()}
                  </p>
                  
                  <div className="flex gap-6 mt-6 w-full justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{publicProfile?.points || 0}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">Total XP</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {(() => {
                          const xp = publicProfile?.points || 0;
                          if (xp > 1000) return '1';
                          if (xp > 500) return '2';
                          if (xp > 100) return '3';
                          return '-';
                        })()}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">Rank</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                      <p className="text-2xl font-bold">{publicProfile?.badges.length || 0}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">Badges</p>
                    </div>
                  </div>
                </section>

                {/* Middle Section: Badges */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 px-2">Badges Earned</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {BADGE_DEFINITIONS.map((badge) => {
                      const isUnlocked = publicProfile?.badges.includes(badge.id);
                      const Icon = badge.icon;
                      
                      return (
                        <div 
                          key={badge.id}
                          className={cn(
                            "bg-cyber-card p-3 rounded-2xl border transition-all flex flex-col items-center text-center relative overflow-hidden aspect-square justify-center",
                            isUnlocked ? "border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "border-white/5 opacity-40 grayscale"
                          )}
                        >
                          {isUnlocked && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                          )}
                          <div className={cn(
                            "w-10 h-10 flex items-center justify-center mb-2 border-2",
                            badge.shapeClass,
                            isUnlocked ? badge.colorClass : "bg-black/50 border-white/10 text-white/30"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-[10px] font-bold leading-tight">{badge.name}</h3>
                        </div>
                      );
                    })}
                  </div>
                </section>
                
                <div className="pt-4">
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-cyber-card border border-cyber-red/30 text-cyber-red font-bold py-3 rounded-xl text-sm hover:bg-cyber-red/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : null}
      </main>

      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
        onResetProgress={handleResetProgress}
        preferences={preferences}
        onSavePreferences={(prefs) => {
          setPreferences(prefs);
          handleSaveSettings(prefs);
        }}
        onExportData={handleExportData}
      />

      {/* Floating AI Mentor Button */}
      <button
        onClick={() => setShowChatPanel(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-cyber-blue text-black rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-30"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Panel Overlay */}
      <AnimatePresence>
        {showChatPanel && (
          <ChatPanel
            isOpen={showChatPanel}
            onClose={() => setShowChatPanel(false)}
            userUid={user?.uid}
            chatSessions={chatSessions}
            onSessionUpdate={async (session) => {
              if (user) {
                try {
                  await setDoc(doc(db, 'users', user.uid, 'chatSessions', session.id), session);
                } catch (error) {
                  handleFirestoreError(error, OperationType.UPDATE, 'chatSessions');
                }
              }
            }}
            onSessionDelete={async (sessionId) => {
              if (user) {
                try {
                  await deleteDoc(doc(db, 'users', user.uid, 'chatSessions', sessionId));
                } catch (error) {
                  handleFirestoreError(error, OperationType.DELETE, 'chatSessions');
                }
              }
            }}
            onMessageSent={(text) => {
              updateRiskScore(Math.min(100, Math.max(0, riskScore + (text.length % 5))));
              trackAction(2, 'aiQueries', 'chat');
              addRecentActivity('AI Mentor Chat', 'tool');
            }}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-cyber-card/90 backdrop-blur-xl border-t border-white/10 p-2 flex justify-around items-center z-20">
        <button 
          onClick={() => { setActiveTab('home'); setShowSimulationCenter(false); }}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
            activeTab === 'home' && !showSimulationCenter ? "text-cyber-blue" : "text-white/30"
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button 
          onClick={() => { setActiveTab('learningHub'); setShowSimulationCenter(false); }}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
            activeTab === 'learningHub' && !showSimulationCenter ? "text-cyber-blue" : "text-white/30"
          )}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Learning Hub</span>
        </button>
        <button 
          onClick={() => { setActiveTab('tools'); setShowSimulationCenter(false); }}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
            activeTab === 'tools' && !showSimulationCenter ? "text-cyber-blue" : "text-white/30"
          )}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Tools</span>
        </button>
        <button 
          onClick={() => { setActiveTab('profile'); setShowSimulationCenter(false); }}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
            activeTab === 'profile' && !showSimulationCenter ? "text-cyber-blue" : "text-white/30"
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
      </nav>
    </div>
  );
}
