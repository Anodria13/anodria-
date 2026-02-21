import React from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        ColorPicker Pro
      </h1>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={t('language')}
        >
          <span className="font-bold text-sm text-gray-700 dark:text-gray-300">
            {language === 'en' ? 'AR' : 'EN'}
          </span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
};
