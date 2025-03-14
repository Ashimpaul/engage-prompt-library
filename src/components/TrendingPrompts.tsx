
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Loader } from 'lucide-react';
import PromptCard from './PromptCard';
import { supabase } from '@/integrations/supabase/client';
import { Prompt } from '@/lib/data';

const TrendingPrompts = () => {
  const [trendingPrompts, setTrendingPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPrompts = async () => {
      try {
        setLoading(true);
        
        // Fetch prompts ordered by upvotes (descending)
        const { data: promptsData, error } = await supabase
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
          .order('upvotes', { ascending: false })
          .limit(3);
          
        if (error) {
          console.error('Error fetching trending prompts:', error);
          return;
        }
        
        // Format the prompts data to match our Prompt type
        const formattedPrompts: Prompt[] = promptsData.map(prompt => ({
          id: prompt.id,
          title: prompt.title,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          author: {
            id: prompt.user_id,
            name: prompt.profiles?.name || 'Anonymous User',
            avatar: prompt.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(prompt.profiles?.name || 'Anonymous User')}&background=random`,
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
          isTrending: true
        }));
        
        setTrendingPrompts(formattedPrompts);
      } catch (error) {
        console.error('Error fetching trending prompts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingPrompts();
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingPrompts.map((prompt) => (
              <div key={prompt.id} className="animate-on-scroll">
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        )}
        
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
