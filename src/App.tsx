import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './components/Logo';
import { ImageCropper } from './components/ImageCropper';
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
  Wrench,
  UserCheck,
  ShieldCheck,
  Database,
  FileSearch,
  FileWarning
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Toaster, toast } from 'sonner';
import { Message, RiskState, PasswordAnalysis, PhishingAnalysis, UserDocument, ChatSession } from './types';
import { analyzePassword, analyzePhishing } from './utils/analyzer';
import { getCyberResponse } from './services/geminiService';
import { LearningHub } from './components/LearningHub';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { ChatPanel } from './components/ChatPanel';
import { ThreeBackground } from './components/ThreeBackground';
import { Onboarding } from './components/Onboarding';
import { ExifAnalyzer } from './components/ExifAnalyzer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { BADGE_DEFINITIONS, checkNewBadges } from './utils/badges';
import { supabase } from './supabase';
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
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'learningHub' | 'profile'>('home');
  const [user, setUser] = useState<AppUser | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showBadgeNotification, setShowBadgeNotification] = useState<string | null>(null);
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const [healthCheckResult, setHealthCheckResult] = useState<any>(null);
  const [isRunningHealthCheck, setIsRunningHealthCheck] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState<{ text: string, type: 'login' | 'signup' } | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const hasShownWelcome = React.useRef(false);

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (user && userDoc && !hasShownWelcome.current) {
      hasShownWelcome.current = true;
      const isNew = new Date().getTime() - new Date(userDoc.createdAt).getTime() < 10000;
      setWelcomeMessage({
        text: isNew ? `Profile created successfully, ${userDoc.name}` : `Welcome back, ${userDoc.name}`,
        type: isNew ? 'signup' : 'login'
      });
      
      const timer = setTimeout(() => {
        setWelcomeMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (!user) {
      hasShownWelcome.current = false;
    }
  }, [user, userDoc?.createdAt, userDoc?.name]);

  const handleSaveSettings = async (newPrefs: typeof preferences) => {
    if (user && userDoc) {
      setIsSavingSettings(true);
      try {
        await supabase
          .from('profiles')
          .update({ preferences: newPrefs })
          .eq('id', user.uid);
        setShowSettingsSaved(true);
        setTimeout(() => setShowSettingsSaved(false), 3000);
      } catch (error) {
        console.error('Error saving settings:', error);
      } finally {
        setIsSavingSettings(false);
      }
    }
  };

  const addRecentActivity = async (title: string, type: 'topic' | 'quiz' | 'tool' | 'health') => {
    if (user) {
      const newActivity = {
        title,
        type,
        timestamp: new Date().toISOString(),
        user_id: user.uid
      };
      try {
        await supabase.from('recent_activity').insert(newActivity);
      } catch (error) {
        console.error('Error adding recent activity:', error);
      }
    }
  };

  const handleCompleteTopic = async (topicId: string, xpReward: number) => {
    if (!user || !userDoc) return;
    
    const currentTopics = userDoc.completedTopics || [];
    if (currentTopics.includes(topicId)) return;
    
    const newTopics = [...currentTopics, topicId];
    const newPoints = userDoc.xp + xpReward;
    
    const newStats = {
      ...userDoc.stats,
      topicsCompleted: (userDoc.stats?.topicsCompleted || 0) + 1,
      actionsTaken: (userDoc.stats?.actionsTaken || 0) + 1
    };
    
    const newBadges = checkNewBadges(newStats, userDoc.badges || []);
    
    // Optimistic UI Update
    setUserDoc(prev => prev ? {
      ...prev,
      completedTopics: newTopics,
      xp: newPoints,
      stats: newStats,
      badges: [...(prev.badges || []), ...newBadges]
    } : null);
    
    try {
      addRecentActivity(`Completed: ${topicId.replace(/_/g, ' ')}`, 'topic');
      
      await supabase
        .from('profiles')
        .update({
          completed_topics: newTopics,
          xp: newPoints,
          stats: newStats,
          badges: [...(userDoc.badges || []), ...newBadges]
        })
        .eq('id', user.uid);
      
      if (newBadges.length > 0) {
        setShowBadgeNotification(newBadges[0]);
        setTimeout(() => setShowBadgeNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error completing topic:', error);
    }
  };

  const handlePassQuiz = async (topicId: string, score: number) => {
    if (!user || !userDoc) return;
    
    const currentScores = userDoc.quizScores || {};
    const newScores = { ...currentScores, [topicId]: Math.max(score, currentScores[topicId] || 0) };
    
    const newStats = {
      ...userDoc.stats,
      quizzesPassed: (userDoc.stats?.quizzesPassed || 0) + 1,
      actionsTaken: (userDoc.stats?.actionsTaken || 0) + 1
    };
    
    const newBadges = checkNewBadges(newStats, userDoc.badges || []);
    
    // Optimistic UI Update
    setUserDoc(prev => prev ? {
      ...prev,
      quizScores: newScores,
      stats: newStats,
      badges: [...(prev.badges || []), ...newBadges]
    } : null);
    
    try {
      addRecentActivity(`Passed Quiz: ${topicId.replace(/_/g, ' ')}`, 'quiz');
      
      await supabase
        .from('profiles')
        .update({
          quiz_scores: newScores,
          stats: newStats,
          badges: [...(userDoc.badges || []), ...newBadges]
        })
        .eq('id', user.uid);
      
      if (newBadges.length > 0) {
        setShowBadgeNotification(newBadges[0]);
        setTimeout(() => setShowBadgeNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error passing quiz:', error);
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
  const [showPassword, setShowPassword] = useState(false);
  const [passAnalysis, setPassAnalysis] = useState<PasswordAnalysis | null>(null);
  
  const [phishingInput, setPhishingInput] = useState('');
  const [phishAnalysis, setPhishAnalysis] = useState<PhishingAnalysis | null>(null);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auth & Profile Sync
  useEffect(() => {
    let profileSubscription: any;
    let chatSubscription: any;
    let activitySubscription: any;

    // Strategy for 'Real-Time State Management':
    // We use Supabase Realtime (Postgres Changes) to listen for updates on the 'profiles', 
    // 'chat_sessions', and 'recent_activity' tables. This allows the UI to reflect 
    // database changes automatically and in real-time without a page reload.
    // This is a 'Reactive UI' pattern where the UI is a function of the state, 
    // and the state is kept in sync with the backend via persistent listeners.

    const handleSession = async (session: any) => {
      const supabaseUser = session?.user;
      console.log('App: handleSession triggered', { hasUser: !!supabaseUser, userId: supabaseUser?.id });
      
      // Step 7: Debugging Mode - Log session info
      console.log('DEBUG: handleSession called', {
        userId: supabaseUser?.id,
        sessionToken: session?.access_token?.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Clear state immediately to prevent data mixing
      setUserDoc(null);
      setRecentActivity([]);
      setChatSessions([]);
      
      if (supabaseUser) {
        // Step 7: Debugging Mode - Log fetching intent
        console.log('DEBUG: Fetching data for user:', supabaseUser.id);
        
        const appUser: AppUser = {
          uid: supabaseUser.id,
          email: supabaseUser.email || '',
          displayName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          photoURL: supabaseUser.user_metadata?.avatar_url || ''
        };
        
        setUser(appUser);
        setIsGuest(false);
        
        // Check if profile exists
        try {
          console.log('App: Fetching profile for user:', supabaseUser.id);
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (fetchError) {
            console.log('App: Profile fetch error/result:', fetchError);
            if (fetchError.code === 'PGRST116') {
              console.log('App: Profile not found, needs onboarding');
              setNeedsOnboarding(true);
            } else {
              console.error('App: Unexpected profile fetch error:', fetchError);
            }
          } else if (existingProfile) {
            console.log('App: Profile found, skipping onboarding');
            setNeedsOnboarding(false);
            
            // Fix: Sync profile image from Google if missing in DB
            if (!existingProfile.profile_image && supabaseUser.user_metadata?.avatar_url) {
              console.log('App: Syncing profile image from Google metadata...');
              try {
                await supabase
                  .from('profiles')
                  .update({ profile_image: supabaseUser.user_metadata.avatar_url })
                  .eq('id', supabaseUser.id);
                existingProfile.profile_image = supabaseUser.user_metadata.avatar_url;
              } catch (err) {
                console.error('App: Error syncing profile image:', err);
              }
            }

            const mappedProfile: UserDocument = {
              uid: existingProfile.id,
              name: existingProfile.name,
              email: existingProfile.email,
              xp: existingProfile.xp,
              level: existingProfile.level,
              createdAt: existingProfile.created_at,
              profileImage: existingProfile.profile_image,
              badges: existingProfile.badges,
              completedTopics: existingProfile.completed_topics,
              quizScores: existingProfile.quiz_scores,
              stats: existingProfile.stats,
              riskScore: existingProfile.risk_score,
              preferences: existingProfile.preferences
            };
            setUserDoc(mappedProfile);
            setEditDisplayName(mappedProfile.name);
            setEditPhotoURL(mappedProfile.profileImage || '');
            setRiskScore(mappedProfile.riskScore);
            if (mappedProfile.preferences) {
              setPreferences(mappedProfile.preferences);
            }
          }
        } catch (error) {
          console.error('App: Error in profile sync:', error);
        }

        // Listen to User Document (Realtime)
        if (profileSubscription) profileSubscription.unsubscribe();
        profileSubscription = supabase
          .channel(`public:profiles:${supabaseUser.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${supabaseUser.id}` }, (payload) => {
            const data = payload.new as any;
            if (data) {
              const mappedProfile: UserDocument = {
                uid: data.id,
                name: data.name,
                email: data.email,
                xp: data.xp,
                level: data.level,
                createdAt: data.created_at,
                profileImage: data.profile_image,
                badges: data.badges,
                completedTopics: data.completed_topics,
                quizScores: data.quiz_scores,
                stats: data.stats,
                riskScore: data.risk_score,
                preferences: data.preferences
              };
              setUserDoc(mappedProfile);
              setNeedsOnboarding(false);
            }
          })
          .subscribe();

        // Initial fetch and Listen to Chat Sessions
        const fetchChatSessions = async () => {
          try {
            const { data, error } = await supabase
              .from('chat_sessions')
              .select('*')
              .eq('user_id', supabaseUser.id)
              .order('updated_at', { ascending: false });
            
            if (error) {
              if (error.code === 'PGRST116' || error.message.includes('relation "public.chat_sessions" does not exist')) {
                console.warn('Chat sessions table not found. Please run the SQL script.');
                return;
              }
              throw error;
            }

            if (data) {
              // Automatically delete empty chats (no user messages)
              const emptySessions = data.filter(s => !s.messages.some((m: any) => m.role === 'user'));
              if (emptySessions.length > 0) {
                console.log('App: Cleaning up empty sessions:', emptySessions.length);
                await supabase
                  .from('chat_sessions')
                  .delete()
                  .in('id', emptySessions.map(s => s.id));
              }

              const validSessions = data.filter(s => s.messages.some((m: any) => m.role === 'user'));
              setChatSessions(validSessions.map(s => ({
                id: s.id,
                title: s.title,
                updatedAt: s.updated_at,
                messages: s.messages
              })));
            }
          } catch (err) {
            console.error('Error fetching chat sessions:', err);
          }
        };
        fetchChatSessions();

        if (chatSubscription) chatSubscription.unsubscribe();
        chatSubscription = supabase
          .channel(`public:chat_sessions:${supabaseUser.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions', filter: `user_id=eq.${supabaseUser.id}` }, () => {
            fetchChatSessions();
          })
          .subscribe();

        // Initial fetch and Listen to Recent Activity
        const fetchRecentActivity = async () => {
          try {
            const { data, error } = await supabase
              .from('recent_activity')
              .select('*')
              .eq('user_id', supabaseUser.id)
              .order('timestamp', { ascending: false })
              .limit(5);
            
            if (error) {
              if (error.code === 'PGRST116' || error.message.includes('relation "public.recent_activity" does not exist')) {
                console.warn('Recent activity table not found. Please run the SQL script.');
                return;
              }
              throw error;
            }

            if (data) {
              setRecentActivity(data);
            }
          } catch (err) {
            console.error('Error fetching recent activity:', err);
          }
        };
        fetchRecentActivity();

        if (activitySubscription) activitySubscription.unsubscribe();
        activitySubscription = supabase
          .channel(`public:recent_activity:${supabaseUser.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'recent_activity', filter: `user_id=eq.${supabaseUser.id}` }, () => {
            fetchRecentActivity();
          })
          .subscribe();

      } else {
        console.log('App: No session found, clearing user state');
        setUser(null);
        setUserDoc(null);
        setIsGuest(false); // Show landing page if no session
        setNeedsOnboarding(false);
        setRiskScore(15);
        setRecentActivity([]);
        setChatSessions([]);
        if (profileSubscription) profileSubscription.unsubscribe();
        if (chatSubscription) chatSubscription.unsubscribe();
        if (activitySubscription) activitySubscription.unsubscribe();
      }
      console.log('App: Setting loading to false');
      setLoading(false);
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
      if (profileSubscription) profileSubscription.unsubscribe();
      if (chatSubscription) chatSubscription.unsubscribe();
      if (activitySubscription) activitySubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isTyping]);

  const trackAction = async (pointsToAdd: number, actionType: keyof NonNullable<UserDocument['stats']>, toolName?: string) => {
    if (!user || !userDoc) return;
    
    let newPoints = userDoc.xp + pointsToAdd;
    let newBadges = [...(userDoc.badges || [])];
    
    // Initialize stats if not present
    let stats = userDoc.stats || {
      aiQueries: 0,
      actionsTaken: 0,
      strongPasswords: 0,
      phishingDetected: 0,
      toolsUsed: [],
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
    
    const updatedProfile = { ...userDoc, xp: newPoints, badges: newBadges, stats };
    try {
      await supabase
        .from('profiles')
        .update({
          xp: newPoints,
          badges: newBadges,
          stats: stats
        })
        .eq('id', user.uid);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const updateRiskScore = async (newScore: number) => {
    if (!user || !userDoc) return;
    try {
      await supabase
        .from('profiles')
        .update({ risk_score: newScore })
        .eq('id', user.uid);
    } catch (error) {
      console.error('Error updating risk score:', error);
    }
  };

  const handleLogin = () => {
    console.log('App: handleLogin called, setting showLogin to true');
    setShowLogin(true);
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      
      setUser(null);
      setUserDoc(null);
      setRecentActivity([]);
      setChatSessions([]);
      setIsGuest(false);
      setShowLogin(false);
      setActiveTab('home');
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleResetProgress = async () => {
    if (!user || !userDoc) return;
    
    // Using a simpler check since window.confirm is restricted in iframes
    // In a real app we'd use a custom modal, but for now we'll just proceed
    // or the user can use the settings modal which we'll improve
    
    setIsResetting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          xp: 0,
          badges: [],
          risk_score: 15,
          stats: {
            aiQueries: 0,
            actionsTaken: 0,
            strongPasswords: 0,
            phishingDetected: 0,
            toolsUsed: [],
            topicsCompleted: 0,
            quizzesPassed: 0
          }
        })
        .eq('id', user.uid);
      
      if (error) throw error;
      toast.success("Progress Reset", {
        description: "Your training history has been cleared."
      });
    } catch (error: any) {
      console.error('Error resetting progress:', error);
      toast.error("Reset Failed", {
        description: error.message || "Could not reset progress."
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportData = () => {
    if (!user || !userDoc) return;
    setIsExporting(true);
    try {
      const data = {
        userEmail: userDoc.email,
        userXP: userDoc.xp,
        userStats: userDoc.stats,
        userBadges: userDoc.badges || [],
        completedTopics: userDoc.completedTopics || [],
        quizScores: userDoc.quizScores || {},
        chatSessions: chatSessions,
        riskScore: userDoc.riskScore,
        recentActivity: recentActivity,
        preferences: userDoc.preferences
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
    } finally {
      setIsExporting(false);
    }
  };

  // Profile Image Upload (Base64 resize)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleCropComplete = (croppedImage: string) => {
    setEditPhotoURL(croppedImage);
    setCropImageSrc(null);
  };

  const saveProfile = async () => {
    if (!user || !userDoc) return;
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editDisplayName || userDoc.name,
          profile_image: editPhotoURL || userDoc.profileImage || ''
        })
        .eq('id', user.uid);
      
      if (error) throw error;

      setIsEditingProfile(false);
      toast.success('Profile Updated', {
        description: 'Your agent identity has been updated.'
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Update Failed', {
        description: error.message || 'Could not save profile changes.'
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const [isAnalyzingPassword, setIsAnalyzingPassword] = useState(false);
  const [isAnalyzingPhishing, setIsAnalyzingPhishing] = useState(false);
  const onAnalyzePassword = async () => {
    if (!passwordInput.trim()) {
      toast.error("Input Required", {
        description: "Please enter a password to analyze."
      });
      return;
    }

    setIsAnalyzingPassword(true);
    setPassAnalysis(null);

    // Simulate "honest" scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = analyzePassword(passwordInput);
    setPassAnalysis(result);
    updateRiskScore(Math.min(100, Math.max(0, riskScore + (result.score < 50 ? 10 : -5))));
    
    if (result.score > 80) {
      trackAction(20, 'strongPasswords', 'password');
    } else {
      trackAction(5, 'actionsTaken', 'password');
    }
    addRecentActivity('Password Analyzed', 'tool');
    setIsAnalyzingPassword(false);
  };

  const runHealthCheck = async () => {
    setIsRunningHealthCheck(true);
    setShowHealthCheck(true);
    setHealthCheckResult(null);

    // Simulate deep system scan
    await new Promise(resolve => setTimeout(resolve, 3000));

    let score = 100;
    const recommendations: string[] = [];

    // 1. Check Risk Score
    if (riskScore > 50) {
      score -= 30;
      recommendations.push("Your risk score is high. Review recent activities and tool findings.");
    } else if (riskScore > 20) {
      score -= 15;
      recommendations.push("Moderate risk detected. Complete more security topics to improve.");
    }

    // 2. Check Completed Topics
    const totalTopics = 12; // Estimated total
    const completedTopicsCount = userDoc?.completedTopics?.length || 0;
    const completionRate = (completedTopicsCount / totalTopics) * 100;
    if (completionRate < 30) {
      score -= 20;
      recommendations.push("Complete more learning modules to strengthen your security knowledge.");
    } else if (completionRate < 70) {
      score -= 10;
      recommendations.push("You're halfway through! Finish the remaining topics for full protection.");
    }

    // 3. Check Badges
    const badgesCount = userDoc?.badges?.length || 0;
    if (badgesCount < 3) {
      score -= 10;
      recommendations.push("Earn more badges by using security tools and completing quizzes.");
    }

    // 4. Check Password Strength (Simulated based on stats)
    if ((userDoc?.stats?.strongPasswords || 0) < 3) {
      score -= 15;
      recommendations.push("Use the Password Analyzer to ensure all your accounts have strong passwords.");
    }

    // 5. Check Tool Usage
    if ((userDoc?.stats?.toolsUsed?.length || 0) < 3) {
      score -= 10;
      recommendations.push("Explore all security tools (Phishing, Breach, File) for a complete audit.");
    }

    // 6. Check if email is verified (Supabase)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser && !authUser.email_confirmed_at) {
        score -= 20;
        recommendations.push("Verify your email address to secure your account recovery options.");
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
      // Don't penalize score if we can't check verification
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    let status: 'Secure' | 'Warning' | 'Critical' = 'Secure';
    let message = "Your security posture is excellent. Keep up the good work!";

    if (score < 50) {
      status = 'Critical';
      message = "Multiple security vulnerabilities detected. Immediate action required.";
    } else if (score < 85) {
      status = 'Warning';
      message = "Some security gaps identified. Follow the recommendations below.";
    }

    setHealthCheckResult({
      status,
      score,
      message,
      recommendations,
      timestamp: new Date().toISOString()
    });

    setIsRunningHealthCheck(false);
    addRecentActivity('Security Health Check', 'health');
  };
  const onAnalyzePhishing = async () => {
    if (!phishingInput.trim()) {
      toast.error("Content Required", {
        description: "Please paste a message or link to scan for phishing."
      });
      return;
    }

    setIsAnalyzingPhishing(true);
    setPhishAnalysis(null);

    // Simulate "honest" scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = analyzePhishing(phishingInput);
    setPhishAnalysis(result);
    updateRiskScore(Math.min(100, Math.max(0, riskScore + (result.suspicious ? 15 : -2))));
    
    if (result.suspicious) {
      trackAction(15, 'phishingDetected', 'phishing');
    } else {
      trackAction(5, 'actionsTaken', 'phishing');
    }
    addRecentActivity('Phishing Analyzed', 'tool');
    setIsAnalyzingPhishing(false);
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

  const [isEnteringDashboard, setIsEnteringDashboard] = useState(false);

  useEffect(() => {
    if (user && userDoc && !needsOnboarding && !isEnteringDashboard && !isGuest) {
      // Trigger Hyperspace Jump
      setIsEnteringDashboard(true);
      setTimeout(() => {
        setIsEnteringDashboard(false);
      }, 800);
    }
  }, [user, userDoc, needsOnboarding]);

  console.log('App: Rendering', { loading, hasUser: !!user, needsOnboarding, hasUserDoc: !!userDoc, isEnteringDashboard });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <ThreeBackground isWarping={true} />
        <div className="z-10 flex flex-col items-center gap-8">
          <Logo size="lg" glow />
          <div className="flex flex-col items-center gap-2">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-cyber-blue shadow-[0_0_10px_rgba(0,242,255,0.8)]"
              />
            </div>
            <span className="text-cyber-blue font-black text-[10px] tracking-[0.5em] uppercase animate-pulse">Establishing Secure Link...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isEnteringDashboard ? (
        <motion.div 
          key="entering"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden z-50"
        >
          <ThreeBackground isWarping={false} />
          <Logo size="lg" glow />
        </motion.div>
      ) : user && needsOnboarding ? (
        <motion.div 
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Onboarding 
            user={user} 
            onComplete={(doc) => {
              setUserDoc(doc);
              setNeedsOnboarding(false);
            }} 
          />
        </motion.div>
      ) : showLogin ? (
        <motion.div 
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Login 
            onBack={() => setShowLogin(false)} 
            onSuccess={() => {
              setShowLogin(false);
              setIsGuest(false);
            }} 
          />
        </motion.div>
      ) : !user && !isGuest ? (
        <motion.div 
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onLogin={() => setShowLogin(true)} onGuest={() => setIsGuest(true)} />
        </motion.div>
      ) : (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col h-screen w-full md:max-w-screen-2xl mx-auto bg-cyber-bg text-white overflow-hidden md:border-x border-white/10 shadow-2xl relative"
        >
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
              className={`bg-cyber-card border border-white/10 rounded-3xl p-5 md:p-6 w-full max-w-sm transition-all duration-300 ${cropImageSrc ? 'blur-md scale-95 opacity-40 pointer-events-none' : ''}`}
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
                  disabled={isSavingProfile}
                  className="w-full bg-cyber-blue text-black font-bold py-3 rounded-xl hover:bg-cyber-blue/80 transition-colors disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {cropImageSrc && (
          <ImageCropper
            imageSrc={cropImageSrc}
            onCropComplete={handleCropComplete}
            onCancel={() => setCropImageSrc(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-4 pt-8 md:pt-10 border-b border-white/10 bg-cyber-bg/80 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2 md:gap-3">
            <div 
              onClick={() => setIsEditingProfile(true)}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-cyber-blue/30 cyber-glow bg-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              {userDoc?.profileImage ? (
                <img src={userDoc.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 md:w-5 md:h-5 text-cyber-blue" />
              )}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Logo size="xs" glow className="md:hidden" />
              <Logo size="sm" glow className="hidden md:block" />
              <div>
                <h1 className="text-sm md:text-lg font-bold tracking-tight leading-none truncate max-w-[120px] md:max-w-none">
                  {userDoc?.name || 'CREDENTIA'}
                </h1>
                <p className="text-[8px] md:text-[10px] text-cyber-blue font-semibold uppercase tracking-[0.1em] md:tracking-[0.2em] mt-0.5 md:mt-1">
                  Level {userDoc?.level || 1}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowChatPanel(true)}
              className="p-2 bg-cyber-blue/10 text-cyber-blue rounded-full hover:bg-cyber-blue/20 transition-colors relative"
            >
              <MessageSquare className="w-5 h-5" />
              {/* Notification Badge - Hidden by default as per request */}
              {false && chatSessions.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyber-red rounded-full border-2 border-cyber-bg" />
              )}
            </button>
            {user ? (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                className="p-2 text-cyber-blue hover:text-white transition-colors"
                title="Log In"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6 max-w-5xl mx-auto w-full", "pb-24")}>
        {activeTab === 'home' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Welcome Message Toast */}
            <AnimatePresence>
              {welcomeMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg mb-4",
                    welcomeMessage.type === 'signup' 
                      ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green" 
                      : "bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue"
                  )}
                >
                  {welcomeMessage.type === 'signup' ? <UserCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  <p className="text-sm font-medium">{welcomeMessage.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top Row: Welcome & Profile */}
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold">
                    {user ? "User Dashboard" : "Welcome, Guest"}
                  </h2>
                  {user ? (
                    <div className="flex items-center gap-1 bg-cyber-green/10 border border-cyber-green/30 px-2 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                      <span className="text-[8px] font-bold text-cyber-green uppercase tracking-tighter">Secure</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Guest</span>
                    </div>
                  )}
                </div>
                <p className="text-xs md:text-sm text-white/40">
                  {user ? "Your security profile is synced" : "Login to save your progress"}
                </p>
              </div>
              {user && userDoc && (
                <div className="relative group cursor-pointer" onClick={() => setIsEditingProfile(true)}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-cyber-blue/30 group-hover:border-cyber-blue transition-colors bg-cyber-card flex items-center justify-center">
                    {userDoc.profileImage ? (
                      <img src={userDoc.profileImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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

            {/* Grid for Score and Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security Score */}
              <section className="bg-cyber-card p-5 md:p-6 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-between h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Logo size="xl" className="opacity-20 grayscale" />
                </div>
                <div className="z-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-2">Security Score</h3>
                  <p className="text-[10px] text-white/50 max-w-[150px] md:max-w-[200px] leading-relaxed">
                    Based on your learning progress, quiz scores, and tool usage.
                  </p>
                </div>
                <div className="z-10 scale-90 md:scale-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={riskScore}
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                      <RiskMeter score={100 - riskScore} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>

              {/* Learning Progress Summary */}
              <section className="bg-gradient-to-r from-cyber-card to-cyber-bg p-5 rounded-3xl border border-cyber-blue/20 flex items-center justify-between h-full">
                <div>
                  <p className="text-[10px] uppercase text-cyber-blue font-bold tracking-wider mb-1">Learning Progress</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">{userDoc?.completedTopics?.filter(id => id.startsWith('module-') || /^[BIA]-M\d+$/.test(id)).length || 0}</span>
                    <span className="text-xs text-white/50 mb-1">/ 20 Modules</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-cyber-yellow font-bold tracking-wider mb-1">Cyber XP</p>
                    <div className="flex items-end gap-1 justify-end">
                      <span className="text-xl font-bold">{userDoc?.xp || 0}</span>
                      <span className="text-xs text-white/50 mb-1">pts</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Quick Access Cards */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 px-2">Quick Access</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('learningHub')}
                  className="bg-cyber-card p-4 md:p-5 rounded-3xl border border-white/5 hover:border-cyber-blue/50 transition-all flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-3 group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-cyber-blue" />
                  </div>
                  <span className="text-sm font-bold">Learning Hub</span>
                </button>
                <button 
                  onClick={() => setActiveTab('tools')}
                  className="bg-cyber-card p-4 md:p-5 rounded-3xl border border-white/5 hover:border-cyber-purple/50 transition-all flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-3 group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyber-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Wrench className="w-5 h-5 md:w-6 md:h-6 text-cyber-purple" />
                  </div>
                  <span className="text-sm font-bold">Security Tools</span>
                </button>
              </div>
            </section>

            {/* Security Health Check Banner */}
            <section className="bg-gradient-to-r from-cyber-blue/20 to-cyber-card p-6 rounded-3xl border border-cyber-blue/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500">
                <ShieldCheck className="w-24 h-24 text-cyber-blue" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-cyber-blue" />
                  Security Health Check
                </h2>
                <p className="text-sm text-white/70 mb-4 max-w-[80%]">Perform a comprehensive check of your digital security posture and get personalized recommendations.</p>
                <button 
                  onClick={runHealthCheck}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-blue text-black font-bold rounded-xl text-sm hover:bg-cyber-blue/80 transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" /> Run Health Check
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 px-2">Recent Activity</h3>
              <div className="bg-cyber-card rounded-3xl border border-white/5 overflow-hidden">
                <AnimatePresence initial={false}>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <motion.div 
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={cn("p-4 flex items-center gap-3", index !== recentActivity.length - 1 && "border-b border-white/5")}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          activity.type === 'topic' ? "bg-cyber-yellow/10 text-cyber-yellow" :
                          activity.type === 'quiz' ? "bg-cyber-green/10 text-cyber-green" :
                          activity.type === 'health' ? "bg-cyber-blue/10 text-cyber-blue" :
                          "bg-cyber-purple/10 text-cyber-purple"
                        )}>
                          {activity.type === 'topic' ? <BookOpen className="w-4 h-4" /> :
                           activity.type === 'quiz' ? <Award className="w-4 h-4" /> :
                           activity.type === 'health' ? <ShieldCheck className="w-4 h-4" /> :
                           <Wrench className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-white/40">
                            {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 text-center text-white/50 text-sm"
                    >
                      No recent activity. Start learning to earn XP!
                    </motion.div>
                  )}
                </AnimatePresence>
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

            {/* Analyzers */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Analyzer */}
              <div className="bg-cyber-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                {/* Points indicator */}
                <div className="absolute top-4 right-4 text-[10px] text-cyber-blue font-bold flex items-center gap-1 bg-cyber-blue/10 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" /> +XP
                </div>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyber-blue" />
                  Password Analyzer
                </h3>
                <div className="relative flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password to test..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-cyber-blue/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button 
                    onClick={onAnalyzePassword}
                    disabled={isAnalyzingPassword}
                    className="bg-cyber-blue text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-cyber-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAnalyzingPassword ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Scanning...
                      </>
                    ) : 'Test'}
                  </button>
                </div>
                {passAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Strength:</span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          passAnalysis.strength === 'Strong' ? "text-cyber-green bg-cyber-green/10" :
                          passAnalysis.strength === 'Medium' ? "text-cyber-yellow bg-cyber-yellow/10" : "text-cyber-red bg-cyber-red/10"
                        )}>{passAnalysis.strength}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-40">SCORE: {passAnalysis.score}/100</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${passAnalysis.score}%` }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className={cn(
                          "h-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                          passAnalysis.score > 80 ? "bg-cyber-green shadow-cyber-green/20" :
                          passAnalysis.score > 40 ? "bg-cyber-yellow shadow-cyber-yellow/20" : "bg-cyber-red shadow-cyber-red/20"
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 italic bg-black/20 p-2 rounded-lg border border-white/5">
                      <Zap className="w-3 h-3 text-cyber-yellow" />
                      Estimated crack time: <span className="text-white/70 font-bold ml-1">{passAnalysis.crackTime}</span>
                    </div>
                    {passAnalysis.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-white/30 ml-1">Security Suggestions</p>
                        <ul className="text-[10px] space-y-1.5">
                          {passAnalysis.suggestions.map((s, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ x: -5, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-cyber-yellow/70"
                            >
                              <ChevronRight className="w-3 h-3 mt-0.5 text-cyber-yellow" /> 
                              {s}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
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
                  disabled={isAnalyzingPhishing}
                  className="w-full bg-cyber-yellow text-black font-bold py-2 rounded-xl text-sm hover:bg-cyber-yellow/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzingPhishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Deeply...
                    </>
                  ) : 'Scan Content'}
                </button>
                {phishAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="mt-4 space-y-3"
                  >
                    {/* Warning Banner for High/Medium Risk */}
                    {(phishAnalysis.riskLevel === 'High' || phishAnalysis.riskLevel === 'Medium') && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "p-3 rounded-xl border flex items-center gap-3 animate-pulse",
                          phishAnalysis.riskLevel === 'High' 
                            ? "bg-cyber-red/10 border-cyber-red/30 text-cyber-red" 
                            : "bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow"
                        )}
                      >
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        <div className="text-[10px] font-bold leading-tight">
                          {phishAnalysis.riskLevel === 'High' 
                            ? "CRITICAL THREAT DETECTED: This link is highly likely to be a phishing attempt." 
                            : "SUSPICIOUS ACTIVITY: Exercise extreme caution before interacting with this link."}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        {phishAnalysis.riskLevel === 'High' ? (
                          <XCircle className="w-5 h-5 text-cyber-red" />
                        ) : phishAnalysis.riskLevel === 'Medium' ? (
                          <AlertTriangle className="w-5 h-5 text-cyber-yellow" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                        )}
                        <span className={cn(
                          "text-sm font-bold",
                          phishAnalysis.riskLevel === 'High' ? "text-cyber-red" : 
                          phishAnalysis.riskLevel === 'Medium' ? "text-cyber-yellow" : "text-cyber-green"
                        )}>
                          Risk: {phishAnalysis.riskLevel}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono opacity-40">
                        SCAN_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase text-white/30 ml-1">Analysis Findings</p>
                      {phishAnalysis.reasons.length > 0 ? (
                        <div className="space-y-1">
                          {phishAnalysis.reasons.map((r, i) => (
                            <motion.div 
                              key={i}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/10 flex items-start gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-cyber-red mt-1.5 shrink-0" />
                              {r}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-cyber-green bg-cyber-green/5 p-2 rounded-lg border border-cyber-green/10">
                          No significant phishing indicators found in the provided content.
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase text-white/30 mb-2 ml-1">Prevention Tips</p>
                      <ul className="text-[10px] space-y-1.5">
                        {phishAnalysis.tips.map((t, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="flex items-start gap-2 text-cyber-blue/70"
                          >
                            <ChevronRight className="w-3 h-3 mt-0.5 text-cyber-blue" /> 
                            {t}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* EXIF Metadata Analyzer */}
              <div className="md:col-span-2">
                <ExifAnalyzer />
              </div>
            </section>
            
            <div className="text-[10px] text-center text-white/20 pb-4 flex flex-col items-center gap-2">
              <span>CREDENTIA Cyber AI Mentor • For educational purposes only</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-cyber-blue transition-colors underline underline-offset-2"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => setShowTermsOfService(true)}
                  className="hover:text-cyber-blue transition-colors underline underline-offset-2"
                >
                  Terms of Service
                </button>
              </div>
            </div>

            <PrivacyPolicy 
              isOpen={showPrivacyPolicy} 
              onClose={() => setShowPrivacyPolicy(false)} 
            />
            <TermsOfService 
              isOpen={showTermsOfService} 
              onClose={() => setShowTermsOfService(false)} 
            />
          </motion.div>
        ) : activeTab === 'learningHub' ? (
          <LearningHub 
            userDoc={userDoc} 
            onCompleteTopic={handleCompleteTopic}
            onPassQuiz={handlePassQuiz}
            onQuizStateChange={setIsQuizActive}
          />
        ) : activeTab === 'profile' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-20"
          >
            {!user || !userDoc ? (
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
                      {userDoc?.profileImage ? (
                        <img src={userDoc.profileImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-12 h-12 text-white/30" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-cyber-blue text-black p-2 rounded-full z-20 shadow-lg">
                      <Edit2 className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-4">{userDoc?.name || 'User'}</h2>
                  <p className="text-sm text-cyber-blue font-bold uppercase tracking-widest mt-1">
                    {(() => {
                      const xp = userDoc?.xp || 0;
                      if (xp > 1000) return 'Master';
                      if (xp > 500) return 'Expert';
                      if (xp > 100) return 'Intermediate';
                      return 'Cyber Recruit';
                    })()}
                  </p>
                  
                  <div className="flex gap-6 mt-6 w-full justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userDoc?.xp || 0}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">Total XP</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {(() => {
                          const xp = userDoc?.xp || 0;
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
                      <p className="text-2xl font-bold">{userDoc?.badges?.length || 0}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">Badges</p>
                    </div>
                  </div>
                </section>

                {/* Middle Section: Badges */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 px-2">Badges Earned</h3>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                    {BADGE_DEFINITIONS.map((badge) => {
                      const isUnlocked = userDoc?.badges?.includes(badge.id);
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
                            "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mb-2 border-2",
                            badge.shapeClass,
                            isUnlocked ? badge.colorClass : "bg-black/50 border-white/10 text-white/30"
                          )}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <h3 className="text-[9px] md:text-[10px] font-bold leading-tight">{badge.name}</h3>
                        </div>
                      );
                    })}
                  </div>
                </section>
                
                <div className="pt-4">
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
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
        isExporting={isExporting}
        isResetting={isResetting}
        isSavingSettings={isSavingSettings}
      />

      {/* Floating AI Mentor Button */}
      {!isQuizActive && (
        <button
          onClick={() => setShowChatPanel(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-cyber-blue/20 border border-cyber-blue/50 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-30 overflow-hidden"
        >
          <Logo size="sm" variant="ai" glow />
        </button>
      )}

      {/* Chat Panel Overlay */}
      <AnimatePresence>
        {showChatPanel && (
          <ChatPanel
            isOpen={showChatPanel}
            onClose={() => setShowChatPanel(false)}
            userUid={user?.uid}
            chatSessions={chatSessions}
            onSessionUpdate={async (session) => {
              console.log('App: onSessionUpdate called for session:', session.id, 'Title:', session.title);
              
              // Optimistic update
              setChatSessions(prev => {
                const index = prev.findIndex(s => s.id === session.id);
                if (index >= 0) {
                  const updated = [...prev];
                  updated[index] = session;
                  const sorted = updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                  console.log('App: Updated existing session in state');
                  return sorted;
                }
                console.log('App: Added new session to state');
                return [session, ...prev];
              });

              if (user) {
                try {
                  // ONLY SAVE IF THERE IS USER INTERACTION (at least one user message)
                  const hasUserMessage = session.messages.some(m => m.role === 'user');
                  
                  if (!hasUserMessage) {
                    console.log('App: Session is empty (no user messages), skipping database save');
                    return;
                  }

                  console.log('App: Upserting session to Supabase...', session.id);
                  const { error } = await supabase
                    .from('chat_sessions')
                    .upsert({
                      id: session.id,
                      user_id: user.uid,
                      title: session.title,
                      updated_at: session.updatedAt,
                      messages: session.messages
                    });
                  
                  if (error) {
                    console.error('App: Supabase upsert error:', error);
                    toast.error('Failed to save chat: ' + error.message);
                  } else {
                    console.log('App: Session upserted successfully');
                  }
                } catch (error) {
                  console.error('App: Error updating chat session:', error);
                  toast.error('An unexpected error occurred while saving chat');
                }
              } else {
                console.warn('App: No user found, session not saved to database');
              }
            }}
            onSessionDelete={async (sessionId) => {
              // Optimistic update
              setChatSessions(prev => prev.filter(s => s.id !== sessionId));

              if (user) {
                try {
                  await supabase
                    .from('chat_sessions')
                    .delete()
                    .eq('id', sessionId)
                    .eq('user_id', user.uid); // Ensure only user's own chats are deleted
                } catch (error) {
                  console.error('Error deleting chat session:', error);
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
      <nav className="fixed bottom-0 left-0 right-0 w-full md:max-w-screen-2xl mx-auto bg-cyber-card/90 backdrop-blur-xl border-t border-white/10 p-2 z-20">
        <div className="max-w-3xl mx-auto flex justify-around items-center w-full">
          <button 
            onClick={() => { setActiveTab('home'); }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              activeTab === 'home' ? "text-cyber-blue" : "text-white/30"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </button>
          <button 
            onClick={() => { setActiveTab('learningHub'); }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              activeTab === 'learningHub' ? "text-cyber-blue" : "text-white/30"
            )}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Learning Hub</span>
          </button>
          <button 
            onClick={() => { setActiveTab('tools'); }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              activeTab === 'tools' ? "text-cyber-blue" : "text-white/30"
            )}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Tools</span>
          </button>
          <button 
            onClick={() => { setActiveTab('profile'); }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              activeTab === 'profile' ? "text-cyber-blue" : "text-white/30"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Profile</span>
          </button>
        </div>
      </nav>

      {/* Health Check Modal */}
      <AnimatePresence>
        {showHealthCheck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-cyber-card border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-cyber-blue" />
                  <h3 className="text-xl font-bold">Security Health Check</h3>
                </div>
                <button onClick={() => setShowHealthCheck(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isRunningHealthCheck ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="mb-6"
                  >
                    <ShieldCheck className="w-20 h-20 text-cyber-blue" />
                  </motion.div>
                  <p className="text-cyber-blue font-bold animate-pulse mb-4">Scanning System Integrity...</p>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-cyber-blue h-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                  </div>
                </div>
              ) : (
                healthCheckResult && (
                  <div className="space-y-6">
                  <div className={cn(
                    "p-4 rounded-2xl border flex items-center gap-4",
                    healthCheckResult.status === 'Secure' ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green" :
                    healthCheckResult.status === 'Critical' ? "bg-cyber-red/10 border-cyber-red/30 text-cyber-red" :
                    "bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow"
                  )}>
                    <div className="p-3 rounded-full bg-black/20">
                      {healthCheckResult.status === 'Secure' ? <CheckCircle2 className="w-8 h-8" /> :
                       healthCheckResult.status === 'Critical' ? <XCircle className="w-8 h-8" /> :
                       <AlertTriangle className="w-8 h-8" />}
                    </div>
                    <div>
                      <p className="text-lg font-bold">{healthCheckResult.status} Status</p>
                      <p className="text-xs opacity-80 leading-relaxed">{healthCheckResult.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase text-white/30 font-bold mb-1">Security Score</p>
                      <p className="text-2xl font-bold text-cyber-blue">{healthCheckResult.score}%</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase text-white/30 font-bold mb-1">Scan Date</p>
                      <p className="text-xs font-mono text-white/50">{new Date(healthCheckResult.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/30 ml-1">Recommendations</p>
                    <div className="space-y-2">
                      {healthCheckResult.recommendations.map((rec: string, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue mt-1.5 shrink-0" />
                          <p className="text-xs text-white/70">{rec}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowHealthCheck(false)}
                    className="w-full bg-cyber-blue text-black font-bold py-3 rounded-xl hover:bg-cyber-blue/80 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cyber-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-cyber-red">
                <LogOut className="w-6 h-6" />
                <h3 className="text-xl font-bold">Confirm Logout</h3>
              </div>
              <p className="text-white/70 mb-6">
                Are you sure you want to log out? Your session will be ended.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowLogoutConfirm(false);
                  }}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 rounded-xl bg-cyber-red text-white font-bold hover:bg-cyber-red/80 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? 'Logging Out...' : 'Log Out'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toaster position="top-center" richColors theme="dark" />
    </motion.div>
    )}
    </AnimatePresence>
  );
}
