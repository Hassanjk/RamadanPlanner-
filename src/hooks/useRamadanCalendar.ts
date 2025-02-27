import { useState, useEffect } from 'react';
import { getRamadanCalendar, RamadanDay } from '../services/ramadanService';
import Cookies from 'js-cookie';

interface UseRamadanCalendarProps {
  year: number;
  address?: string;
  method?: number;
}

interface UseRamadanCalendarState {
  calendar: RamadanDay[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useRamadanCalendar = ({
  year,
  address = Cookies.get('prayerLocation') || 'London, UK',
  method = Number(Cookies.get('prayerMethod')) || 3
}: UseRamadanCalendarProps): UseRamadanCalendarState => {
  const [state, setState] = useState<UseRamadanCalendarState>({
    calendar: [],
    loading: true,
    error: null,
    refresh: async () => {}
  });

  const fetchCalendar = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getRamadanCalendar(year, address, method);
      
      setState({
        calendar: data,
        loading: false,
        error: null,
        refresh: fetchCalendar
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch Ramadan calendar',
        refresh: fetchCalendar
      }));
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [year, address, method]);

  return state;
};