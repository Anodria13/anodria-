import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

const THEMES = [
  {
    name: 'Material Design',
    colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5']
  },
  {
    name: 'Pastel Dreams',
    colors: ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']
  },
  {
    name: 'Dark Mode',
    colors: ['#121212', '#1E1E1E', '#2C2C2C', '#383838', '#BB86FC']
  },
  {
    name: 'Ocean Blue',
    colors: ['#006994', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF']
  },
  {
    name: 'Forest',
    colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2']
  },
  {
    name: 'Sunset',
    colors: ['#FF9F1C', '#FFBF69', '#FFFFFF', '#CBF3F0', '#2EC4B6']
  },
  {
    name: 'Neon Cyber',
    colors: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000']
  },
  {
    name: 'Coffee',
    colors: ['#6F4E37', '#A67B5B', '#ECB176', '#FED8B1', '#F6F1E9']
  },
  {
    name: 'Berry Smoothie',
    colors: ['#720026', '#CE4257', '#FF7F51', '#FF9B54', '#FFCE7C']
  },
  {
    name: 'Monochrome',
    colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC']
  }
];

export const ThemesView = () => {
  const { setCurrentColor, t } = useApp();

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('themeGallery')}</h2>
      
      <div className="space-y-6">
        {THEMES.map((theme, index) => (
          <motion.div
            key={theme.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{theme.name}</h3>
            <div className="flex h-16 rounded-xl overflow-hidden cursor-pointer shadow-inner">
              {theme.colors.map((color) => (
                <div
                  key={color}
                  className="flex-1 hover:flex-[1.5] transition-all duration-300 relative group"
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <span className="text-[10px] text-white font-mono font-bold uppercase tracking-wider">
                      {t('tapToLoad')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
