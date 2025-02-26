import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPage, QuranVerse } from '../services/quranService';
import Cookies from 'js-cookie';

interface QuranReaderProps {
  initialPage?: number;
  initialAyah?: number;
}

const QuranReader: React.FC<QuranReaderProps> = ({ initialPage = 1, initialAyah = 0 }) => {
  const [page, setPage] = useState(initialPage);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [currentVerse, setCurrentVerse] = useState<number>(initialAyah);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reader, setReader] = useState('ar.alafasy');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(100);
  const [repeatMode, setRepeatMode] = useState<'page' | 'verse' | 'none'>('none');
  const [verseRepeatCount, setVerseRepeatCount] = useState(2);
  const [currentRepeat, setCurrentRepeat] = useState(0);

  useEffect(() => {
    loadPage();
  }, [page, reader]);

  const loadPage = async () => {
    try {
      setIsLoading(true);
      const data = await getPage(page, reader);
      setVerses(data.ayahs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading page:', error);
      setIsLoading(false);
    }
  };

  const playVerse = async (index: number) => {
    if (!verses[index]) return;
    
    setCurrentVerse(index);
    if (audioRef.current) {
      audioRef.current.src = verses[index].audio;
      audioRef.current.volume = volume / 100;
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnd = () => {
    if (repeatMode === 'verse' && currentRepeat < verseRepeatCount - 1) {
      setCurrentRepeat(prev => prev + 1);
      playVerse(currentVerse);
    } else {
      setCurrentRepeat(0);
      if (currentVerse < verses.length - 1) {
        if (repeatMode === 'page' || repeatMode === 'none') {
          playVerse(currentVerse + 1);
        }
      } else if (repeatMode === 'page') {
        playVerse(0);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const saveProgress = () => {
    Cookies.set('quranPage', page.toString(), { expires: 360 });
    Cookies.set('quranVerse', currentVerse.toString(), { expires: 360 });
  };

  return (
    <div className="relative">
      {/* Audio Controls */}
      <div className="sticky top-0 bg-emerald-900/90 backdrop-blur-sm border-b border-yellow-400/20 p-4 z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setRepeatMode(mode => mode === 'page' ? 'none' : 'page')}
              className={`text-yellow-400 hover:text-yellow-500 transition-colors ${
                repeatMode === 'page' ? 'bg-yellow-400/20' : ''
              }`}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="text-yellow-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-yellow-400">Page {page}</span>
            <button
              onClick={() => setPage(p => Math.min(604, p + 1))}
              disabled={page >= 604}
              className="text-yellow-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={saveProgress}
            className="text-yellow-400 hover:text-yellow-500 transition-colors px-4 py-2 border border-yellow-400 rounded-full"
          >
            Save Progress
          </button>
        </div>
      </div>

      {/* Verses */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {verses.map((verse, index) => (
          <div
            key={verse.number}
            onClick={() => playVerse(index)}
            className={`p-6 cursor-pointer transition-colors ${
              currentVerse === index
                ? 'bg-emerald-800/40'
                : 'hover:bg-emerald-800/20'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400">
                {verse.numberInSurah}
              </div>
              {verse.surah.number === 1 || verse.numberInSurah === 1 ? (
                <div className="text-yellow-400 text-lg">
                  {verse.surah.name} - {verse.surah.englishName}
                </div>
              ) : null}
            </div>
            <p className="text-white text-right font-arabic text-2xl leading-loose">
              {verse.text}
            </p>
          </div>
        ))}
      </div>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default QuranReader;