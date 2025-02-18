import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Store from './pages/Store';
import PrayerTimings from './pages/PrayerTimings';
import RamadanCalendar from './pages/RamadanCalendar';
import Quran from './pages/Quran';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/store" element={<Store />} />
        <Route path="/prayer-timings" element={<PrayerTimings />} />
        <Route path="/ramadan-calendar" element={<RamadanCalendar />} />
        <Route path="/quran" element={<Quran />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;