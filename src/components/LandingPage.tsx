import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Bot, LogIn, User, ArrowRight, Shield, Globe, Cpu, 
  Menu, X, Fingerprint, AlertOctagon, Aperture, Terminal,
  Zap, BarChart3, Lock, Bell, Mail, Star, ChevronDown,
  Facebook, Twitter, Github, Linkedin, ExternalLink, Code,
  Search, ShieldAlert, Activity, Send
} from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { ThreeBackground } from './ThreeBackground';
import { cn } from '../utils/cn';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';
import { useRef } from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onGuest: () => void;
}

export function LandingPage({ onLogin, onGuest }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Stats', href: '#stats' },
    { name: 'Contact', href: '#contact' },
  ];

  const features = [
    { 
      title: 'Check Your Passwords', 
      desc: 'Find out if your passwords or accounts have been leaked online.', 
      icon: <Fingerprint className="w-6 h-6 text-cyber-blue" />,
      color: 'bg-cyber-blue'
    },
    { 
      title: 'Stay Protected', 
      desc: 'Get the latest safety tips to stay ahead of online threats.', 
      icon: <ShieldCheck className="w-6 h-6 text-cyber-green" />,
      color: 'bg-cyber-green'
    },
    { 
      title: 'Phishing Detector', 
      desc: 'Paste any suspicious link or message and scan it for phishing and social engineering patterns.',
      icon: <AlertOctagon className="w-6 h-6 text-cyber-purple" />,
      color: 'bg-cyber-purple'
    },
    { 
      title: 'Quick Alerts', 
      desc: 'We will let you know immediately if your data is at risk.', 
      icon: <Bell className="w-6 h-6 text-cyber-yellow" />,
      color: 'bg-cyber-yellow'
    },
    { 
      title: 'Safety Dashboard', 
      desc: 'See your overall security score and health in one easy place.', 
      icon: <BarChart3 className="w-6 h-6 text-cyber-blue" />,
      color: 'bg-cyber-blue'
    },
    { 
      title: 'Always Private', 
      desc: 'Your personal information is kept safe and private around the clock.', 
      icon: <Lock className="w-6 h-6 text-white" />,
      color: 'bg-white'
    }
  ];

  const steps = [
    {
      title: "Create Your Account",
      desc: "Sign in safely to start protecting your personal data.",
      icon: <LogIn className="w-6 h-6 text-cyber-blue" />
    },
    {
      title: "Run a Safety Scan",
      desc: "Check your files and accounts for any hidden security risks.",
      icon: <Search className="w-6 h-6 text-cyber-blue" />
    },
    {
      title: "Learn Simple Habits",
      desc: "Follow our easy guides to become an expert at staying safe online.",
      icon: <Zap className="w-6 h-6 text-cyber-blue" />
    }
  ];

  return (
    <div className="min-h-screen text-white selection:bg-cyber-blue selection:text-black">
      {/* Navbar moved logic here but ThreeBackground is global in App.tsx */}
      {/* Navbar with MORE button only */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4",
        scrolled ? "bg-black/30 backdrop-blur-md border-b border-white/5 shadow-lg" : "bg-transparent"
      )}>
        <nav className="max-w-7xl mx-auto flex items-center justify-end w-full">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-cyber-blue/40 text-white rounded-full hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest pl-1 text-white group-hover:text-cyber-blue transition-colors">More</span>
            <Menu className="w-4 h-4 text-cyber-blue" />
          </button>
        </nav>
      </header>

      {/* Premium Universal Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all text-white cursor-pointer"
            >
              <X className="w-6 h-6 text-cyber-blue" />
            </button>

            {/* Menu Content Container */}
            <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
              <div className="flex flex-col items-center gap-6 w-full text-center">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-black uppercase tracking-[0.2em] text-white/60 hover:text-cyber-blue transition-colors hover:scale-105 transform duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="w-full h-px bg-white/10 my-4" />

              {/* Blue Log In / Sign Up Button */}
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogin();
                }}
                className="w-full py-4 bg-cyber-blue text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyber-blue/80 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(0,242,255,0.35)]"
              >
                LOG IN / SIGN UP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Section 1: HERO (Preserving core animations/background) */}
        <section id="home" className="relative h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 text-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 max-w-4xl"
          >
            <div className="mb-2 scale-110">
              <Logo size="lg" glow />
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-glow"
            >
              Credentia
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-cyber-blue text-xs md:text-sm font-bold tracking-[0.25em] mb-10 uppercase opacity-80"
            >
              Advanced Protection for Your Digital Life
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-10 py-3.5 bg-cyber-blue text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyber-blue/80 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:shadow-[0_0_40px_rgba(0,242,255,0.5)]"
              >
                LOG IN / SIGN UP
              </button>
              <button 
                onClick={onGuest}
                className="w-full sm:w-auto px-10 py-3.5 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                Enter as Guest
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex flex-col items-center gap-2 animate-bounce opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-[10px] uppercase tracking-widest font-bold mb-1">Explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2: FEATURES */}
        <section id="features" className="py-24 md:py-40 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-glow">
                Keep Your Digital <span className="text-cyber-blue">Life Safe</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-lg">
                Easy-to-use tools designed to protect you from online threats. 
                Stay safe with our modern security features.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <Card key={i} {...f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: HOW IT WORKS */}
        <section id="how-it-works" className="py-24 md:py-40 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-glow">
                How <span className="text-cyber-blue">Credentia</span> Works
              </h2>
              <p className="text-white/60 text-sm md:text-lg">
                A simple process to help you stay protected.
              </p>
            </motion.div>

            <div className="relative space-y-12">
              {/* Connecting line */}
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: 'calc(100% - 64px)' }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute left-[27px] top-8 w-px bg-gradient-to-b from-cyber-blue/50 via-cyber-blue/10 to-transparent hidden md:block" 
              />
              
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex items-start gap-6 relative"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center shrink-0 z-10 backdrop-blur-md">
                    <div className="text-cyber-blue font-black">{i + 1}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                      {step.title}
                      <span className="text-[10px] text-cyber-blue/40 uppercase tracking-widest font-mono">Step_{i + 1}</span>
                    </h3>
                    <p className="text-white/50 leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: CONTACT & SUPPORT */}
        <section id="contact" className="py-16 md:py-40 px-6 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-glow w-full">
                Have <span className="text-cyber-blue">Questions?</span><br />
                We're Here to Help.
              </h2>
              <p className="text-white/60 mb-12 leading-relaxed text-sm md:text-lg max-w-xl">
                Feel free to reach out. Our support team is available 24/7 and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-4 w-full max-w-md">
                <div className="flex flex-col items-center lg:items-start gap-1 p-5 bg-white/5 rounded-[24px] border border-white/10 hover:border-cyber-blue/50 transition-all group backdrop-blur-sm w-full">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Support Assistance</span>
                  <a 
                    href="mailto:credentiasupport@gmail.com"
                    className="text-base md:text-xl font-bold text-white hover:text-cyber-blue transition-all flex items-center gap-3"
                  >
                    <div className="p-2 bg-cyber-blue/20 rounded-xl">
                      <Mail className="w-4 h-4 text-cyber-blue" />
                    </div>
                    credentiasupport@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-cyber-card/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[48px] relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-purple/5 rounded-full blur-[80px]" />
              
              <form 
                action="mailto:credentiasupport@gmail.com" 
                method="POST" 
                encType="text/plain" 
                className="space-y-5"
              >
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2 ml-2">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-cyber-purple transition-all text-white"
                    placeholder="Enter your name..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-cyber-purple transition-all text-white"
                    placeholder="yourname@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2 ml-2">Your Message</label>
                  <textarea 
                    name="message"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-cyber-purple transition-all text-white h-32 resize-none"
                    placeholder="Write your message here..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-cyber-purple text-white font-black uppercase tracking-widest rounded-2xl hover:bg-cyber-purple/80 hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-black/40 backdrop-blur-xl py-20 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Logo size="xs" glow />
                <span className="text-xl font-bold tracking-tighter uppercase text-white">Credentia</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed font-medium">
                Protecting your digital world, one account at a time.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] uppercase font-black tracking-[0.2em] text-cyber-blue">Navigation</h4>
              <nav className="flex flex-col gap-3">
                <FooterLink href="#home">Home</FooterLink>
                <FooterLink href="#features">Features</FooterLink>
                <FooterLink href="#how-it-works">How It Works</FooterLink>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] uppercase font-black tracking-[0.2em] text-cyber-blue">Privacy & Terms</h4>
              <nav className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowPrivacy(true)}
                  className="text-sm text-white/60 hover:text-cyber-blue transition-colors text-left font-medium cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => setShowTerms(true)}
                  className="text-sm text-white/60 hover:text-cyber-blue transition-colors text-left font-medium cursor-pointer"
                >
                  Terms of Service
                </button>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] uppercase font-black tracking-[0.2em] text-cyber-blue">Contact Support</h4>
              <a 
                href="mailto:credentiasupport@gmail.com"
                className="text-sm text-white hover:text-cyber-blue transition-all flex items-center gap-2 font-medium"
              >
                <Mail className="w-4 h-4 text-cyber-blue" />
                credentiasupport@gmail.com
              </a>
            </div>
          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 text-center">
            <span>© 2026 Credentia. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-cyber-card border border-white/10 w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[40px] p-8 md:p-12 relative scrollbar-hide"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Card({ icon, title, desc, color, index }: { icon: React.ReactNode, title: string, desc: string, color: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="p-8 bg-cyber-card/60 backdrop-blur-md rounded-[40px] border border-white/5 hover:border-cyber-blue/30 transition-all group relative overflow-hidden"
    >
      <div className={cn("absolute -top-12 -right-12 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-[40px]", color)} />
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-white/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 uppercase tracking-tighter">{title}</h3>
      <p className="text-sm text-white/30 leading-relaxed font-medium">{desc}</p>
      
      <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-cyber-blue text-[10px] font-bold uppercase tracking-widest">
        Learn More <ArrowRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="text-sm text-white/60 hover:text-cyber-blue transition-colors font-bold uppercase tracking-wider text-[10px]"
    >
      {children}
    </a>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyber-blue hover:border-cyber-blue/50 cursor-pointer transition-all"
    >
      {icon}
    </a>
  );
}
