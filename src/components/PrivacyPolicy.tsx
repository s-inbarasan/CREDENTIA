import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-cyber-card border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-blue/20 rounded-lg text-cyber-blue">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Privacy Policy</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-sm text-white/70 leading-relaxed custom-scrollbar">
              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyber-blue" />
                  1. Information We Collect
                </h3>
                <p>
                  At Credentia, we prioritize your security. We collect minimal information including your name, 
                  email address, and learning progress to provide a personalized educational experience. 
                  Any data you provide during interactive exercises (like password testing) is processed 
                  locally or securely and is not stored permanently in a way that risks your actual real-world security.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyber-blue" />
                  2. How We Use Your Data
                </h3>
                <p>
                  Your data is used solely to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Maintain your learning progress and achievement badges.</li>
                  <li>Provide personalized guidance through the AI Mentor.</li>
                  <li>Improve our educational content and user experience.</li>
                </ul>
                <p>
                  We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyber-blue" />
                  3. Tracking & Cookies
                </h3>
                <p>
                  We use essential session tokens to keep you logged in. For analytics, we use localized, 
                  privacy-respecting methods to understand how users interact with our training modules.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyber-blue" />
                  4. Security
                </h3>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal 
                  information. Your data is stored behind secured networks and is only accessible by 
                  a limited number of persons who have special access rights to such systems.
                </p>
              </section>

              <section className="pt-4 border-t border-white/5 text-[10px] text-white/40 italic">
                Last Updated: April 18, 2026. Credentia Cybersecurity Platform.
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
