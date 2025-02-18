import React, { useState } from 'react';
import { Moon, ArrowLeft, Search, PlayCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Surah {
  number: number;
  name: string;
  arabicName: string;
  versesCount: number;
  type: 'مكية' | 'مدنية';
}

function Quran() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const surahs: Surah[] = [
    { number: 1, name: 'Al-Fatihah', arabicName: 'سُورَةُ ٱلْفَاتِحَةِ', versesCount: 7, type: 'مدنية' },
    { number: 2, name: 'Al-Baqarah', arabicName: 'سُورَةُ البَقَرَةِ', versesCount: 286, type: 'مكية' },
    { number: 3, name: 'Al-Imran', arabicName: 'سُورَةُ آلِ عِمۡرَانَ', versesCount: 200, type: 'مكية' },
    { number: 4, name: 'An-Nisa', arabicName: 'سُورَةُ النِّسَاءِ', versesCount: 176, type: 'مكية' },
    { number: 5, name: 'Al-Ma\'idah', arabicName: 'سُورَةُ المَائِدَةِ', versesCount: 120, type: 'مدنية' },
    { number: 6, name: 'Al-An\'am', arabicName: 'سُورَةُ الأَنۡعَامِ', versesCount: 165, type: 'مكية' },
    { number: 7, name: 'Al-A\'raf', arabicName: 'سُورَةُ الأَعۡرَافِ', versesCount: 206, type: 'مكية' },
    { number: 8, name: 'Al-Anfal', arabicName: 'سُورَةُ الأَنفَالِ', versesCount: 75, type: 'مدنية' },
  ];

  // Convert numbers to Arabic numerals
  const toArabicNumbers = (num: number): string => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
  };

  const filteredSurahs = surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabicName.includes(searchQuery)
  );

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4 font-arabic">
            القرآن الكريم
          </h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث: أدخال رقم او اسم السورة"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-emerald-800/30 text-white placeholder-gray-400 px-6 py-4 rounded-full border border-emerald-700/30 focus:border-yellow-400/50 focus:outline-none text-right font-arabic"
                dir="rtl"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSurahs.map((surah) => (
            <div 
              key={surah.number}
              className="bg-emerald-800/30 rounded-2xl p-6 backdrop-blur-sm border border-emerald-700/30 hover:border-yellow-400/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center text-yellow-400 font-arabic">
                  {toArabicNumbers(surah.number)}
                </div>
                <span className="text-sm text-yellow-400 font-arabic">{surah.type}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-1 font-arabic text-right">
                {surah.arabicName}
              </h3>
              <p className="text-yellow-400 text-sm mb-4">{surah.name}</p>
              
              <div className="flex justify-between items-center">
                <div className="text-white text-sm font-arabic">
                  عدد الآيات: {toArabicNumbers(surah.versesCount)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                    <PlayCircle className="w-6 h-6" />
                  </button>
                  <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Quran;
