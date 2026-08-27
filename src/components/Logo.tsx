import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  variant?: 'main' | 'ai';
}

const AILogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Glowing Shield */}
    <path d="M50 10L20 22V45C20 65 32 82 50 90C68 82 80 65 80 45V22L50 10Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    
    {/* Inner Cyber Core */}
    <path d="M50 25L35 32V50C35 62 41 72 50 78C59 72 65 62 65 50V32L50 25Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.6"/>
    
    {/* Neural Nodes */}
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    <circle cx="35" cy="40" r="3" fill="currentColor" />
    <circle cx="65" cy="40" r="3" fill="currentColor" />
    <circle cx="50" cy="25" r="3" fill="currentColor" />
    <circle cx="50" cy="78" r="3" fill="currentColor" />
    
    {/* Connections */}
    <path d="M50 44V28" stroke="currentColor" strokeWidth="2" />
    <path d="M45 47L37 42" stroke="currentColor" strokeWidth="2" />
    <path d="M55 47L63 42" stroke="currentColor" strokeWidth="2" />
    <path d="M50 56V75" stroke="currentColor" strokeWidth="2" />
    
    {/* Data Rings */}
    <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
  </svg>
);

export function Logo({ className, size = 'md', glow = false, variant = 'main' }: LogoProps) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const images = {
    main: "https://i.ibb.co/3Y8tPyym/IMG-20260327-095240.png"
  };

  // Simple fade-in sequence
  const bootVariants = {
    initial: { opacity: 0, scale: 0.95 },
    boot: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  // Neural Pulse animation for the glow
  const pulseTransition = {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const
  };

  return (
    <motion.div
      variants={bootVariants}
      initial="initial"
      animate="boot"
      className={cn('flex items-center justify-center p-1', className)}
    >
      {variant === 'ai' ? (
        <motion.div
          animate={glow ? {
            filter: [
              'drop-shadow(0 0 8px rgba(0, 242, 255, 0.4))',
              'drop-shadow(0 0 20px rgba(0, 242, 255, 0.8))',
              'drop-shadow(0 0 8px rgba(0, 242, 255, 0.4))'
            ]
          } : {}}
          transition={glow ? pulseTransition : {}}
          className={cn(
            'text-cyber-blue',
            sizeClasses[size]
          )}
        >
          <AILogo className="w-full h-full" />
        </motion.div>
      ) : (
        <motion.img
          src={images.main}
          alt="Credentia Logo"
          animate={glow ? {
            filter: [
              'drop-shadow(0 0 8px rgba(0, 242, 255, 0.4))',
              'drop-shadow(0 0 20px rgba(0, 242, 255, 0.8))',
              'drop-shadow(0 0 8px rgba(0, 242, 255, 0.4))'
            ]
          } : {}}
          transition={glow ? pulseTransition : {}}
          className={cn(
            'object-contain', 
            sizeClasses[size]
          )}
          referrerPolicy="no-referrer"
        />
      )}
    </motion.div>
  );
}
