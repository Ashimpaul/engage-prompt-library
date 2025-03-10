import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Plus, LogIn, LogOut } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass-effect card-shadow' : 'py-5 bg-transparent'
      }`}
    >
      <div className="layout-container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${isScrolled ? 'text-primary' : 'text-primary'}`}>
            PromptVerse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : ''}`}>
            Home
          </Link>
          <Link to="/browse" className={`font-medium transition-colors hover:text-primary ${location.pathname === '/browse' ? 'text-primary' : ''}`}>
            Browse
          </Link>
          <Link to="/create" className="font-medium flex items-center space-x-1 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create Prompt</span>
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search prompts..."
              className="pl-10 pr-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 w-60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Search 
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer" 
              onClick={handleSearch}
            />
          </div>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user?.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-prompts" className="cursor-pointer">My Prompts</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 cursor-pointer flex items-center"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect animate-fade-in py-4 px-6 mt-1">
          <div className="flex flex-col space-y-4">
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search prompts..."
                className="pl-10 pr-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search 
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer" 
                onClick={handleSearch}
              />
            </div>
            <Link to="/" className={`font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : ''}`}>
              Home
            </Link>
            <Link to="/browse" className={`font-medium transition-colors hover:text-primary ${location.pathname === '/browse' ? 'text-primary' : ''}`}>
              Browse
            </Link>
            <Link to="/create" className={`font-medium flex items-center space-x-1 ${location.pathname === '/create' ? 'text-primary' : ''}`}>
              <Plus className="h-4 w-4" />
              <span>Create Prompt</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="font-medium transition-colors hover:text-primary">
                  Profile
                </Link>
                <Link to="/my-prompts" className="font-medium transition-colors hover:text-primary">
                  My Prompts
                </Link>
                <button 
                  onClick={logout}
                  className="font-medium flex items-center space-x-1 text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="font-medium flex items-center space-x-1"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
