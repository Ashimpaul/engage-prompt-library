
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedPrompts from '../components/FeaturedPrompts';
import TrendingPrompts from '../components/TrendingPrompts';
import PromptCategories from '../components/PromptCategories';
import Footer from '../components/Footer';

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
