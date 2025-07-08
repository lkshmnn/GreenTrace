
import type { AppScreen } from "../../../shared/schema";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Menu, X, Sun, Moon, LogOut } from "lucide-react";

interface HeaderProps {
  onNavigate: (screen: AppScreen) => void;
  onLogout: () => void;
  currentScreen: AppScreen;
}

export function Header({ onNavigate, onLogout, currentScreen }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast({
      title: newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled',
      description: `You are now using ${newTheme} theme.`,
    });
  };

  const handleNavClick = (screen: AppScreen) => {
    onNavigate(screen);
    setIsMenuOpen(false);
  };

  const isActive = (screen: AppScreen) => currentScreen === screen;

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been signed out.",
    });
    onLogout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">GreenTrace AI</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sustainability Tracker</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('dashboard') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleNavClick('activity')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('activity') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Activities
            </button>
            
            <button 
              onClick={() => handleNavClick('challenges')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('challenges') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Challenges
            </button>
            <button 
              onClick={() => handleNavClick('scanner')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('scanner') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              AR Scanner
            </button>
            <button 
              onClick={() => handleNavClick('social')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('social') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Community
            </button>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Level 8
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              2,450 pts
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {isDark
                ? <Sun className="h-4 w-4 text-yellow-400" />
                : <Moon className="h-4 w-4 text-gray-700" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-9 h-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden w-9 h-9 p-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => handleNavClick('dashboard')}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('dashboard') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavClick('activity')}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('activity') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Activities
              </button>
              
              <button 
                onClick={() => handleNavClick('challenges')}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('challenges') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Challenges
              </button>
              <button 
                onClick={() => handleNavClick('scanner')}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('scanner') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                AR Scanner
              </button>
              <button 
                onClick={() => handleNavClick('social')}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('social') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Community
              </button>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Level 8
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    2,450 pts
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-9 h-9 p-0"
                  >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="w-9 h-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}