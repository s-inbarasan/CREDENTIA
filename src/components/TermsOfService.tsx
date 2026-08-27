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
                  1. Agreement Scope
                </h3>
                <p>
                  By authenticating with the CREDENTIA platform, you enter into a binding legal agreement. This platform is a simulated cybersecurity environment provided strictly for "White Hat" educational development and defensive research.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyber-blue" />
                  2. Rules of Engagement (ROE)
                </h3>
                <p>
                  Usage of the learning modules and analytical tools is governed by the following ROE:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="text-white/90">Zero Malice:</span> You shall not utilize knowledge, scripts, or methodologies acquired here to engage in unauthorized access to any system, network, or data you do not explicitly own.</li>
                  <li><span className="text-white/90">Non-Automation:</span> You shall not deploy automated scrapers or stress-testing scripts against CREDENTIA infrastructure.</li>
                  <li><span className="text-white/90">Identity Integrity:</span> You are responsible for all actions occurring under your authenticated credentials.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-cyber-blue" />
                  3. Disclaimer of Liability
                </h3>
                <p>
                  CREDENTIA provides educational simulations. We are NOT responsible for the application of these skills in real-world scenarios. We provide no guarantee of professional certification or employment outcome. All "Security Scores" and "Analyses" are for training evaluation only.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyber-blue" />
                  4. Termination of Access
                </h3>
                <p>
                  Violation of the ROE or detection of behavior inconsistent with ethical cybersecurity practices will result in immediate session termination and permanent revocation of your security clearance.
                </p>
              </section>

              <section className="pt-4 border-t border-white/5 text-[10px] text-white/40 italic">
                Regulatory Reference: CRED-SEC-TOS-2026. Non-Negotiable Terms.
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
