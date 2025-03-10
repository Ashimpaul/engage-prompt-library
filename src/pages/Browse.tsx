
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromptCard from '../components/PromptCard';
import { getAllPrompts } from '../lib/data';
import { useSearch } from '../contexts/SearchContext';

const Browse = () => {
  const allPrompts = getAllPrompts();
  const location = useLocation();
  const { setSearchQuery } = useSearch();
  const [filteredPrompts, setFilteredPrompts] = useState(allPrompts);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search') || '';
    
    setSearchQuery(searchQuery);
    
    if (searchQuery) {
      const filtered = allPrompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPrompts(filtered);
    } else {
      setFilteredPrompts(allPrompts);
    }
  }, [location.search, allPrompts, setSearchQuery]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Browse Prompts</h1>
          <p className="text-gray-600 mb-8">
            Explore all prompts shared by the community. Find the perfect prompt for your next project.
          </p>
          
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No prompts found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or browse all prompts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredPrompts.map((prompt) => (
                <div key={prompt.id}>
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
