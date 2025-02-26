import React, { useState } from 'react';
import { Moon, ArrowLeft, Volume2, Shuffle, RotateCcw, Pause, BookmarkPlus, Share2, Settings2, MinusCircle, PlusCircle, Globe, Mic2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Verse {
  number: number;
  arabic: string;
  translation: string;
}

interface Reciter {
  id: number;
  name: string;
  arabicName: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const reciters: Reciter[] = [
  { id: 1, name: 'Abdul Basit Abdul Samad', arabicName: 'عبد الباسط عبد الصمد' },
  { id: 2, name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي' },
  { id: 3, name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري' },
  { id: 4, name: 'Mohamed Siddiq El-Minshawi', arabicName: 'محمد صديق المنشاوي' },
];

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
];

// Example verses data for Al-Fatihah
const verses: Verse[] = [
  {
    number: 1,
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  },
  {
    number: 2,
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    translation: "All praise is due to Allah, Lord of the worlds.",
  },
  // Add more verses...
];

function SurahPage() {
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(28);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState(reciters[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const totalVerses = verses.length;

  const adjustFontSize = (increment: number) => {
    setFontSize(prev => Math.min(Math.max(prev + increment, 20), 40));
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat bg-emerald-900/95" 
      style={{ backgroundImage: "linear-gradient(to left, rgba(20, 24, 23, 0.001), rgba(10, 14, 13, 0.002)), url('/src/assets/images/background.jpeg')" }}
    >
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 bg-emerald-900/95 backdrop-blur-md border-b border-yellow-400/20 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/quran')} 
              className="text-yellow-400 flex items-center gap-2 hover:text-yellow-500 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg">Back</span>
            </button>
            
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold text-yellow-400">Al-Fatihah</h1>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <span>The Opening</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>7 Verses</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-yellow-400 font-medium">
                  {verses[0].number}/{totalVerses}
                </span>
              </div>
            </div>

            <div className="w-12 h-12">
              <div className="w-full h-full rounded-full bg-yellow-400/90 flex items-center justify-center">
                <Moon className="text-emerald-900 w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Controls Bar */}
      <div className="sticky top-20 bg-emerald-800/50 backdrop-blur-sm border-b border-yellow-400/20 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Audio Controls with Reciter Selection */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors bg-emerald-800/30 px-4 py-2 rounded-full"
                  onClick={() => setShowReciterDropdown(!showReciterDropdown)}
                >
                  <Mic2 className="w-5 h-5" />
                  <span className="hidden md:inline">{selectedReciter.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showReciterDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-emerald-800/95 backdrop-blur-sm border border-yellow-400/20 rounded-lg shadow-lg">
                    {reciters.map(reciter => (
                      <button
                        key={reciter.id}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-700/30 text-white hover:text-yellow-400 transition-colors"
                        onClick={() => {
                          setSelectedReciter(reciter);
                          setShowReciterDropdown(false);
                        }}
                      >
                        <div>{reciter.name}</div>
                        <div className="text-sm text-gray-400 font-arabic">{reciter.arabicName}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                <Shuffle className="w-5 h-5" />
              </button>
              <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Translation Language Selection */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors bg-emerald-800/30 px-4 py-2 rounded-full"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <Globe className="w-5 h-5" />
                <span className="hidden md:inline">{selectedLanguage.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-emerald-800/95 backdrop-blur-sm border border-yellow-400/20 rounded-lg shadow-lg">
                  {languages.map(language => (
                    <button
                      key={language.code}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-700/30 text-white hover:text-yellow-400 transition-colors"
                      onClick={() => {
                        setSelectedLanguage(language);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      <div>{language.name}</div>
                      <div className="text-sm text-gray-400">{language.nativeName}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => adjustFontSize(-2)}
                className="text-yellow-400 hover:text-yellow-500 transition-colors"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
              <button 
                onClick={() => adjustFontSize(2)}
                className="text-yellow-400 hover:text-yellow-500 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center gap-4">
              <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                <BookmarkPlus className="w-5 h-5" />
              </button>
              <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verses Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {verses.map((verse) => (
            <div 
              key={verse.number}
              className={`rounded-2xl p-6 transition-all duration-300 ${
                showTranslation
                  ? 'bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/30 hover:border-yellow-400/30'
                  : ''
              }`}
            >
              {/* Verse Number and Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center text-yellow-400 font-arabic">
                  {verse.number}
                </div>
                <div className="flex gap-2">
                  <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                    <BookmarkPlus className="w-5 h-5" />
                  </button>
                  <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <p 
                className="text-right font-arabic leading-loose mb-6"
                style={{ fontSize: `${fontSize}px` }}
              >
                {verse.arabic}
              </p>

              {/* Translation */}
              {showTranslation && (
                <p className="text-white text-lg">
                  {verse.translation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-emerald-900/95 backdrop-blur-md border-t border-yellow-400/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button className="text-yellow-400 px-6 py-2 rounded-full border border-yellow-400 hover:bg-yellow-400 hover:text-emerald-900 transition-colors">
              Previous Surah
            </button>
            <button 
              className={`px-4 py-2 rounded-full transition-colors ${showTranslation ? 'bg-yellow-400 text-emerald-900' : 'text-yellow-400 border border-yellow-400'}`}
              onClick={() => setShowTranslation(!showTranslation)}
            >
              Translation
            </button>
            <button className="text-yellow-400 px-6 py-2 rounded-full border border-yellow-400 hover:bg-yellow-400 hover:text-emerald-900 transition-colors">
              Next Surah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurahPage;