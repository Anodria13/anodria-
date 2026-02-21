import React from 'react';
import { Trash2, Copy, Check, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const FavoritesView = () => {
  const { favorites, removeFavorite, setCurrentColor, t } = useApp();
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-[80vh]">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('favorites')}</h2>
      
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Heart className="w-16 h-16 mb-4 opacity-20" />
          <p>{t('noFavorites')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {favorites.map((color) => (
              <motion.div
                key={color}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div 
                  className="h-24 w-full cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
                <div className="p-3 flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
                    {color}
                  </span>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <button
                      onClick={(e) => handleCopy(e, color)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      {copied === color ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(color);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

