
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromptCard from '../components/PromptCard';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { prompts, categories } from '../lib/data';

const Browse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get all unique AI models from prompts
  const aiModels = [...new Set(prompts.flatMap(prompt => prompt.aiModels))];
  
  // Filter prompts based on selected filters
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || prompt.category === selectedCategory;
    
    const matchesModel = selectedModels.length === 0 || 
      selectedModels.some(model => prompt.aiModels.includes(model));
    
    return matchesSearch && matchesCategory && matchesModel;
  });
  
  // Sort prompts
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.upvotes - a.upvotes;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (selectedModels.length > 0) params.set('models', selectedModels.join(','));
    if (sortBy) params.set('sort', sortBy);
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [selectedCategory, searchTerm, selectedModels, sortBy, navigate, location.pathname]);

  // Function to toggle a model selection
  const toggleModel = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) 
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  // Animation for elements with animate-on-scroll class
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
          element.classList.add('active');
        }
      });
    };
    
    // Initial check on page load
    animateOnScroll();
    
    // Event listener for scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedModels([]);
    setSortBy('popular');
  };

  return (
    <div>
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-64 bg-accent/30 -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Browse All Prompts
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl animate-fade-in" style={{ animationDelay: '100ms' }}>
            Discover prompts from our community. Use filters to find exactly what you need.
          </p>
        </div>
      </section>
      
      {/* Filters and Results */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl border border-gray-100 overflow-hidden card-shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === '' ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button 
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                          selectedCategory === category.name ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">AI Models</h3>
                  <div className="space-y-2">
                    {aiModels.map(model => (
                      <div key={model} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`model-${model}`}
                          checked={selectedModels.includes(model)}
                          onChange={() => toggleModel(model)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`model-${model}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {model}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSortBy('popular')}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        sortBy === 'popular' ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      Most Popular
                    </button>
                    <button 
                      onClick={() => setSortBy('newest')}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        sortBy === 'newest' ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      Newest First
                    </button>
                    <button 
                      onClick={() => setSortBy('oldest')}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        sortBy === 'oldest' ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      Oldest First
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={resetFilters}
                  className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
            {/* Mobile filter button */}
            <div className="lg:hidden sticky top-20 z-30 bg-white/80 backdrop-blur-md pb-4 pt-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center justify-center w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 card-shadow"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter Results</span>
              </button>
            </div>
            
            {/* Mobile filter sidebar */}
            {isFilterOpen && (
              <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex justify-end">
                <div className="w-80 h-full bg-white animate-slide-up overflow-auto">
                  <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Categories</h3>
                      <div className="space-y-2">
                        <button 
                          onClick={() => {
                            setSelectedCategory('');
                            setIsFilterOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                            selectedCategory === '' ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map(category => (
                          <button 
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.name);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                              selectedCategory === category.name ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">AI Models</h3>
                      <div className="space-y-2">
                        {aiModels.map(model => (
                          <div key={model} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`mobile-model-${model}`}
                              checked={selectedModels.includes(model)}
                              onChange={() => toggleModel(model)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor={`mobile-model-${model}`}
                              className="ml-3 text-sm text-gray-700"
                            >
                              {model}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                      <div className="space-y-2">
                        {['popular', 'newest', 'oldest'].map((option) => (
                          <button 
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                              sortBy === option ? 'bg-accent text-secondary font-medium' : 'hover:bg-gray-100'
                            }`}
                          >
                            {option === 'popular' ? 'Most Popular' : option === 'newest' ? 'Newest First' : 'Oldest First'}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => {
                          resetFilters();
                          setIsFilterOpen(false);
                        }}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Prompt listing */}
            <div className="flex-grow">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter pills */}
              {(selectedCategory || selectedModels.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory && (
                    <div className="flex items-center bg-accent/50 text-secondary px-3 py-1 rounded-full text-sm">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="ml-2 text-secondary/80 hover:text-secondary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {selectedModels.map(model => (
                    <div key={model} className="flex items-center bg-accent/50 text-secondary px-3 py-1 rounded-full text-sm">
                      <span>{model}</span>
                      <button
                        onClick={() => toggleModel(model)}
                        className="ml-2 text-secondary/80 hover:text-secondary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={resetFilters}
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-200 rounded-full text-sm"
                  >
                    <span>Clear all</span>
                  </button>
                </div>
              )}
              
              {/* Results */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-medium">{sortedPrompts.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border-none bg-transparent focus:outline-none focus:ring-0"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
              
              {sortedPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedPrompts.map((prompt, index) => (
                    <div key={prompt.id} className="animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                      <PromptCard prompt={prompt} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 card-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No prompts found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any prompts matching your current filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Browse;
