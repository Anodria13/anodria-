import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { Language, translations } from '../utils/translations';

extend([namesPlugin]);

export type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  currentColor: string; // Hex
  setCurrentColor: (color: string) => void;
  favorites: string[];
  addFavorite: (color: string) => void;
  removeFavorite: (color: string) => void;
  t: (key: keyof typeof translations['en']) => string;
  isRTL: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or defaults
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'en' || saved === 'ar') ? saved : 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });

  const [currentColor, setCurrentColorState] = useState<string>('#3B82F6'); // Default blue

  const [favorites, setFavoritesState] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setCurrentColor = (color: string) => {
    setCurrentColorState(color);
  };

  const addFavorite = (color: string) => {
    if (!favorites.includes(color)) {
      setFavoritesState(prev => [color, ...prev]);
    }
  };

  const removeFavorite = (color: string) => {
    setFavoritesState(prev => prev.filter(c => c !== color));
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key];
  };

  const isRTL = language === 'ar';

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      toggleTheme,
      currentColor,
      setCurrentColor,
      favorites,
      addFavorite,
      removeFavorite,
      t,
      isRTL
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
