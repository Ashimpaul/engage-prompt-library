
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPromptById, prompts } from '../lib/data';
import { Calendar, Clock, Copy, MessageSquare, Tag, Users, Share2, Bookmark, ExternalLink } from 'lucide-react';
import VoteButton from '../components/VoteButton';
import { toast } from "sonner";
import PromptCard from '../components/PromptCard';

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const prompt = id ? getPromptById(id) : null;
  
  // Get related prompts (same category)
  const relatedPrompts = prompt 
    ? prompts.filter(p => p.category === prompt.category && p.id !== prompt.id).slice(0, 3) 
    : [];
  
  // Format date
  const formattedDate = prompt 
    ? new Date(prompt.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const copyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content);
      toast.success('Prompt copied to clipboard!');
    }
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

  if (!prompt) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Prompt Not Found</h1>
            <p className="text-gray-600 mb-6">The prompt you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/browse" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Prompts
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-64 bg-accent/30 -z-10"></div>
        <div className="layout-container">
          <Link 
            to={`/browse?category=${encodeURIComponent(prompt.category)}`}
            className="inline-flex items-center px-3 py-1 bg-accent text-secondary text-sm font-medium rounded-full mb-4 hover:bg-accent/80 transition-all"
          >
            {prompt.category}
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            {prompt.title}
          </h1>
          
          <div className="flex items-center flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center">
              <img 
                src={prompt.author.avatar} 
                alt={prompt.author.name} 
                className="h-10 w-10 rounded-full border-2 border-white mr-3"
              />
              <div>
                <Link to="/profile" className="font-medium hover:text-primary transition-colors">
                  {prompt.author.name}
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {formattedDate}
                </div>
              </div>
            </div>
            
            <div className="ml-auto flex items-center space-x-3">
              <VoteButton type="up" count={prompt.upvotes} promptId={prompt.id} size="lg" />
              <VoteButton type="down" count={prompt.downvotes} promptId={prompt.id} size="lg" />
              
              <button 
                onClick={copyPrompt}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Copy prompt"
              >
                <Copy className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Share prompt"
              >
                <Share2 className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Save prompt"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-8 px-4 sm:px-6">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 card-shadow mb-8 overflow-hidden animate-scale-in">
                {/* Description */}
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold mb-3">Description</h2>
                  <p className="text-gray-700">
                    {prompt.description}
                  </p>
                </div>
                
                {/* Prompt Content */}
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-bold">Prompt Content</h2>
                    <button 
                      onClick={copyPrompt}
                      className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap">
                    {prompt.content}
                  </div>
                </div>
                
                {/* Usage Instructions */}
                <div className="p-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold mb-3">How to Use This Prompt</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    {prompt.usageInstructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                {/* Tags */}
                <div className="p-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/browse?search=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Comments Section (placeholder) */}
              <div className="bg-white rounded-xl border border-gray-100 card-shadow p-6 animate-scale-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Comments</h2>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    12 comments
                  </span>
                </div>
                
                <div className="mb-6">
                  <textarea
                    placeholder="Share your thoughts or ask a question..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      Post Comment
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Sample comments (static for now) */}
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-start">
                      <img 
                        src="https://i.pravatar.cc/150?img=10" 
                        alt="User" 
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">Emma Wilson</h4>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          I've been using this prompt for my blog writing and it's given me some amazing results. The character development framework is really comprehensive.
                        </p>
                        <div className="flex items-center mt-2 text-sm">
                          <button className="text-gray-500 hover:text-gray-700 mr-4">
                            Reply
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            Like (5)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <img 
                        src="https://i.pravatar.cc/150?img=12" 
                        alt="User" 
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">James Rodriguez</h4>
                          <span className="text-xs text-gray-500">5 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          Great prompt! I've found it works best with GPT-4. Has anyone tried it with Claude? I'm curious about the differences in output.
                        </p>
                        <div className="flex items-center mt-2 text-sm">
                          <button className="text-gray-500 hover:text-gray-700 mr-4">
                            Reply
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            Like (3)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Sidebar */}
            <div>
              {/* Compatible AI Models */}
              <div className="bg-white rounded-xl border border-gray-100 card-shadow p-6 mb-6 animate-scale-in" style={{ animationDelay: '150ms' }}>
                <h2 className="text-lg font-bold mb-3">Compatible AI Models</h2>
                <div className="space-y-3">
                  {prompt.aiModels.map((model, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-secondary mr-3">
                        <span className="font-semibold">{model.charAt(0)}</span>
                      </div>
                      <span>{model}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Author info */}
              <div className="bg-white rounded-xl border border-gray-100 card-shadow p-6 mb-6 animate-scale-in" style={{ animationDelay: '200ms' }}>
                <h2 className="text-lg font-bold mb-3">About the Author</h2>
                <div className="flex items-center mb-3">
                  <img 
                    src={prompt.author.avatar} 
                    alt={prompt.author.name} 
                    className="h-12 w-12 rounded-full mr-3 border-2 border-white"
                  />
                  <div>
                    <h3 className="font-semibold">{prompt.author.name}</h3>
                    <p className="text-sm text-gray-500">@{prompt.author.username}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {prompt.author.bio}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {prompt.author.joinedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{prompt.author.contributions} prompts</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    to="/profile"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-accent text-secondary rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              
              {/* Related prompts */}
              <div className="bg-white rounded-xl border border-gray-100 card-shadow p-6 animate-scale-in" style={{ animationDelay: '250ms' }}>
                <h2 className="text-lg font-bold mb-3">Related Prompts</h2>
                <div className="space-y-4">
                  {relatedPrompts.map(relatedPrompt => (
                    <PromptCard 
                      key={relatedPrompt.id} 
                      prompt={relatedPrompt} 
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PromptDetail;
