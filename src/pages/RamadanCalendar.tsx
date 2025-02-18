import React, { useState } from 'react';
import { Moon, ArrowLeft, Calendar, MapPin, Download, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RamadanCalendar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('New York, USA');
  
  const calendarData = [
    { day: 1, date: '11 Mar, Mon', sehar: '05:29 AM', dhuhr: '01:37 PM', asr: '05:16 PM', iftar: '08:07 PM', isha: '09:39 PM' },
    { day: 2, date: '12 Mar, Tue', sehar: '05:30 AM', dhuhr: '01:36 PM', asr: '05:15 PM', iftar: '08:05 PM', isha: '09:37 PM' },
    { day: 3, date: '13 Mar, Wed', sehar: '05:32 AM', dhuhr: '01:36 PM', asr: '05:14 PM', iftar: '08:04 PM', isha: '09:35 PM' },
    { day: 4, date: '14 Mar, Thu', sehar: '05:33 AM', dhuhr: '01:36 PM', asr: '05:13 PM', iftar: '08:02 PM', isha: '09:33 PM' },
    { day: 5, date: '15 Mar, Fri', sehar: '05:35 AM', dhuhr: '01:36 PM', asr: '05:12 PM', iftar: '08:00 PM', isha: '09:31 PM' },
    { day: 6, date: '16 Mar, Sat', sehar: '05:36 AM', dhuhr: '01:36 PM', asr: '05:11 PM', iftar: '07:59 PM', isha: '09:29 PM' },
    { day: 7, date: '17 Mar, Sun', sehar: '05:38 AM', dhuhr: '01:35 PM', asr: '05:10 PM', iftar: '07:57 PM', isha: '09:27 PM' },
  ];

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
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Ramadan Calendar 2024</h1>
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-6 py-3 rounded-full mb-4">
            <MapPin className="w-5 h-5 text-yellow-400" />
            <span className="text-white">{location}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="max-w-4xl mx-auto mb-8 bg-emerald-800/30 rounded-2xl p-6 backdrop-blur-sm border border-emerald-700/30">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-yellow-400 text-lg font-semibold mb-2">Prayer Times Information</h3>
              <p className="text-white text-sm">
                Fiqh Jafria: Suhoor time -10min | Iftar time +10min
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Table */}
        <div className="bg-emerald-800/30 rounded-2xl backdrop-blur-sm border border-emerald-700/30 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-4 bg-emerald-800/50 text-yellow-400 font-semibold">
            <div>Day</div>
            <div>Date</div>
            <div>Sehar</div>
            <div>Dhuhr</div>
            <div>Asr</div>
            <div>Iftar</div>
            <div>Isha</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-emerald-700/30">
            {calendarData.map((row) => (
              <div key={row.day} className="grid grid-cols-7 gap-4 p-4 text-white hover:bg-emerald-800/40 transition-colors">
                <div className="font-semibold">{row.day}</div>
                <div>{row.date}</div>
                <div className="text-yellow-400">{row.sehar}</div>
                <div>{row.dhuhr}</div>
                <div>{row.asr}</div>
                <div className="text-yellow-400">{row.iftar}</div>
                <div>{row.isha}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 bg-yellow-400 text-emerald-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
            <Download className="w-5 h-5" />
            <span>Download Full Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RamadanCalendar;