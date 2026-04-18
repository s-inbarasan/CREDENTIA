import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Contrast, Bell, Volume2, Vibrate, Download, AlertTriangle, ShieldCheck, FileText, Save } from 'lucide-react';

import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
  preferences: {
    darkMode: boolean;
    highContrast: boolean;
    notifications: boolean;
    soundEffects: boolean;
    hapticFeedback: boolean;
  };
  onSavePreferences: (prefs: any) => void;
  onExportData: () => void;
  isExporting: boolean;
  isResetting: boolean;
  isSavingSettings: boolean;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  onResetProgress, 
  preferences, 
  onSavePreferences, 
  onExportData, 
  isExporting, 
  isResetting, 
  isSavingSettings
}: SettingsModalProps) {
  const [darkMode, setDarkMode] = useState(preferences.darkMode);
  const [highContrast, setHighContrast] = useState(preferences.highContrast);
  const [notifications, setNotifications] = useState(preferences.notifications);
  const [soundEffects, setSoundEffects] = useState(preferences.soundEffects);
  const [hapticFeedback, setHapticFeedback] = useState(preferences.hapticFeedback);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    setDarkMode(preferences.darkMode);
    setHighContrast(preferences.highContrast);
    setNotifications(preferences.notifications);
    setSoundEffects(preferences.soundEffects);
    setHapticFeedback(preferences.hapticFeedback);
  }, [preferences, isOpen]);

  const isDirty = 
    Boolean(darkMode) !== Boolean(preferences.darkMode) ||
    Boolean(highContrast) !== Boolean(preferences.highContrast) ||
    Boolean(notifications) !== Boolean(preferences.notifications) ||
    Boolean(soundEffects) !== Boolean(preferences.soundEffects) ||
    Boolean(hapticFeedback) !== Boolean(preferences.hapticFeedback);

  const handleSave = () => {
    if (!isDirty) return;
    onSavePreferences({
      ...preferences,
      darkMode,
      highContrast,
      notifications,
      soundEffects,
      hapticFeedback
    });
    onClose();
  };

  const handleCancelClick = () => {
    onClose();
  }

  const handleExportData = () => {
    onExportData();
  };

  const handleResetConfirm = () => {
    onResetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-cyber-card border-t border-white/10 rounded-t-3xl p-6 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button 
                onClick={handleCancelClick} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Appearance */}
              <section>
                <h3 className="text-sm font-bold text-cyber-blue uppercase tracking-wider mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-white/70" />
                      <span>Dark Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-blue"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Contrast className="w-5 h-5 text-white/70" />
                      <span>High Contrast Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-blue"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Preferences */}
              <section>
                <h3 className="text-sm font-bold text-cyber-blue uppercase tracking-wider mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-white/70" />
                      <span>Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-blue"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-white/70" />
                      <span>Sound Effects</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={soundEffects} onChange={(e) => setSoundEffects(e.target.checked)} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-blue"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Vibrate className="w-5 h-5 text-white/70" />
                      <span>Haptic Feedback</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={hapticFeedback} onChange={(e) => setHapticFeedback(e.target.checked)} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-blue"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Data Export */}
              <section>
                <h3 className="text-sm font-bold text-cyber-blue uppercase tracking-wider mb-4">Your Data</h3>
                <button 
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-colors border border-white/10 disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  {isExporting ? 'Exporting...' : 'Export My Data'}
                </button>
              </section>

              {/* Legal & Agreements */}
              <section>
                <h3 className="text-sm font-bold text-cyber-purple uppercase tracking-wider mb-4">Legal & Agreements</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsPrivacyOpen(true)}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl transition-colors border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-cyber-purple" />
                      <span className="font-medium">Privacy Policy</span>
                    </div>
                    <span className="text-xs text-white/40 uppercase tracking-widest">Review</span>
                  </button>
                  <button 
                    onClick={() => setIsTermsOpen(true)}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl transition-colors border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-cyber-blue" />
                      <span className="font-medium">Terms of Service</span>
                    </div>
                    <span className="text-xs text-white/40 uppercase tracking-widest">Review</span>
                  </button>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="pt-4 border-t border-white/10">
                <button 
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-3 rounded-xl transition-colors border border-red-500/20"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Reset Progress
                </button>
              </section>
            </div>
            
            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-white/10 sticky bottom-0 bg-cyber-card z-20 pb-4">
              <button 
                onClick={handleSave}
                disabled={!isDirty || isSavingSettings}
                className="w-full flex items-center justify-center gap-2 bg-cyber-blue text-black font-bold py-4 rounded-xl hover:bg-cyber-blue/80 transition-all disabled:opacity-30 disabled:bg-white/10 disabled:text-white disabled:cursor-not-allowed"
              >
                {isSavingSettings ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSavingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </motion.div>
          
          <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
          <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

          {/* Reset Confirmation Modal */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
                <div className="bg-cyber-card border border-red-500/30 p-6 rounded-2xl max-w-sm w-full relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Reset Progress?</h3>
                  <p className="text-white/70 text-center mb-6 text-sm">
                    Are you sure you want to clear all your badges and XP? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleResetConfirm}
                      disabled={isResetting}
                      className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-bold disabled:opacity-50"
                    >
                      {isResetting ? 'Resetting...' : 'Yes, Reset'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
