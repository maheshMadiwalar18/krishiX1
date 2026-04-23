import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Leaf, ArrowRight, Sprout, Phone, MapPin, Wheat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthProps {
  onLoginSuccess: () => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
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
  const navigate = useNavigate();

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
    const demoEmail = "demo@agriguru.com";
    const demoPassword = "agriguruDemo!";

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
          <h2 className="text-4xl font-black tracking-tight mb-4 text-white">Join AgriGuru</h2>
          <p className="text-white/80 text-lg max-w-sm font-light">
            Empower your farming journey with AI-driven insights and localized recommendations designed for maximum yield.
          </p>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 h-full overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[12px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 my-8 flex-shrink-0"
        >
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4 md:hidden">
              <div className="w-12 h-12 bg-[#2E7D32] rounded-[12px] flex items-center justify-center text-white">
                <Sprout size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="text-sm text-neutral-500">
              {isLogin ? 'Sign in to access your farmer dashboard.' : 'Sign up to start optimizing your crop yields.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-[12px] text-sm font-medium border border-red-100 flex items-center gap-2 overflow-hidden"
                >
                  <div className="w-1 h-full bg-red-500 rounded-full" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, x: -20, height: 0 }} 
                  animate={{ opacity: 1, x: 0, height: 'auto' }} 
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="space-y-4 block"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Name</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="e.g. Rajesh Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#81C784]/50 focus:border-[#2E7D32] transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#81C784]/50 focus:border-[#2E7D32] transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="e.g. Bhopal, Madhya Pradesh"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#81C784]/50 focus:border-[#2E7D32] transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1 flex justify-between">
                      Primary Crop
                      <span className="text-neutral-400 text-[10px] normal-case tracking-normal">Optional</span>
                    </label>
                    <div className="relative group">
                      <Wheat className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="e.g. Wheat, Sugarcane"
                        value={primaryCrop}
                        onChange={(e) => setPrimaryCrop(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#81C784]/50 focus:border-[#2E7D32] transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">
                {isLogin ? 'Email Address' : 'Email Address (For Secure Login)'}
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#81C784]/50 focus:border-[#2E7D32] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1 flex justify-between">
                Password
                {isLogin && <button type="button" className="text-[#2E7D32] hover:underline normal-case tracking-normal font-medium">Forgot?</button>}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#81C784]/50 focus:border-[#2E7D32] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2E7D32] text-white rounded-[12px] font-bold shadow-md hover:bg-[#1B5E20] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In to Dashboard' : 'Create Free Account'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
              
              {isLogin && (
                <button 
                  type="button"
                  disabled={isLoading}
                  onClick={handleDemoLogin}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#81C784]/20 text-[#2E7D32] rounded-[12px] font-bold hover:bg-[#81C784]/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed border border-[#81C784]/30"
                >
                  Quick Demo Login
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              {' '}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                disabled={isLoading}
                className="text-[#2E7D32] font-bold hover:underline py-1 disabled:opacity-50"
              >
                {isLogin ? 'Sign up for free' : 'Sign in here'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
