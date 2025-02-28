import React, { useState, useEffect } from 'react';
import { Moon, X, Menu, Facebook, Youtube, Twitter, BookOpen, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from './contexts/TransitionContext';
import gsap from 'gsap';
import { useGeolocation } from './hooks/useGeolocation';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { formatPrayerTime } from './services/prayerService';
import Cookies from 'js-cookie';
// Import the image properly
import ramadanBg from './assets/images/ramadan.jpeg';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);
  const [locationName, setLocationName] = useState('');
  const navigate = useNavigate();
  const { setIsTransitioning } = useTransition();

  // Get user's geolocation with high accuracy
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  });
  
  // Get prayer times based on location
  const { 
    prayerTimes, 
    nextPrayer, 
    date, 
    meta,
    loading: prayerTimesLoading, 
    error: prayerTimesError 
  } = usePrayerTimes({
    latitude: geolocation.latitude,
    longitude: geolocation.longitude
  });

  // Request location permission as soon as the component mounts
  useEffect(() => {
    if (!locationPermissionRequested && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback - permission granted
          setLocationPermissionRequested(true);
          
          // Save location to cookies for use in other components
          Cookies.set('useGeolocation', 'true', { expires: 365 });
        },
        (error) => {
          // Error callback - permission denied or error
          console.error("Error getting geolocation:", error);
          setLocationPermissionRequested(true);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }
  }, [locationPermissionRequested]);

  // Get location name using reverse geocoding when coordinates are available
  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${geolocation.latitude}&lon=${geolocation.longitude}&zoom=10`)
        .then(response => response.json())
        .then(data => {
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
          const country = data.address?.country || '';
          const locationString = `${city}, ${country}`.trim();
          setLocationName(locationString);
          
          // Save location to cookies for use in other components
          if (locationString) {
            Cookies.set('prayerLocation', locationString, { expires: 365 });
          }
        })
        .catch(error => {
          console.error("Error getting location name:", error);
        });
    }
  }, [geolocation.latitude, geolocation.longitude]);

  const handleNavigation = (path: string) => {
    setIsTransitioning(true);
    const timeline = gsap.timeline({
      onComplete: () => {
        navigate(path);
        setIsTransitioning(false);
      }
    });

    timeline
      .set('.overlay__path', {
        attr: { d: 'M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z' }
      })
      .to('.overlay__path', { 
        duration: 0.8,
        ease: 'power3.in',
        attr: { d: 'M 0 0 h 33 c -30 54 113 65 0 100 H 0 V 0 Z' }
      })
      .to('.overlay__path', { 
        duration: 0.2,
        ease: 'power1',
        attr: { d: 'M 0 0 h 100 c 0 50 0 50 0 100 H 0 V 0 Z' }
      });
  };

  // Get the current Hijri date directly from API response
  const getHijriDate = () => {
    if (!date?.hijri) return "29 Shaʿbān, 1446"; // Default fallback
    return date.hijri;
  };

  // Get formatted date
  const getFormattedDate = () => {
    if (!date?.gregorian) {
      const now = new Date();
      return `${now.getDate()} ${now.toLocaleString('default', { month: 'long' })}`;
    }
    
    const parts = date.gregorian.split('-');
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const month = new Date(0, parseInt(parts[1]) - 1).toLocaleString('default', { month: 'long' });
      return `${day} ${month}`;
    }
    
    return date.gregorian;
  };

  // Get Suhoor time (Fajr)
  const getSuhoorTime = () => {
    if (!prayerTimes) return "2:09 AM";
    return formatPrayerTime(prayerTimes.Fajr);
  };

  // Get Iftar time (Maghrib)
  const getIftarTime = () => {
    if (!prayerTimes) return "6:14 PM";
    return formatPrayerTime(prayerTimes.Maghrib);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url(${ramadanBg})` }}>
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 p-4 z-50">
          <div className="container mx-auto flex items-center justify-between md:justify-center relative">
            <div className="w-12 h-12 md:w-16 md:h-16 relative md:absolute md:left-0">
              <div className="w-full h-full rounded-full bg-yellow-400/90 flex items-center justify-center">
                <Moon className="text-emerald-900 w-8 h-8 md:w-12 md:h-12" />
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-12">
              <a href="#" className="text-white border-b-2 border-white">Home</a>
              <button 
                onClick={() => handleNavigation('/ramadan-calendar')}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Calendar
              </button>
              <button 
                onClick={() => handleNavigation('/prayer-timings')}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Prayer Timings
              </button>
              <button 
                onClick={() => handleNavigation('/quran')}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Quran
              </button>
              <button 
                onClick={() => handleNavigation('/recipes')}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Recipe
              </button>
              <button 
                onClick={() => handleNavigation('/store')}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Store
              </button>
              <button className="bg-yellow-400 text-emerald-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                Support Us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-emerald-900/95 border-t border-yellow-400/20 p-4">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-white border-b-2 border-white w-fit">Home</a>
                <button 
                  onClick={() => handleNavigation('/ramadan-calendar')}
                  className="text-white hover:text-yellow-400 transition-colors text-left"
                >
                  Calendar
                </button>
                <button 
                  onClick={() => handleNavigation('/prayer-timings')}
                  className="text-white hover:text-yellow-400 transition-colors text-left"
                >
                  Prayer Timings
                </button>
                <button 
                  onClick={() => handleNavigation('/quran')}
                  className="text-white hover:text-yellow-400 transition-colors text-left"
                >
                  Quran
                </button>
                <button 
                  onClick={() => handleNavigation('/recipes')}
                  className="text-white hover:text-yellow-400 transition-colors text-left"
                >
                  Recipe
                </button>
                <button 
                  onClick={() => handleNavigation('/store')}
                  className="text-white hover:text-yellow-400 transition-colors text-left"
                >
                  Store
                </button>
                <button className="bg-yellow-400 text-emerald-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                  Support Us
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <div className="container mx-auto pt-24 md:pt-32 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col justify-center text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-8">
                Ramadan Kareem
              </h1>

              {/* Location indicator if available */}
              {!geolocation.loading && !geolocation.error && geolocation.latitude && (
                <div className="flex justify-center md:justify-start mb-4">
                  <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-white text-sm">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <span>
                      {prayerTimesLoading ? 'Loading location...' : 
                       locationName || (meta?.timezone ? meta.timezone.replace('/', ', ') : 'Your location')}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base">
                  <span>{getHijriDate()}</span>
                </div>
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base">
                  <span>{getFormattedDate()}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 md:mb-12">
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span>{getSuhoorTime()} Suhoor</span>
                </div>
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span>{getIftarTime()} Iftar</span>
                </div>
              </div>

              {/* Next Prayer Indicator */}
              {nextPrayer && (
                <div className="bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-4 mb-8 md:mb-12 max-w-xl mx-auto md:mx-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-400 text-sm">Next Prayer</p>
                      <h3 className="text-white text-xl font-semibold">{nextPrayer.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">Time Remaining</p>
                      <p className="text-yellow-400 text-xl font-bold">{nextPrayer.timeRemaining}</p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-white text-lg md:text-2xl mb-8 md:mb-12 max-w-xl mx-auto md:mx-0">
                Happy Fasting To All Muslim Around The World. May all your prayers be answered this Ramadan and always.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => handleNavigation('/store')}
                  className="bg-yellow-400 text-emerald-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Get Ramadan Tips Book Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="fixed right-4 bottom-4 flex flex-col gap-4">
          <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400/90 rounded-full flex items-center justify-center">
            <Facebook className="w-4 h-4 md:w-6 md:h-6 text-emerald-900" />
          </a>
          <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400/90 rounded-full flex items-center justify-center">
            <Youtube className="w-4 h-4 md:w-6 md:h-6 text-emerald-900" />
          </a>
          <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400/90 rounded-full flex items-center justify-center">
            <Twitter className="w-4 h-4 md:w-6 md:h-6 text-emerald-900" />
          </a>
        </div>
      </div>

      {/* SVG Transition Overlay */}
      <svg className="overlay fixed inset-0 pointer-events-none" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="overlay__path" vector-effect="non-scaling-stroke" d="M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z" />
      </svg>
    </div>
  );
}

export default App;