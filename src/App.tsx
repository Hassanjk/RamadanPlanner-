import React, { useState } from 'react';
import { Moon, X, Menu, Facebook, Youtube, Twitter, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from './contexts/TransitionContext';
import gsap from 'gsap';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsTransitioning } = useTransition();

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

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url('/src/assets/images/ramadan.jpeg')" }}>
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
              <a href="#" className="text-white">Recipe</a>
              <button 
                onClick={() => handleNavigation('/store')}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Store
              </button>
              <button className="bg-yellow-400 text-emerald-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                Sign Up
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
                <a href="#" className="text-white">Recipe</a>
                <button 
                  onClick={() => handleNavigation('/store')}
                  className="text-white hover:text-yellow-400 transition-colors text-left"
                >
                  Store
                </button>
                <button className="bg-yellow-400 text-emerald-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                  Sign Up
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

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base">
                  <span>1 Ramadan</span>
                </div>
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base">
                  <span>23 March</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 md:mb-12">
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base">
                  <span>2:09 AM Suhoor</span>
                </div>
                <div className="bg-transparent border border-yellow-400 rounded-full px-4 md:px-6 py-2 text-white text-sm md:text-base">
                  <span>6:14 PM Iftar</span>
                </div>
              </div>

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