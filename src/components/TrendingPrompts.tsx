
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import PromptCard from './PromptCard';
import { getTrendingPrompts } from '../lib/data';

const TrendingPrompts = () => {
  const trendingPrompts = getTrendingPrompts();

  return (
    <section className="py-20 px-4 sm:px-6 bg-accent/30">
      <div className="layout-container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <p className="text-gray-600 max-w-2xl">
              See what's popular in the community right now. These prompts are gaining traction fast!
            </p>
          </div>
          <Link to="/browse" className="hidden md:flex items-center text-primary hover:text-primary/80 transition-colors">
            <span className="font-medium">View all</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingPrompts.map((prompt) => (
            <div key={prompt.id} className="animate-on-scroll">
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link 
            to="/browse" 
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-primary rounded-full text-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View all prompts
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingPrompts;
