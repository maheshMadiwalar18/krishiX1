import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Leaf, ArrowRight, Sprout, Phone, MapPin, Wheat, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthProps {
  onLoginSuccess: () => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup specific fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();

  const inspiringQuotes = [
    "Helping farmers grow more with smart and easy solutions.",
    "Better farming starts with the right guidance.",
    "Smart farming made simple for every farmer.",
    "Grow more, waste less, farm smarter.",
    "Your farming partner for better growth and success.",
    "Simple tools to help you grow healthy crops."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % inspiringQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [inspiringQuotes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Email and Password are required.');
      return;
    }

    if (!isLogin) {
      if (!name || !phone || !location) {
        setError('Please fill in Name, Phone Number, and Location.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Save farmer details inside Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          phone,
          location,
          primaryCrop: primaryCrop || "Not specified",
          createdAt: new Date().toISOString()
        });
      }
      
      onLoginSuccess();
    } catch (err: any) {
      // Improve error messages based on Firebase codes
      let message = 'Authentication failed. Please try again.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Error: Email/Password Authentication is not enabled in your Firebase Console.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Use a standard demo credential
    const demoEmail = "demo@krushix.com";
    const demoPassword = "krushixDemo!";

    try {
      // Attempt login first
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
         setError('Error: You need to enable Email/Password Authentication in your Firebase Console.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        // If it fails with invalid credentials, try creating the demo account!
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
          await updateProfile(userCredential.user, { displayName: "Demo Farmer" });
          await setDoc(doc(db, "users", userCredential.user.uid), {
            name: "Demo Farmer",
            email: demoEmail,
            phone: "+91 00000 00000",
            location: "Virtual Demo Farm",
            primaryCrop: "Wheat",
            createdAt: new Date().toISOString()
          });
          onLoginSuccess();
        } catch (createErr: any) {
          if (createErr.code === 'auth/operation-not-allowed') {
            setError('Error: You need to enable Email/Password provider in Firebase Console.');
          } else {
            setError('Failed to configure the demo account.');
          }
        }
      } else {
        setError('Demo login is temporarily unavailable.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F1F8E9] overflow-hidden selection:bg-[#81C784]/30 pt-16">
      
      {/* Decorative Background Side (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#2E7D32] flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=2000" 
            alt="Agriculture Field" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        
        {/* Subtle illustrations/patterns */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white flex flex-col items-center text-center p-12"
        >
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <Sprout size={48} className="text-[#81C784]" />
          </div>
          
          <h2 className="text-4xl font-black tracking-tight mb-6 text-white">{t('auth_title')}</h2>
          
          <div className="h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-white/80 text-xl max-w-sm font-light italic leading-relaxed"
              >
                “{inspiringQuotes[quoteIndex]}”
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 h-full overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-neutral-100 my-8 flex-shrink-0"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
               <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mx-auto">
                 <Sprout size={28} strokeWidth={2.5} />
               </div>
               <span className="text-2xl font-black tracking-tight flex items-center justify-center mt-2">
                 <span className="text-primary tracking-tighter">Krushi</span>
                 <span className="text-primary-light">X</span>
               </span>
            </div>
            <button 
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3.5 bg-[#E8F5E9] text-[#2E7D32] rounded-xl font-black text-sm hover:bg-[#C8E6C9] transition-all mb-4 border border-[#2E7D32]/10 flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <LogIn size={18} />
              {t('auth_demo_btn')}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-gray-300">
                <span className="bg-white px-4">{t('or_separator')}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-text/30 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-12 pr-4 py-3.5 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-text/30 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="tel"
                        placeholder="Number"
                        className="w-full pl-12 pr-4 py-3.5 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text/30 uppercase tracking-widest mb-1.5 ml-1">Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full pl-12 pr-4 py-3.5 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-text/30 uppercase tracking-widest mb-1.5 ml-1">{t('auth_email_label')}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-text/30 uppercase tracking-widest mb-1.5 ml-1">{t('auth_password_label')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[11px] font-black flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white rounded-xl font-black text-sm hover:bg-primary/90 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : (isLogin ? t('auth_login_btn') : t('auth_signup_btn'))}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs font-black text-text/30 hover:text-primary transition-all underline underline-offset-4 decoration-2"
            >
              {isLogin ? t('auth_signup_link') : 'Already have an account? Login'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
