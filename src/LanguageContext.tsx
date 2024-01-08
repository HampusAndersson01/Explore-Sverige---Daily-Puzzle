// LanguageContext.tsx
import React, { createContext, useContext, ReactNode, useEffect } from "react";

export enum Language {
  English = "english",
  Swedish = "swedish",
}

interface LanguageContextProps {
  children: ReactNode;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export const LanguageProvider: React.FC<LanguageContextProps> = ({
  children,
}) => {
  const [language, setLanguageState] = React.useState(() => {
    // Load language from local storage or default to English
    const storedLanguage = localStorage.getItem("language");
    return storedLanguage ? (storedLanguage as Language) : Language.English;
  });

  const setLanguage = (newLanguage: Language) => {
    // Save language to local storage
    localStorage.setItem("language", newLanguage);
    setLanguageState(newLanguage);
  };

  useEffect(() => {
    // Ensure local storage is in sync with the state
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage && storedLanguage !== language) {
      setLanguageState(storedLanguage as Language);
    }
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
