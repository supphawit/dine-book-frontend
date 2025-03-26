"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface UserProfile {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  image: string;
  birthdate: string;
  email_noti: boolean;
  sms_noti: boolean;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  saveProfile: (user: UserProfile) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client-side
    try {
      const savedUser = localStorage.getItem("profile");
      if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("token not found", token);
        setUserProfile(null);
      }
    } catch (error) {
      console.log("error", error);
    }

    setIsLoading(false);
  }, []);

  const saveProfile = (user: UserProfile) => {
    setUserProfile(user);
    localStorage.setItem("profile", JSON.stringify(user));
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUserProfile(null);
    // Optionally, redirect to login page
    // window.location.href = "/";
  };

  const value = {
    userProfile,
    saveProfile,
    logout,
  };

  // Don't render children until initial load is complete
  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
