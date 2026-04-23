import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  primaryCrop: string;
  createdAt: string;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('user_profile_cache');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // ✅ OPTIMIZED FETCH LOGIC
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("📡 [Frontend] Fetching profile from Backend API...");
        try {
          // Use relative path so proxy works on both localhost and network IP
          const response = await fetch('/api/auth/profile');
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("✅ [Frontend] Profile data received:", data.name);
          
          setUserData(data);
          localStorage.setItem('user_profile_cache', JSON.stringify(data));
        } catch (error) {
          console.error("❌ [Frontend] Failed to fetch profile:", error);
          
          // Fallback to basic info if API fails
          setUserData({
            name: user.displayName || 'Farmer',
            email: user.email || '',
            phone: 'Not Set',
            location: 'Not Set',
            primaryCrop: 'Not Set',
            createdAt: user.metadata.creationTime || new Date().toISOString()
          });
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
        localStorage.removeItem('user_profile_cache');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
