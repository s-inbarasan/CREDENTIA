import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, Eye, FileText, ShieldCheck } from 'lucide-react';

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
                  1. Data Sovereignty & Collection
                </h3>
                <p>
                  CREDENTIA operates on a "Zero-Trust Data Policy." We collect only the essential identifiers required to maintain your security clearance and progression within the platform. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="text-white/90">Identity Data:</span> Cryptographically hashed identifiers derived from your authentication provider.</li>
                  <li><span className="text-white/90">Operational Metatada:</span> Learning Hub progression, simulation results, and achieved credentials (badges).</li>
                  <li><span className="text-white/90">Local Execution Data:</span> Cybersecurity tool inputs (e.g., password strings for analysis) are processed client-side whenever possible and are never used for profiling or external training.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyber-blue" />
                  2. Security Architecture
                </h3>
                <p>
                  Your data is protected by industry-standard AES-256 encryption at rest and TLS 1.3 in transit. Access to educational metrics is restricted to your authenticated session via granular security rules. We do not maintain unencrypted backups of user-provided sensitive strings used in tool simulations.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyber-blue" />
                  3. Non-Disclosure & Third-Party Ethics
                </h3>
                <p>
                  CREDENTIA does not engage in data monetization. Your educational journey is strictly confidential. No data is shared with third-party advertisers or external agencies unless required by explicit legal mandate in the jurisdiction of operation.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyber-blue" />
                  4. Accountability
                </h3>
                <p>
                  Users maintain the right to "Digital Erasure." You may request total decommissioning of your profile and associated metadata through the secure settings interface.
                </p>
              </section>

              <section className="pt-4 border-t border-white/5 text-[10px] text-white/40 italic">
                Document Reference: CRED-SEC-PRIV-2026-v2.1. Authorized for Global Deployment.
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
