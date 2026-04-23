import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  CloudRain, 
  Sparkles, 
  Bot, 
  HeartPulse, 
  ThermometerSun, 
  Shovel,
  Clock,
  AlertTriangle,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Wheat,
  Calendar
} from 'lucide-react';
import FeatureCard from './FeatureCard';
import StatCard from './StatCard';
import { motion } from 'motion/react';
import { CardSkeleton } from './ui/Skeleton';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  primaryCrop: string;
  createdAt: string;
}

export default function Dashboard({ onStartView }: { onStartView: (view: 'disease' | 'weather' | 'assistant' | 'analytics' | 'knowledge') => void }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, "users", auth.currentUser.uid);
    
    // Use onSnapshot for real-time updates and faster cached reads
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        // Fallback if document doesn't exist yet
        setUserData({
          name: auth.currentUser?.displayName || 'Farmer',
          email: auth.currentUser?.email || '',
          phone: 'Not Set',
          location: 'Not Set',
          primaryCrop: 'Not Set',
          createdAt: auth.currentUser?.metadata.creationTime || new Date().toISOString()
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="h-10 w-48 bg-text/5 animate-pulse rounded-lg" />
          <div className="h-4 w-64 bg-text/5 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto pb-20"
    >
      {/* Welcome & Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <motion.section variants={itemVariants} className="lg:col-span-2">
          <h1 className="text-4xl font-display font-extrabold text-text mb-2">
            Hello, {userData?.name || 'Farmer'} 👋
          </h1>
          <p className="text-text/60 font-medium text-lg">Welcome back to your KrushiX control center.</p>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-text">{userData?.location || 'Not Set'}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Wheat size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest">Primary Crop</p>
                <p className="text-sm font-bold text-text">{userData?.primaryCrop || 'Not Set'}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* User Card */}
        <motion.section variants={itemVariants} className="bg-[#2E7D32] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <User size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{userData?.name || 'Farmer'}</h3>
                <p className="text-white/70 text-xs">{userData?.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-white/60" />
                <span>{userData?.phone || 'No Phone'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-white/60" />
                <span>Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-xs font-bold transition-all">
              Edit Profile Details
            </button>
          </div>
        </motion.section>
      </div>

      {/* 4 Main Feature Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div onClick={() => onStartView('disease')} className="cursor-pointer">
          <FeatureCard 
            icon={Camera} 
            title="Scan Crop" 
            description="Identify diseases and pests instantly."
            color="bg-[#2E7D32]"
            delay={0}
          />
        </div>
        <div onClick={() => onStartView('weather')} className="cursor-pointer">
          <FeatureCard 
            icon={CloudRain} 
            title="Weather" 
            description="Real-time rain & climate alerts."
            color="bg-[#43A047]"
            delay={0}
          />
        </div>
        <div onClick={() => onStartView('weather')} className="cursor-pointer">
          <FeatureCard 
            icon={Sparkles} 
            title="Advisory" 
            description="Soil health based suggestions."
            color="bg-[#66BB6A]"
            delay={0}
          />
        </div>
        <div onClick={() => onStartView('assistant')} className="cursor-pointer">
          <FeatureCard 
            icon={Bot} 
            title="Ask KrushiX" 
            description="24/7 AI Farming Assistant."
            color="bg-[#81C784]"
            delay={0}
          />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.section variants={itemVariants} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Quick Stats</h2>
          <button 
            onClick={() => onStartView('analytics')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group transition-all"
          >
            View Full Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={HeartPulse} 
            label="Crop Health" 
            value="Excellent (94%)" 
            trend="+2.1%" 
            colorClass="bg-green-50 text-green-600"
          />
          <StatCard 
            icon={ThermometerSun} 
            label="Weather Status" 
            value="Sunny, 32°C" 
            trend="Stable"
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard 
            icon={Shovel} 
            label="Soil Condition" 
            value="Needs Irrigation" 
            trend="-5%" 
            trendUp={false}
            colorClass="bg-orange-50 text-orange-600"
          />
        </div>
      </motion.section>

      {/* Bottom Section: Activity & Alerts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text">Recent Activity</h2>
          </div>
          <div className="bg-white rounded-3xl border border-border card-shadow overflow-hidden">
            <div className="divide-y divide-border">
              {[
                { icon: Camera, title: "Crop Scan Completed", time: "2 hours ago", desc: "No diseases found in Wheat-01." },
                { icon: Shovel, title: "Soil Report Updated", time: "5 hours ago", desc: "Nitrogen levels slightly low in Plot B." },
                { icon: Sparkles, title: "Recommendation Applied", time: "Yesterday", desc: "Scheduled organic fertilizer for Rice." }
              ].map((item, i) => (
                <div key={i} className="p-5 flex items-start gap-4 hover:bg-bg/40 transition-colors group cursor-pointer">
                  <div className="mt-1 p-2 bg-bg rounded-xl text-primary group-hover:scale-110 transition-transform">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm text-text">{item.title}</p>
                      <span className="text-[10px] text-text/40 font-medium flex items-center gap-1">
                        <Clock size={10} /> {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-text/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text">Alerts</h2>
          </div>
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-orange-50/50 border border-orange-100 p-5 rounded-3xl flex items-start gap-4 transition-all"
            >
              <div className="p-3 bg-accent rounded-2xl text-text shadow-sm shadow-accent/20">
                <CloudRain size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-sm text-text">Rain Warning</p>
                  <span className="text-[10px] bg-white px-2.5 py-1 rounded-full font-bold text-accent shadow-sm border border-orange-100">
                    HIGH RISK
                  </span>
                </div>
                <p className="text-xs text-text/70 leading-relaxed">Heavy showers predicted within 4 hours. Cover sensitive plants.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-red-50/50 border border-red-100 p-5 rounded-3xl flex items-start gap-4 transition-all"
            >
              <div className="p-3 bg-red-500 rounded-2xl text-white shadow-sm shadow-red-500/20">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-sm text-red-900">Disease Detected</p>
                  <span className="text-[10px] bg-white px-2.5 py-1 rounded-full font-bold text-red-600 shadow-sm border border-red-100">
                    ACTION REQ
                  </span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">Possible Yellow Rust detected in Wheat block. Apply treatments.</p>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}
