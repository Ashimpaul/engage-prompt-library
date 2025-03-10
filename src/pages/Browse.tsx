
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromptCard from '../components/PromptCard';
import { getAllPrompts } from '../lib/data';

const Browse = () => {
  const allPrompts = getAllPrompts();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Browse Prompts</h1>
          <p className="text-gray-600 mb-8">
            Explore all prompts shared by the community. Find the perfect prompt for your next project.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {allPrompts.map((prompt) => (
              <div key={prompt.id}>
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
