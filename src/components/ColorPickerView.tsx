import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { colord } from 'colord';
import { Copy, Share2, Heart, Check, Palette } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

// Mock Phone UI Component moved outside to prevent re-creation on render
const PhonePreview = ({ color }: { color: string }) => (
  <div className="relative w-full max-w-[200px] aspect-[9/16] bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl mx-auto">
    {/* Status Bar */}
    <div className="h-6 bg-black/10 flex items-center justify-between px-3 text-[8px] font-mono">
      <span>9:41</span>
      <div className="flex space-x-1">
        <div className="w-3 h-3 bg-current rounded-full opacity-50"></div>
        <div className="w-3 h-3 bg-current rounded-full opacity-50"></div>
      </div>
    </div>
    
    {/* App Header */}
    <div 
      className="h-12 flex items-center px-3 text-white font-bold text-xs shadow-sm transition-colors duration-300"
      style={{ backgroundColor: color }}
    >
      <span>App Header</span>
    </div>

    {/* Content */}
    <div className="p-3 space-y-2">
      <div className="h-20 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
      <div className="flex space-x-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm transition-colors duration-300"
          style={{ backgroundColor: color }}
        >
          +
        </div>
        <div className="flex-1 h-8 rounded bg-gray-100 dark:bg-gray-700"></div>
      </div>
      <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-700"></div>
      <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-700"></div>
      
      {/* Button with current color */}
      <button 
        className="w-full py-2 rounded-md text-white text-[10px] font-bold shadow-sm mt-4 transition-colors duration-300"
        style={{ backgroundColor: color }}
      >
        Action Button
      </button>
    </div>
  </div>
);

export const ColorPickerView = () => {
  const { currentColor, setCurrentColor, addFavorite, t, isRTL } = useApp();
  const [alpha, setAlpha] = useState(255);
  const [showPicker, setShowPicker] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState(currentColor);

  // Sync local state with context color
  useEffect(() => {
    const c = colord(currentColor);
    const newAlpha = Math.round(c.alpha() * 255);
    
    // Only update alpha if it changed significantly (handling float precision)
    if (Math.abs(newAlpha - alpha) > 1) {
      setAlpha(newAlpha);
    }

    // Only update input if the color value actually changed from what's in the input
    // This prevents cursor jumping when typing valid short hex codes like #f00
    // and prevents infinite loops if format differs
    if (!colord(hexInput).isValid() || colord(hexInput).toHex() !== c.toHex()) {
      setHexInput(currentColor);
    }
  }, [currentColor]);

  const handleColorChange = (newColor: string) => {
    // newColor from HexColorPicker is always 6-digit hex (no alpha)
    const c = colord(newColor).alpha(alpha / 255);
    setCurrentColor(c.toHex());
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = parseInt(e.target.value, 10);
    setAlpha(newAlpha);
    const c = colord(currentColor).alpha(newAlpha / 255);
    setCurrentColor(c.toHex());
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (colord(val).isValid()) {
      const c = colord(val);
      // Update alpha from input if present, otherwise keep current alpha?
      // Actually colord(val) will have alpha 1 if not specified.
      // If user types 6 digit hex, we probably want to keep existing alpha?
      // But standard behavior is usually "what you type is what you get".
      // If I type #FF0000, I expect alpha 1.
      setAlpha(Math.round(c.alpha() * 255));
      setCurrentColor(c.toHex());
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 800;

    // Draw background
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, 800, 800);

    // Draw card
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    ctx.roundRect(100, 500, 600, 200, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Draw text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 60px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentColor.toUpperCase(), 400, 600);
    
    ctx.fillStyle = '#666666';
    ctx.font = '30px sans-serif';
    ctx.fillText('ColorPicker Pro', 400, 650);

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
  };

  const shareColor = async () => {
    try {
      const blob = await generateShareImage();
      const files = blob ? [new File([blob], 'color.png', { type: 'image/png' })] : [];
      
      const shareData: ShareData = {
        title: t('shareColor'),
        text: `Check out this color: ${currentColor}`,
        url: window.location.href,
      };

      if (files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
        shareData.files = files;
      }

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback
        copyToClipboard(currentColor, 'Share');
        alert(t('copied'));
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback if sharing fails (e.g. user cancelled)
    }
  };

  const formats = [
    { label: 'HEX', value: colord(currentColor).toHex() },
    { label: 'RGB', value: colord(currentColor).toRgbString() },
    { label: 'HSL', value: colord(currentColor).toHslString() },
    { label: 'RGBA', value: colord(currentColor).toRgbString() }, // colord handles alpha in rgb string automatically if present
  ];

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      {/* Live Preview Panel */}
      <section className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider text-center">{t('preview')}</h2>
        <PhonePreview color={currentColor} />
      </section>

      {/* Color Picker Controls */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div 
            className="w-12 h-12 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase"
            />
            <button
              onClick={() => copyToClipboard(currentColor, 'HEX_INPUT')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {copiedFormat === 'HEX_INPUT' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={`p-3 rounded-xl border transition-colors ${
              showPicker 
                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' 
                : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
            }`}
          >
            <Palette className="w-6 h-6" />
          </button>
        </div>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex justify-center p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <HexColorPicker 
                  color={colord(currentColor).alpha(1).toHex()} 
                  onChange={handleColorChange} 
                  style={{ width: '100%', height: '200px' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opacity Slider */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('opacity')}</label>
            <span className="text-sm font-mono text-gray-500">{alpha}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={alpha}
            onChange={handleAlphaChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              addFavorite(currentColor);
              // Optional: Show toast
            }}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse py-3 px-4 bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 rounded-xl font-medium hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>{t('save')}</span>
          </button>
          <button
            onClick={shareColor}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse py-3 px-4 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>{t('share')}</span>
          </button>
        </div>
      </section>

      {/* Format Converter */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('colorDetails')}</h3>
        <div className="grid gap-3">
          {formats.map((format) => (
            <button
              key={format.label}
              onClick={() => copyToClipboard(format.value, format.label)}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-gray-400 mb-1">{format.label}</span>
                <span className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all text-left">
                  {format.value}
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                {copiedFormat === format.label ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
