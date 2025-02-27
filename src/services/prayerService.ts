import axios from 'axios';

// Base API URL for Aladhan API
const API_URL = 'https://api.aladhan.com/v1';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  [key: string]: string;
}

export interface PrayerTimesResponse {
  timings: PrayerTimes;
  date: {
    readable: string;
    timestamp: string;
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string };
      month: { number: number; en: string };
      year: string;
    };
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { number: number; en: string; ar: string };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
      params: {
        Fajr: number;
        Isha: number;
      };
      location: {
        latitude: number;
        longitude: number;
      };
    };
    latitudeAdjustmentMethod: string;
    midnightMode: string;
    school: string;
    offset: Record<string, number>;
  };
}

export interface CalculationMethod {
  id: number;
  name: string;
  description?: string;
}

// Available calculation methods
export const calculationMethods: CalculationMethod[] = [
  { id: 0, name: 'Shia Ithna-Ashari', description: 'Leva Institute, Qum' },
  { id: 1, name: 'University of Islamic Sciences, Karachi', description: 'Fajr: 18°, Isha: 18°' },
  { id: 2, name: 'Islamic Society of North America (ISNA)', description: 'Fajr: 15°, Isha: 15°' },
  { id: 3, name: 'Muslim World League', description: 'Fajr: 18°, Isha: 17°' },
  { id: 4, name: 'Umm Al-Qura University, Makkah', description: 'Fajr: 18.5°, Isha: 90 min after Maghrib' },
  { id: 5, name: 'Egyptian General Authority of Survey', description: 'Fajr: 19.5°, Isha: 17.5°' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran', description: 'Fajr: 17.7°, Isha: 14°' },
  { id: 8, name: 'Gulf Region', description: 'Fajr: 19.5°, Isha: 90 min after Maghrib' },
  { id: 9, name: 'Kuwait', description: 'Fajr: 18°, Isha: 17.5°' },
  { id: 10, name: 'Qatar', description: 'Fajr: 18°, Isha: 90 min after Maghrib' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore', description: 'Fajr: 20°, Isha: 18°' },
  { id: 12, name: 'Union Organization Islamic de France', description: 'Fajr: 12°, Isha: 12°' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey', description: 'Fajr: 18°, Isha: 17°' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia', description: 'Fajr: 16°, Isha: 15°' },
  { id: 15, name: 'Moonsighting Committee Worldwide', description: 'Fajr: 18°, Isha: 18°' },
  { id: 16, name: 'Dubai, UAE', description: 'Fajr: 18.2°, Isha: 18.2°' }
];

// Common API request parameters
interface ApiParams {
  method?: number; // Calculation method
  latitudeAdjustmentMethod?: number; // 1 = Middle of Night, 2 = Seventh of Night, 3 = Angle Based
  school?: number; // 0 = Shafi (Standard), 1 = Hanafi
  adjustment?: number; // Adjustments in minutes
  tune?: string; // Comma separated string of tune values for imsak, fajr, sunrise, dhuhr, asr, maghrib, sunset, isha, midnight
  midnightMode?: number; // 0 = Standard (Mid Sunset to Sunrise), 1 = Jafari (Mid Sunset to Fajr)
  timezonestring?: string; // e.g., 'Europe/London'
  iso8601?: boolean; // Use ISO 8601 date format
}

// Format date for API call (DD-MM-YYYY)
const formatDate = (date?: string | Date): string => {
  const d = date ? new Date(date) : new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

// Format prayer time from API response
export const formatPrayerTime = (time: string): string => {
  if (!time) return '';
  
  // Handle various time formats
  const timeParts = time.split(':');
  if (timeParts.length < 2) return time;
  
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1].substring(0, 2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  
  return `${hours}:${minutes} ${ampm}`;
};

// Base URL for the Al-Adhan API
const API_BASE_URL = 'https://api.aladhan.com/v1';

// Common parameters for all API calls
const getDefaultParams = (
  date?: string | Date,
  method?: number,
  adjustments?: string
): ApiParams => {
  const params: ApiParams = {
    method: method || 3, // Default to Muslim World League
    latitudeAdjustmentMethod: 3, // Default to Angle Based
    school: 0, // Default to Shafi (Standard)
    adjustment: 1, // Default adjustment
    midnightMode: 0, // Default to Standard
  };
  
  if (adjustments) {
    params.tune = adjustments;
  }
  
  return params;
};

// Get prayer times by coordinates
export const getPrayerTimesByCoordinates = async (
  latitude: number,
  longitude: number,
  date?: string | Date,
  method?: number,
  adjustments?: string
): Promise<PrayerTimesResponse> => {
  const formattedDate = formatDate(date);
  const params = getDefaultParams(date, method, adjustments);
  
  const url = new URL(`${API_BASE_URL}/timings/${formattedDate}`);
  url.searchParams.append('latitude', latitude.toString());
  url.searchParams.append('longitude', longitude.toString());
  
  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
};

// Get prayer times by city and country
export const getPrayerTimesByCity = async (
  city: string,
  country: string,
  date?: string | Date,
  method?: number,
  adjustments?: string
): Promise<PrayerTimesResponse> => {
  const formattedDate = formatDate(date);
  const params = getDefaultParams(date, method, adjustments);
  
  const url = new URL(`${API_BASE_URL}/timingsByCity/${formattedDate}`);
  url.searchParams.append('city', city);
  url.searchParams.append('country', country);
  
  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
};

// Get prayer times by address
export const getPrayerTimesByAddress = async (
  address: string,
  date?: string | Date,
  method?: number,
  adjustments?: string
): Promise<PrayerTimesResponse> => {
  const formattedDate = formatDate(date);
  const params = getDefaultParams(date, method, adjustments);
  
  const url = new URL(`${API_BASE_URL}/timingsByAddress/${formattedDate}`);
  url.searchParams.append('address', address);
  
  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
};

// Get prayer times calendar for a month
export const getPrayerCalendar = async (
  year: number,
  month: number,
  latitude: number,
  longitude: number,
  method: number = 3,
  adjustments?: string
): Promise<PrayerTimesResponse[]> => {
  try {
    const params: Record<string, any> = {
      latitude,
      longitude,
      method,
      month,
      year
    };

    if (adjustments) {
      params.tune = adjustments;
    }

    const response = await axios.get(`${API_URL}/calendar`, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching prayer calendar:', error);
    throw new Error('Failed to fetch prayer calendar. Please try again later.');
  }
};

// Get the next prayer time
export const getNextPrayer = (prayerTimes: PrayerTimes): { name: string; time: string; timeRemaining: string } => {
  const now = new Date();
  const prayers = [
    { name: 'Fajr', time: prayerTimes.Fajr },
    { name: 'Sunrise', time: prayerTimes.Sunrise },
    { name: 'Dhuhr', time: prayerTimes.Dhuhr },
    { name: 'Asr', time: prayerTimes.Asr },
    { name: 'Maghrib', time: prayerTimes.Maghrib },
    { name: 'Isha', time: prayerTimes.Isha }
  ];

  // Convert prayer times to Date objects
  const prayerDateTimes = prayers.map(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerDate = new Date(now);
    prayerDate.setHours(hours, minutes, 0, 0);
    return { ...prayer, dateTime: prayerDate };
  });

  // Find the next prayer
  const nextPrayer = prayerDateTimes.find(prayer => prayer.dateTime > now) || prayerDateTimes[0];
  
  // If all prayers for today have passed, the next prayer is Fajr tomorrow
  if (nextPrayer === prayerDateTimes[0] && now > prayerDateTimes[0].dateTime) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(
      parseInt(prayerTimes.Fajr.split(':')[0]), 
      parseInt(prayerTimes.Fajr.split(':')[1]), 
      0, 0
    );
    
    const timeDiff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return {
      name: 'Fajr',
      time: prayerTimes.Fajr,
      timeRemaining: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  }

  // Calculate time remaining until next prayer
  const timeDiff = nextPrayer.dateTime.getTime() - now.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return {
    name: nextPrayer.name,
    time: nextPrayer.time,
    timeRemaining: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  };
};