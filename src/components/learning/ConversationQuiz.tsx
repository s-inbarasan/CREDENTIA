import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, ChevronRight, Trophy } from 'lucide-react';
import { QuizQuestion } from '../../types';
import { cn } from '../../utils/cn';

interface ConversationQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export const ConversationQuiz: React.FC<ConversationQuizProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(idx);
    const correct = idx === currentQ.correctAnswerIndex;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="fixed inset-0 z-[300] bg-[#050810] flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-24 h-24 rounded-full bg-cyber-purple/20 border-2 border-cyber-purple flex items-center justify-center mx-auto mb-8">
            <Trophy className="w-12 h-12 text-cyber-purple" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Quiz Complete</h2>
          <p className="text-white/60 mb-8 tracking-widest uppercase">Your Score: {finalScore}%</p>
          
          <button 
            onClick={() => onComplete(finalScore)}
            className="w-full py-4 bg-cyber-purple text-white font-bold rounded-xl text-lg hover:bg-cyber-purple/90 transition-colors uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            Claim Rewards & Exit
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-[#050810] flex flex-col">
      {/* Quiz Progress */}
      <div className="p-6 flex justify-center gap-2">
        {questions.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === currentIndex ? "w-8 bg-cyber-blue" : 
              i < currentIndex ? "w-8 bg-white/20" : "w-2 bg-white/10"
            )}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl w-full"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isActualCorrect = currentQ.correctAnswerIndex === idx;
                
                let btnStyle = "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20";
                
                if (selectedAnswer !== null) {
                  if (isSelected && isCorrect) btnStyle = "bg-cyber-green/20 border-cyber-green text-cyber-green";
                  else if (isSelected && !isCorrect) btnStyle = "bg-red-500/20 border-red-500 text-red-500";
                  else if (isActualCorrect) btnStyle = "bg-cyber-green/10 border-cyber-green/50 text-cyber-green/80";
                  else btnStyle = "bg-white/5 border-white/5 text-white/30";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 text-lg sm:text-xl font-medium flex items-center justify-between",
                      btnStyle
                    )}
                  >
                    <span>{opt}</span>
                    {selectedAnswer !== null && isSelected && isCorrect && <CheckCircle className="w-6 h-6 shrink-0" />}
                    {selectedAnswer !== null && isSelected && !isCorrect && <XCircle className="w-6 h-6 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-2xl bg-black border border-white/10 border-l-4 border-l-cyber-blue shadow-2xl relative"
              >
                <div className="text-[10px] text-cyber-blue font-bold uppercase tracking-widest mb-2">Explanation</div>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">{currentQ.explanation}</p>
                <button 
                  onClick={handleNext}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-sm"
                >
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'} <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
