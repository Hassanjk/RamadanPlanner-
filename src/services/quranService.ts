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
    return response.data.data.ayahs;
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