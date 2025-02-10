import React, { useState } from 'react';
import { Moon, X, Menu as MenuIcon, BookOpen, ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '../contexts/TransitionContext';
import gsap from 'gsap';

function Store() {
  const navigate = useNavigate();
  const { setIsTransitioning } = useTransition();

  const handleBack = () => {
    setIsTransitioning(true);
    const timeline = gsap.timeline({
      onComplete: () => {
        navigate('/');
        setIsTransitioning(false);
      }
    });

    timeline
      .set('.overlay__path', {
        attr: { d: 'M 100 0 H 100 c 0 50 0 50 0 100 h 0 V 0 Z' }
      })
      .to('.overlay__path', {
        duration: 0.8,
        ease: 'power3.in',
        attr: { d: 'M 100 0 H 67 c 30 54 -113 65 0 100 h 33 V 0 Z' }
      })
      .to('.overlay__path', {
        duration: 0.2,
        ease: 'power1',
        attr: { d: 'M 100 0 H 0 c 0 50 0 50 0 100 h 100 V 0 Z' }
      });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat bg-emerald-900/95" 
         style={{ backgroundImage: "linear-gradient(to left, rgba(6, 95, 70, 0.95), rgba(6, 95, 70, 0.98)), url('/src/assets/images/background.jpeg')" }}>
      {/* Navigation - Simplified */}
      <nav className="absolute top-0 left-0 right-0 p-4 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={handleBack} 
            className="text-yellow-400 flex items-center gap-2 hover:text-yellow-500 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg">Back to Home</span>
          </button>

          {/* Logo */}
          <div className="w-12 h-12 md:w-16 md:h-16">
            <div className="w-full h-full rounded-full bg-yellow-400/90 flex items-center justify-center">
              <Moon className="text-emerald-900 w-8 h-8 md:w-12 md:h-12" />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Book Preview - Larger Size */}
          <div className="relative flex justify-center">
            <div className="w-[420px] aspect-[4/5] bg-white rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1597505495109-7fc35bb64d8e?w=800&auto=format&fit=crop&q=90" 
                alt="Ramadan Guide Book Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-3">Ramadan Guide</h3>
                <p className="text-yellow-400 text-lg">Your Complete Guide to a Blessed Month</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-6 text-yellow-400">
              The Ultimate Ramadan Planner
            </h1>

            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Star key={index} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-yellow-400 ml-2">5.0 (500+ reviews)</span>
            </div>

            <div className="space-y-6 mb-8">
              <p className="text-xl">
                Transform your Ramadan experience with our comprehensive planner designed to help you make the most of this blessed month.
              </p>

              <ul className="space-y-4">
                {[
                  'Daily prayer and fasting tracker',
                  'Meal planning and healthy recipes',
                  'Quran reading schedule',
                  'Daily duas and reflections',
                  'Goal setting and progress tracking',
                  'Ramadan traditions and teachings'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-yellow-400">$24.99</span>
                <span className="text-xl line-through text-gray-400">$39.99</span>
                <span className="bg-yellow-400 text-emerald-900 px-3 py-1 rounded-full text-sm font-semibold">
                  37% OFF
                </span>
              </div>

              <button className="w-full bg-yellow-400 text-emerald-900 px-8 py-4 rounded-full font-semibold text-xl hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Get Your Copy Now</span>
              </button>

              <p className="text-center text-sm text-gray-300">
                *Digital download available immediately after purchase
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Transition Overlay */}
      <svg className="overlay fixed inset-0 pointer-events-none" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="overlay__path" vector-effect="non-scaling-stroke" d="M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z" />
      </svg>
    </div>
  );
}

export default Store;