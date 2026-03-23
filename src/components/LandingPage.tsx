import React from 'react';
import { Shield, Zap, Lock, ChevronRight, User } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onLogin: () => void;
  onGuest: () => void;
}

export function LandingPage({ onLogin, onGuest }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-cyber-bg text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyber-blue/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyber-purple/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 max-w-md w-full flex flex-col items-center text-center space-y-8"
      >
        <div className="w-24 h-24 bg-cyber-card border border-white/10 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.15)] mb-4">
          <Shield className="w-12 h-12 text-cyber-blue" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">CREDENTIA</h1>
          <p className="text-white/60 text-lg">Credential-Based Cyber Attack Analysis Platform</p>
        </div>

        <div className="w-full space-y-4 pt-8">
          <button 
            onClick={onLogin}
            className="w-full bg-cyber-blue text-black font-bold py-4 rounded-2xl hover:bg-cyber-blue/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          >
            <Lock className="w-5 h-5" />
            Login / Sign Up
          </button>
          
          <button 
            onClick={onGuest}
            className="w-full bg-cyber-card border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            <User className="w-5 h-5 text-white/50" />
            Continue as Guest
          </button>
        </div>

        <div className="pt-8 text-sm text-white/40 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyber-yellow" />
          Powered by AI
        </div>
      </motion.div>
    </div>
  );
}
