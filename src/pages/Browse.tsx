
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromptCard from '../components/PromptCard';
import { useSearch } from '../contexts/SearchContext';
import { supabase } from '@/integrations/supabase/client';
import { Prompt, User } from '@/lib/data';
import { Loader } from 'lucide-react';

const Browse = () => {
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearch();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch all prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_prompts')
          .select(`
            *,
            profiles:user_id (
              id,
              name,
              email,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Format the prompts
        const formattedPrompts: Prompt[] = data.map(prompt => ({
          id: prompt.id,
          title: prompt.title,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          author: {
            id: prompt.profiles.id,
            name: prompt.profiles.name || 'Unknown User',
            avatar: prompt.profiles.avatar_url || `https://ui-avatars.com/api/?name=Unknown+User&background=random`,
            // Add optional fields with default values
            username: '',
            bio: '',
            joinedDate: prompt.created_at,
            contributions: 0
          },
          tags: prompt.tags || [],
          upvotes: prompt.upvotes,
          downvotes: prompt.downvotes,
          createdAt: prompt.created_at,
          updatedAt: prompt.updated_at,
          usageInstructions: prompt.usage_instructions || [],
          aiModels: prompt.ai_models || [],
          isFeatured: false,
          isTrending: false
        }));
        
        setPrompts(formattedPrompts);
        setFilteredPrompts(formattedPrompts);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrompts();
  }, []);
  
  // Filter prompts based on search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search') || '';
    
    setSearchQuery(searchQuery);
    
    if (searchQuery && prompts.length > 0) {
      const filtered = prompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPrompts(filtered);
    } else {
      setFilteredPrompts(prompts);
    }
  }, [location.search, prompts, setSearchQuery]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Browse Prompts</h1>
          <p className="text-gray-600 mb-8">
            Explore all prompts shared by the community. Find the perfect prompt for your next project.
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPrompts.length === 0 ? (
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
