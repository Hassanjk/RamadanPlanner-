import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Search, Clock, Users, ChevronLeft, ChevronRight, Heart, Utensils, Coffee, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTransition } from '../contexts/TransitionContext';
import gsap from 'gsap';
import { searchRecipes, getFeaturedRecipes } from '../services/recipeService';

interface Recipe {
  id: number;
  title: string;
  image: string;
  type: 'suhoor' | 'iftar';
  time: string;
  servings: number;
  category: string;
  calories: number;
}

interface FeaturedRecipe {
  id: number;
  title: string;
  description: string;
  image: string;
  type: 'suhoor' | 'iftar';
}

function Recipes() {
  const navigate = useNavigate();
  const { setIsTransitioning } = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'suhoor' | 'iftar'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [featuredRecipes, setFeaturedRecipes] = useState<FeaturedRecipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Fetch featured recipes on component mount
  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      setLoading(true);
      try {
        const featured = await getFeaturedRecipes();
        setFeaturedRecipes(featured);
      } catch (error) {
        console.error("Failed to load featured recipes:", error);
        // Fallback to sample data if API fails
        setFeaturedRecipes([
          {
            id: 1,
            title: "Energizing Overnight Oats",
            description: "Start your Suhoor with this nutritious and filling breakfast",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
            type: "suhoor"
          },
          {
            id: 2,
            title: "Traditional Iftar Platter",
            description: "Break your fast with dates, fruits and refreshing drinks",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=60",
            type: "iftar"
          },
          {
            id: 3,
            title: "Healthy Protein Smoothie Bowl",
            description: "Perfect pre-dawn meal to keep you energized",
            image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop&q=60",
            type: "suhoor"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedRecipes();
  }, []);

  // Fetch recipes based on search and filters
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const mealType = activeTab !== 'all' ? activeTab : undefined;
        const results = await searchRecipes(searchQuery, mealType);
        setRecipes(results);
      } catch (error) {
        console.error("Failed to search recipes:", error);
        // Fallback to sample data if API fails
        setRecipes([
          {
            id: 1,
            title: "Quinoa Power Bowl",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
            type: "suhoor",
            time: "20 mins",
            servings: 2,
            category: "Healthy",
            calories: 350
          },
          {
            id: 2,
            title: "Date and Nut Energy Balls",
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop&q=60",
            type: "suhoor",
            time: "15 mins",
            servings: 4,
            category: "Snacks",
            calories: 120
          },
          {
            id: 3,
            title: "Moroccan Harira Soup",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=60",
            type: "iftar",
            time: "45 mins",
            servings: 6,
            category: "Traditional",
            calories: 280
          },
          {
            id: 4,
            title: "Stuffed Dates with Almonds",
            image: "https://images.unsplash.com/photo-1581014023190-cee039714597?w=800&auto=format&fit=crop&q=60",
            type: "iftar",
            time: "10 mins",
            servings: 8,
            category: "Dessert",
            calories: 90
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchRecipes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredRecipes.length) % featuredRecipes.length);
  };

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
         style={{ backgroundImage: "linear-gradient(to left, rgba(20, 24, 23, 0.001), rgba(10, 14, 13, 0.002)), url('/src/assets/images/background.jpeg')" }}>
      {/* Navigation */}
      <nav className="p-4">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={handleBack} 
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
        {/* Featured Recipe Slider */}
        <div className="relative mb-12 rounded-2xl overflow-hidden h-[400px] bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/30">
          {loading && featuredRecipes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <div className="h-full relative">
              <div 
                className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredRecipes.map((recipe) => (
                  <div key={recipe.id} className="w-full flex-shrink-0 relative">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="inline-flex items-center gap-2 bg-yellow-400/90 px-4 py-1 rounded-full text-emerald-900 text-sm font-semibold mb-4">
                        {recipe.type === 'suhoor' ? (
                          <Coffee className="w-4 h-4" />
                        ) : (
                          <Utensils className="w-4 h-4" />
                        )}
                        <span className="capitalize">{recipe.type}</span>
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-2">{recipe.title}</h2>
                      <p className="text-lg text-yellow-400">{recipe.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-yellow-400/90 p-2 rounded-full text-emerald-900 hover:bg-yellow-500 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-400/90 p-2 rounded-full text-emerald-900 hover:bg-yellow-500 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-emerald-800/30 p-6 rounded-2xl backdrop-blur-sm border border-emerald-700/30">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-emerald-800/50 text-white placeholder-gray-400 px-6 py-4 rounded-full border border-emerald-700/50 focus:border-yellow-400/50 focus:outline-none"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            <div className="flex gap-2">
              {['all', 'suhoor', 'iftar'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as 'all' | 'suhoor' | 'iftar')}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    activeTab === tab 
                      ? 'bg-yellow-400 text-emerald-900' 
                      : 'bg-emerald-800/50 text-white hover:bg-emerald-800/70'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading && recipes.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center p-8 bg-emerald-800/30 rounded-2xl backdrop-blur-sm">
            <p className="text-xl text-white">No recipes found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id}
                className="bg-emerald-800/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-emerald-700/30 hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <div className="relative h-48">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button 
                    className="absolute top-4 right-4 w-10 h-10 bg-emerald-900/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating when clicking the heart
                      // Add favorite logic here
                    }}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-2 bg-yellow-400/90 px-4 py-1 rounded-full text-emerald-900 text-sm font-semibold">
                      {recipe.type === 'suhoor' ? (
                        <Coffee className="w-4 h-4" />
                      ) : (
                        <Utensils className="w-4 h-4" />
                      )}
                      <span className="capitalize">{recipe.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-yellow-400" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400">{recipe.calories} calories</span>
                    <div className="flex items-center gap-1 text-white">
                      <span className="text-sm bg-emerald-800/50 px-3 py-1 rounded-full">
                        {recipe.category}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SVG Transition Overlay */}
      <svg className="overlay fixed inset-0 pointer-events-none" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="overlay__path" vector-effect="non-scaling-stroke" d="M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z" />
      </svg>
    </div>
  );
}

export default Recipes;