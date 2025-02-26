import { useState, useEffect, useRef } from 'react';
import { getSurah, getPage, QuranVerse, SurahResponse } from '../services/quranService';
import Cookies from 'js-cookie';

interface QuranReaderProps {
  initialPage?: number;
  initialAyah?: number;
  surahNumber?: number;
  mode?: 'page' | 'surah';
}

const QuranReader = ({ 
  initialPage = 1, 
  initialAyah = 0, 
  surahNumber,
  mode = 'page'
}: QuranReaderProps) => {
  const [page, setPage] = useState(initialPage);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [currentVerse, setCurrentVerse] = useState<number>(initialAyah);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [reader, setReader] = useState('ar.alafasy');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(100);
  const [repeatMode, setRepeatMode] = useState<'page' | 'verse' | 'none'>('none');
  const [verseRepeatCount, setVerseRepeatCount] = useState(2);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [surahInfo, setSurahInfo] = useState<{
    name: string;
    englishName: string;
    numberOfAyahs: number;
    revelationType: string;
  } | null>(null);

  useEffect(() => {
    // Reset loading state when surah or page changes
    setIsLoading(true);
    
    if (mode === 'page') {
      loadPage();
    } else if (mode === 'surah' && surahNumber) {
      loadSurah();
    }
    
    // Load bookmarks from cookies
    const savedBookmarks = Cookies.get('quranBookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Error parsing bookmarks:', e);
      }
    }
  }, [page, reader, surahNumber, mode]);

  const loadPage = async () => {
    try {
      setIsLoading(true);
      const data = await getPage(page, reader);
      if (data && data.ayahs) {
        setVerses(data.ayahs);
        if (data.ayahs.length > 0) {
          setSurahInfo({
            name: data.ayahs[0].surah.name,
            englishName: data.ayahs[0].surah.englishName,
            numberOfAyahs: data.ayahs.length,
            revelationType: data.ayahs[0].surah.revelationType
          });
        }
      } else {
        setVerses([]);
        console.error("Invalid page data format", data);
      }
    } catch (error) {
      console.error('Error loading page:', error);
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSurah = async () => {
    if (!surahNumber) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const ayahs = await getSurah(surahNumber, reader);
      
      if (ayahs && ayahs.length > 0) {
        setVerses(ayahs);
        
        // Get surah info from the first ayah
        const firstVerse = ayahs[0];
        if (firstVerse && firstVerse.surah) {
          setSurahInfo({
            name: firstVerse.surah.name,
            englishName: firstVerse.surah.englishName,
            numberOfAyahs: ayahs.length,
            revelationType: firstVerse.surah.revelationType
          });
        } else {
          // Fallback if surah info is not available
          setSurahInfo({
            name: `Surah ${surahNumber}`,
            englishName: `Surah ${surahNumber}`,
            numberOfAyahs: ayahs.length,
            revelationType: ""
          });
        }
      } else {
        setVerses([]);
        console.error("No ayahs returned for surah", surahNumber);
      }
    } catch (error) {
      console.error(`Error loading surah ${surahNumber}:`, error);
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const playVerse = async (index: number) => {
    if (!verses || !verses[index]) return;
    
    setCurrentVerse(index);
    if (audioRef.current) {
      audioRef.current.src = verses[index].audio;
      audioRef.current.volume = volume / 100;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio playback error:", error);
        setIsPlaying(false);
      }
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
    if (mode === 'page') {
      Cookies.set('quranPage', page.toString(), { expires: 360 });
    } else if (mode === 'surah' && surahNumber) {
      Cookies.set('quranSurah', surahNumber.toString(), { expires: 360 });
    }
    
    if (currentVerse !== undefined) {
      Cookies.set('quranVerse', currentVerse.toString(), { expires: 360 });
    }
  };

  const toggleBookmark = (verseId: string) => {
    const newBookmarks = [...bookmarks];
    const index = newBookmarks.indexOf(verseId);
    
    if (index === -1) {
      newBookmarks.push(verseId);
    } else {
      newBookmarks.splice(index, 1);
    }
    
    setBookmarks(newBookmarks);
    Cookies.set('quranBookmarks', JSON.stringify(newBookmarks), { expires: 360 });
  };

  const isBookmarked = (verseId: string) => {
    return bookmarks.includes(verseId);
  };

  const changeReciter = (reciterId: string) => {
    setReader(reciterId);
  };

  const nextPage = () => {
    setPage(prev => Math.min(604, prev + 1));
  };

  const prevPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  return {
    verses,
    currentVerse,
    isPlaying,
    isLoading,
    volume,
    repeatMode,
    reader,
    surahInfo,
    playVerse,
    togglePlayPause,
    setVolume,
    setRepeatMode,
    saveProgress,
    toggleBookmark,
    isBookmarked,
    changeReciter,
    nextPage,
    prevPage,
    audioRef,
    handleAudioEnd
  };
};

export default QuranReader;