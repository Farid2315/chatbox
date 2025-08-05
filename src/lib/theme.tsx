"use client";

import React, { createContext, useContext, useEffect } from "react";

export type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always set dark theme
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
    
    // Update body background
    document.body.classList.add("bg-black", "text-white");
    document.body.classList.remove("bg-white", "text-black");
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    // No-op for now, always dark
  };

  return (
    <ThemeContext.Provider value={{ theme: "dark", setTheme: handleSetTheme, resolvedTheme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 