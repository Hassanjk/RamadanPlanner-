import axios from 'axios';

// Base API URL
const API_URL = 'https://api.alquran.cloud/v1';

export interface QuranVerse {
  number: number;
  text: string;
  numberInSurah: number;
  audio: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
  };
}

export interface QuranPage {
  number: number;
  ayahs: QuranVerse[];
}

export interface SurahResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: QuranVerse[];
}

export const getPage = async (pageNumber: number, reciter: string = 'ar.alafasy'): Promise<QuranPage> => {
  try {
    const response = await axios.get(`${API_URL}/page/${pageNumber}/${reciter}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Quran page:', error);
    throw error;
  }
};

export const getSurah = async (surahNumber: number, reciter: string = 'ar.alafasy'): Promise<QuranVerse[]> => {
  try {
    const response = await axios.get(`${API_URL}/surah/${surahNumber}/${reciter}`);
    
    // Make sure to properly map the response, adding surah info to each verse
    if (response.data && response.data.data && response.data.data.ayahs) {
      const surahData = response.data.data;
      
      // Attach surah info to each verse for easier access later
      return surahData.ayahs.map((ayah: any) => ({
        ...ayah,
        surah: {
          number: surahData.number,
          name: surahData.name,
          englishName: surahData.englishName,
          revelationType: surahData.revelationType
        }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw error;
  }
};

export const getAllSurahs = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/surah`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};