import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, ScrollText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
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
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Terms of Service</h2>
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
                  <ScrollText className="w-4 h-4 text-cyber-blue" />
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing or using Credentia, you agree to be bound by these Terms of Service. 
                  This platform is designed for educational purposes in the field of cybersecurity. 
                  Unauthorized use of this platform to attempt to gain access to systems you do not own 
                  is strictly prohibited.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyber-blue" />
                  2. Ethical Usage Policy
                </h3>
                <p>
                  As a user of Credentia, you pledge to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use the knowledge gained for defensive and educational purposes only.</li>
                  <li>Never use tools or techniques learned here for illegal activities.</li>
                  <li>Respect the privacy and security of other users and third parties.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyber-blue" />
                  3. Intellectual Property
                </h3>
                <p>
                  All content provided on Credentia, including lessons, interactive labs, and the AI Mentor 
                  responses, is the intellectual property of Credentia. You may use this content for 
                  personal, non-commercial learning only.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <X className="w-4 h-4 text-cyber-blue" />
                  4. Limitation of Liability
                </h3>
                <p>
                  Credentia is provided "as is" without any warranties. We are not liable for any 
                  actions taken by users outside of the platform or for any security breaches 
                  that occur on a user's personal accounts.
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
