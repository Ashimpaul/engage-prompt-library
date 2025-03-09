
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-accent/80 to-transparent -z-10"></div>
      <div className="absolute top-40 left-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 transform -translate-x-1/2"></div>
      <div className="absolute top-20 right-10 w-20 h-20 bg-secondary/10 rounded-full blur-xl -z-10"></div>
      
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-secondary text-sm font-medium mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>The ultimate AI prompt community</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight animate-slide-down">
          Discover, Share & Master <br />
          <span className="text-primary">AI Prompts</span> Together
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-slide-down" style={{ animationDelay: '100ms' }}>
          Join thousands of prompt engineers and enthusiasts in building
          the largest library of effective prompts for all AI models.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-down" style={{ animationDelay: '200ms' }}>
          <Link to="/browse" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary/90 transition-colors hover-lift">
            Explore Prompts
          </Link>
          <a href="#featured" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors hover-lift">
            See Featured
          </a>
        </div>
        
        {/* Search Box */}
        <div className="relative max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center glass-effect rounded-2xl p-2 card-shadow">
            <div className="bg-white rounded-l-xl border-r border-gray-100 flex items-center px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search for prompts..." 
                className="bg-transparent border-none outline-none w-full"
              />
            </div>
            <select className="bg-transparent border-none outline-none px-4 py-3 flex-grow text-gray-500">
              <option value="">All Categories</option>
              <option value="creative-writing">Creative Writing</option>
              <option value="programming">Programming</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
            </select>
            <button className="bg-primary text-white rounded-xl px-6 py-3 font-medium hover:bg-primary/90 transition-all">
              Search
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">400+</p>
            <p className="text-gray-600">Quality Prompts</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">1,200+</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">15+</p>
            <p className="text-gray-600">Categories</p>
          </div>
        </div>
        
        {/* Community badge */}
        <div className="mt-16 inline-flex items-center bg-white rounded-full px-4 py-2 border border-gray-200 card-shadow animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Users className="h-5 w-5 text-primary mr-2" />
          <span className="text-gray-800 font-medium">Join 5,000+ prompt enthusiasts</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
