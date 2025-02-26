import React, { useState, useEffect, useRef } from 'react';
import { Moon, ArrowLeft, Volume2, Shuffle, RotateCcw, Pause, BookmarkPlus, Share2, Settings2, MinusCircle, PlusCircle, Globe, Mic2, ChevronDown, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import QuranReader from '../components/QuranReader';
import { getAvailableTranslations, EditionInfo } from '../services/quranService';

interface Reciter {
  id: string;
  name: string;
  arabicName: string;
}

const reciters: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Abdul Samad', arabicName: 'عبد الباسط عبد الصمد' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahmaan As-Sudais', arabicName: 'عبدالرحمن السديس' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', arabicName: 'محمد صديق المنشاوي' },
];

function SurahPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const surahId = id ? parseInt(id, 10) : 1;
  
  const [fontSize, setFontSize] = useState(28);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState(reciters[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<EditionInfo | null>(null);
  const [availableTranslations, setAvailableTranslations] = useState<EditionInfo[]>([]);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translationsLoading, setTranslationsLoading] = useState(false);
  const [translationsError, setTranslationsError] = useState<string | null>(null);
  
  // Create a ref for each verse to enable scrolling
  const verseRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize QuranReader with default translation
  const {
    verses,
    currentVerse,
    isPlaying,
    isLoading,
    error: quranError,
    volume,
    repeatMode,
    reader,
    surahInfo,
    currentTranslation,
    playVerse,
    togglePlayPause,
    setVolume,
    setRepeatMode,
    saveProgress,
    toggleBookmark,
    isBookmarked,
    changeReciter,
    changeTranslation,
    audioRef,
    handleAudioEnd
  } = QuranReader({ 
    surahNumber: surahId,
    mode: 'surah',
    translationEdition: selectedLanguage?.identifier || 'en.asad'
  });
  
  // Load available translations when component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      setTranslationsLoading(true);
      try {
        const translations = await getAvailableTranslations();
        setAvailableTranslations(translations);
        
        // Set default translation (English - Asad)
        const defaultTranslation = translations.find(t => t.identifier === 'en.asad');
        if (defaultTranslation) {
          setSelectedLanguage(defaultTranslation);
        } else if (translations.length > 0) {
          // Fallback to first available translation
          setSelectedLanguage(translations[0]);
        }
      } catch (err) {
        setTranslationsError('Failed to load available translations');
        console.error('Error loading translations:', err);
      } finally {
        setTranslationsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  // Reset verse refs array when verses change
  useEffect(() => {
    verseRefs.current = verseRefs.current.slice(0, verses.length);
  }, [verses]);
  
  // Scroll to current verse when it changes
  useEffect(() => {
    if (currentVerse !== undefined && verseRefs.current[currentVerse]) {
      scrollToVerse(currentVerse);
    }
  }, [currentVerse]);

  // Apply translation changes
  useEffect(() => {
    if (selectedLanguage) {
      changeTranslation(selectedLanguage.identifier);
    }
  }, [selectedLanguage]);

  const scrollToVerse = (index: number) => {
    if (verseRefs.current[index]) {
      // Scroll with a slight offset from the top
      verseRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  useEffect(() => {
    // Find the selected reciter in our list
    const reciter = reciters.find(r => r.id === reader);
    if (reciter) {
      setSelectedReciter(reciter);
    }
  }, [reader]);

  const adjustFontSize = (increment: number) => {
    setFontSize(prev => Math.min(Math.max(prev + increment, 20), 40));
  };

  const handleReciterChange = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    changeReciter(reciter.id);
    setShowReciterDropdown(false);
  };

  const handleTranslationChange = (translation: EditionInfo) => {
    setSelectedLanguage(translation);
    setShowLanguageDropdown(false);
  };

  const totalVerses = verses.length;

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
              {surahInfo && (
                <>
                  <h1 className="text-xl font-bold text-yellow-400">{surahInfo.englishName}</h1>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                    <span>{surahInfo.name}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{surahInfo.numberOfAyahs} Verses</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-yellow-400 font-medium">
                      {currentVerse !== undefined && verses[currentVerse]?.numberInSurah || 0}/{totalVerses}
                    </span>
                  </div>
                </>
              )}
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
                  <div className="absolute top-full left-0 mt-2 w-64 bg-emerald-800/95 backdrop-blur-sm border border-yellow-400/20 rounded-lg shadow-lg z-50">
                    {reciters.map(reciter => (
                      <button
                        key={reciter.id}
                        className={`w-full text-left px-4 py-3 hover:bg-emerald-700/30 ${
                          selectedReciter.id === reciter.id ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                        } transition-colors`}
                        onClick={() => handleReciterChange(reciter)}
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
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <button 
                className={`text-yellow-400 hover:text-yellow-500 transition-colors ${
                  repeatMode === 'page' ? 'bg-yellow-400/20 rounded-full p-1' : ''
                }`}
                onClick={() => setRepeatMode(mode => mode === 'page' ? 'none' : 'page')}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button 
                className={`text-yellow-400 hover:text-yellow-500 transition-colors ${
                  repeatMode === 'verse' ? 'bg-yellow-400/20 rounded-full p-1' : ''
                }`}
                onClick={() => setRepeatMode(mode => mode === 'verse' ? 'none' : 'verse')}
              >
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
                <span className="hidden md:inline">
                  {translationsLoading 
                    ? 'Loading...' 
                    : selectedLanguage 
                      ? selectedLanguage.englishName 
                      : 'Select translation'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-emerald-800/95 backdrop-blur-sm border border-yellow-400/20 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {translationsLoading ? (
                    <div className="px-4 py-3 text-white">Loading translations...</div>
                  ) : translationsError ? (
                    <div className="px-4 py-3 text-red-400">{translationsError}</div>
                  ) : (
                    availableTranslations.map(translation => (
                      <button
                        key={translation.identifier}
                        className={`w-full text-left px-4 py-3 hover:bg-emerald-700/30 ${
                          selectedLanguage?.identifier === translation.identifier 
                            ? 'text-yellow-400' 
                            : 'text-white hover:text-yellow-400'
                        } transition-colors`}
                        onClick={() => handleTranslationChange(translation)}
                      >
                        <div>{translation.englishName}</div>
                        <div className="text-sm text-gray-400">
                          {translation.name} ({translation.language})
                        </div>
                      </button>
                    ))
                  )}
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
              <button 
                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                onClick={saveProgress}
              >
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : quranError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Quran</h3>
            <p className="text-gray-300 max-w-md">{quranError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-yellow-400 text-emerald-900 px-6 py-3 rounded-full hover:bg-yellow-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {verses.map((verse, index) => (
              <div 
                key={verse.number}
                ref={el => verseRefs.current[index] = el}
                className={`rounded-2xl p-6 transition-all duration-300 ${
                  showTranslation
                    ? 'bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/30 hover:border-yellow-400/30'
                    : ''
                } ${currentVerse === index ? 'border-yellow-400 border-2' : ''}`}
              >
                {/* Verse Number and Controls */}
                <div className="flex justify-between items-center mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-yellow-400 font-arabic
                    ${currentVerse === index ? 'bg-yellow-400/30' : 'bg-emerald-800/50'}`}>
                    {verse.numberInSurah}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className={`${currentVerse === index && isPlaying ? 'text-yellow-400 bg-yellow-400/20 rounded-full p-1' : 'text-yellow-400 hover:text-yellow-500'} transition-colors`}
                      onClick={() => playVerse(index)}
                    >
                      {currentVerse === index && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <button 
                      className={`text-yellow-400 hover:text-yellow-500 transition-colors ${
                        isBookmarked(`${verse.surah.number}:${verse.numberInSurah}`) ? 'text-yellow-500' : ''
                      }`}
                      onClick={() => toggleBookmark(`${verse.surah.number}:${verse.numberInSurah}`)}
                    >
                      <BookmarkPlus className="w-5 h-5" />
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <p 
                  className={`text-right font-arabic leading-loose mb-6 ${
                    currentVerse === index ? 'text-yellow-400' : 'text-white'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {verse.text}
                </p>

                {/* Translation */}
                {showTranslation && (
                  <p className="text-white text-lg">
                    {verse.translation || 'Translation not available'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-emerald-900/95 backdrop-blur-md border-t border-yellow-400/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button 
              className="text-yellow-400 px-6 py-2 rounded-full border border-yellow-400 hover:bg-yellow-400 hover:text-emerald-900 transition-colors"
              onClick={() => navigate(`/quran/surah/${Math.max(1, surahId - 1)}`)}
              disabled={surahId <= 1}
            >
              Previous Surah
            </button>
            <button 
              className={`px-4 py-2 rounded-full transition-colors ${showTranslation ? 'bg-yellow-400 text-emerald-900' : 'text-yellow-400 border border-yellow-400'}`}
              onClick={() => setShowTranslation(!showTranslation)}
            >
              Translation
            </button>
            <button 
              className="text-yellow-400 px-6 py-2 rounded-full border border-yellow-400 hover:bg-yellow-400 hover:text-emerald-900 transition-colors"
              onClick={() => navigate(`/quran/surah/${Math.min(114, surahId + 1)}`)}
              disabled={surahId >= 114}
            >
              Next Surah
            </button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onPlay={() => {}}
        onPause={() => {}}
      />
    </div>
  );
}

export default SurahPage;