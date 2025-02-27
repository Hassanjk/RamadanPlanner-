import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Search, Clock, Users, Heart, Utensils, Coffee, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '../contexts/TransitionContext';
import gsap from 'gsap';
import { searchRecipes } from '../services/recipeService';
import { containsNonHalalTerms, getNonHalalWarning } from '../utils/halalFilter';
// Import the image properly
import backgroundImage from '../assets/images/background.jpeg';

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

function Recipes() {
  const navigate = useNavigate();
  const { setIsTransitioning } = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'suhoor' | 'iftar'>('all');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Fetch recipes based on search and filters
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setWarning(null);
      
      try {
        // Check if query contains non-halal terms
        if (containsNonHalalTerms(searchQuery)) {
          const warningMessage = getNonHalalWarning(searchQuery);
          setWarning(warningMessage);
        }
        
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

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

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

  const toggleFavorite = (e: React.MouseEvent, recipeId: number) => {
    e.stopPropagation(); // Prevent navigating when clicking the heart
    
    let newFavorites: number[];
    if (favorites.includes(recipeId)) {
      newFavorites = favorites.filter(id => id !== recipeId);
    }
  }
}