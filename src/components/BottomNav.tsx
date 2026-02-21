import React from 'react';
import { Palette, Heart, Grid } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  activeTab: 'picker' | 'favorites' | 'themes';
  setActiveTab: (tab: 'picker' | 'favorites' | 'themes') => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const { t } = useApp();

  const tabs = [
    { id: 'picker', label: t('pickColor'), icon: Palette },
    { id: 'favorites', label: t('favorites'), icon: Heart },
    { id: 'themes', label: t('themes'), icon: Grid },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
