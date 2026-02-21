import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ColorPickerView } from './components/ColorPickerView';
import { FavoritesView } from './components/FavoritesView';
import { ThemesView } from './components/ThemesView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'picker' | 'favorites' | 'themes'>('picker');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <main className="pt-4">
        {activeTab === 'picker' && <ColorPickerView />}
        {activeTab === 'favorites' && <FavoritesView />}
        {activeTab === 'themes' && <ThemesView />}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
