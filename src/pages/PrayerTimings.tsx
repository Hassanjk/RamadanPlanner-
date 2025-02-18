import React, { useState } from 'react';
import { Moon, MapPin, Bell, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PrayerTimings() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('New York, USA');
  
  const prayerTimes = [
    { name: 'Fajr', time: '5:14 AM', arabicName: 'الفجر' },
    { name: 'Sunrise', time: '6:45 AM', arabicName: 'الشروق' },
    { name: 'Dhuhr', time: '12:30 PM', arabicName: 'الظهر' },
    { name: 'Asr', time: '3:45 PM', arabicName: 'العصر' },
    { name: 'Maghrib', time: '6:15 PM', arabicName: 'المغرب' },
    { name: 'Isha', time: '7:45 PM', arabicName: 'العشاء' }
  ];

  const currentDate = new Date();
  const islamicDate = '19 Shaban, 1446';

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat bg-emerald-900/95" 
         style={{ backgroundImage: "linear-gradient(to left, rgba(20, 24, 23, 0.001), rgba(10, 14, 13, 0.002)), url('/src/assets/images/background.jpeg')" }}>
      {/* Navigation */}
      <nav className="p-4">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="text-yellow-400 flex items-center gap-2 hover:text-yellow-500 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg">Back to Home</span>
          </button>
          
          <div className="w-12 h-12">
            <div className="w-full h-full rounded-full bg-yellow-400/90 flex items-center justify-center">
              <Moon className="text-emerald-900 w-8 h-8" />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Location and Date Header - Moved to top */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-6 py-3 rounded-full mb-4">
            <MapPin className="w-5 h-5 text-yellow-400" />
            <span className="text-white">{location}</span>
          </div>
          
          <div className="flex justify-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <span>{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <span className="text-yellow-400">|</span>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-yellow-400" />
              <span>{islamicDate}</span>
            </div>
          </div>
        </div>

        {/* Next Prayer Countdown */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto bg-emerald-800/30 rounded-2xl p-8 backdrop-blur-sm border border-emerald-700/30">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-xl text-yellow-400 mb-2">Next Prayer</h2>
                <div className="text-4xl font-bold text-white">Asr</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400">02:45:33</div>
                <div className="text-white mt-2">Until Asr Prayer</div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-xl text-white mb-1">Current Time</div>
                <div className="text-2xl text-yellow-400">1:14 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {prayerTimes.map((prayer, index) => (
            <div 
              key={prayer.name}
              className="bg-emerald-800/30 rounded-2xl p-6 backdrop-blur-sm border border-emerald-700/30 hover:border-yellow-400/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{prayer.name}</h3>
                  <p className="text-yellow-400 text-lg">{prayer.arabicName}</p>
                </div>
                <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                  <Bell className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-3xl font-bold text-white">{prayer.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrayerTimings;