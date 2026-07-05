import { useState, useCallback, useEffect, useRef } from 'react';

const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const onVoicesChanged = () => {
      const refreshedVoices = window.speechSynthesis.getVoices();
      if (refreshedVoices.length > 0) {
        window.speechSynthesis.onvoiceschanged = null;
        resolve(refreshedVoices);
      }
    };
    window.speechSynthesis.onvoiceschanged = onVoicesChanged;
    // Timeout fallback
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
};

export const useNarrator = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const setMuted = (muted: boolean) => {
    mutedRef.current = muted;
    if (muted && isSupported) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null; // Detach before canceling
      }
      window.speechSynthesis.cancel();
      // We don't trigger the onEnd callback because we want to stay on this line
    }
  }

  const speak = useCallback(async (text: string, character: string, onEnd?: () => void) => {
    if (!isSupported) {
      setTimeout(() => onEnd?.(), Math.max(text.length * 50, 1000));
      return;
    }

    window.speechSynthesis.cancel();
    
    // If muted, we stay on the line but don't speak. 
    // We only advance if the user clicks Next or if we want auto-advance with a fixed timer.
    // In "Muted" mode, let's just wait a bit based on text length.
    if (mutedRef.current) {
      setIsSpeaking(true);
      const readingTime = Math.max(text.length * 60, 2000);
      const timer = setTimeout(() => {
        setIsSpeaking(false);
        onEnd?.();
      }, readingTime);
      return () => clearTimeout(timer);
    }

    const voices = await getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    let pitch = 1.0;
    let rate = 1.0;
    let selectedVoice: SpeechSynthesisVoice | null = null;

    const findVoice = (priorities: string[], gender?: 'male' | 'female') => {
      // 1. Try exact name match
      let v = voices.find(v => priorities.some(p => v.name.includes(p)));
      if (v) return v;
      
      // 2. Try gender match (some browsers have this in voice object)
      if (gender) {
        v = voices.find(v => (v as any).gender === gender || v.name.toLowerCase().includes(gender));
        if (v) return v;
      }
      return null;
    };

    if (character === 'leo') {
      selectedVoice = findVoice(['Daniel', 'David', 'James', 'Google UK English Male', 'Microsoft David'], 'male') || voices[0];
      pitch = 0.85;
      rate = 0.88;
    } else if (character === 'sarah') {
      selectedVoice = findVoice(['Samantha', 'Karen', 'Google US English', 'Microsoft Zira', 'Victoria'], 'female') || voices[Math.min(1, voices.length - 1)];
      pitch = 1.15;
      rate = 0.92;
    } else if (character === 'alex') {
      selectedVoice = findVoice(['Alex', 'Google UK English Male', 'Arthur', 'Aaron'], 'male') || voices[Math.min(2, voices.length - 1)];
      pitch = 1.0;
      rate = 0.95;
    }

    utterance.voice = selectedVoice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1;

    console.log(`[Narrator] ${character}: using voice "${selectedVoice?.name}" pitch=${pitch} rate=${rate}`);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = (e) => {
      console.error('TTS error', e);
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  return { speak, stop: useCallback(() => window.speechSynthesis.cancel(), []), isSpeaking, isSupported, setMuted, isMuted: mutedRef.current };
};
