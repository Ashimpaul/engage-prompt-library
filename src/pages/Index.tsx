
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedPrompts from '../components/FeaturedPrompts';
import TrendingPrompts from '../components/TrendingPrompts';
import PromptCategories from '../components/PromptCategories';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
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

  // Fetch latest prompts from Supabase
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('user_prompts')
          .select(`
            *,
            profiles:user_id (
              name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching prompts:', error);
          return;
        }

        // Transform and store the prompts in localStorage
        const transformedPrompts = data.map(prompt => ({
          ...prompt,
          author_name: prompt.profiles?.name || 'Anonymous User',
          author_avatar: prompt.profiles?.avatar_url || `https://ui-avatars.com/api/?name=Anonymous+User&background=random`,
        }));

        localStorage.setItem('supabasePrompts', JSON.stringify(transformedPrompts));
        console.log('Prompts fetched and stored:', transformedPrompts);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedPrompts />
      <TrendingPrompts />
      <PromptCategories />
      <Footer />
    </div>
  );
};

export default Index;
