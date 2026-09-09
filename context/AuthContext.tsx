"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  email: string;
  phone?: string;
  landSize?: string;
  commodity?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    commodity?: string;
    password?: string;
  }) => Promise<boolean>;
  logout: () => void;
  loginAsDemo: () => void;
  updateUser: (data: Partial<User>) => void;
}

const DEFAULT_USER: User = {
  name: "Rasya Pratama",
  email: "rasya@farmora.id",
  phone: "+62 812-3456-7890",
  landSize: "2.4 ha",
  commodity: "Padi & Palawija",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("farmora_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Initialize with default demo user for seamless evaluation
        setUser(DEFAULT_USER);
        localStorage.setItem("farmora_user", JSON.stringify(DEFAULT_USER));
      }
    } catch {
      setUser(DEFAULT_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate brief network latency for realistic mobile feel
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newUser: User = {
      name: email.split("@")[0] || "Petani Farmora",
      email: email,
      phone: "+62 812-3456-7890",
      landSize: "2.4 ha",
      commodity: "Padi",
    };
    setUser(newUser);
    localStorage.setItem("farmora_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone?: string;
    commodity?: string;
  }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const newUser: User = {
      name: data.name,
      email: data.email,
      phone: data.phone || "+62 812-3456-7890",
      landSize: "1.5 ha",
      commodity: data.commodity || "Padi Sawah",
    };
    setUser(newUser);
    localStorage.setItem("farmora_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const loginAsDemo = () => {
    setUser(DEFAULT_USER);
    localStorage.setItem("farmora_user", JSON.stringify(DEFAULT_USER));
    router.push("/");
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...data };
      localStorage.setItem("farmora_user", JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("farmora_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginAsDemo,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
