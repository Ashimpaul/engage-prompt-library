
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPromptById } from '../lib/data';
import VoteButton from '../components/VoteButton';
import { Calendar, Copy, Tag } from 'lucide-react';
import { toast } from 'sonner';

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const prompt = getPromptById(id as string);

  if (!prompt) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Prompt Not Found</h1>
            <p className="text-gray-600 mb-8">
              The prompt you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Go Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    toast.success('Prompt copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden card-shadow p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-accent text-secondary text-sm font-medium rounded-full">
                {prompt.category}
              </span>
              <div className="flex space-x-3">
                <VoteButton type="up" count={prompt.upvotes} promptId={prompt.id} />
                <VoteButton type="down" count={prompt.downvotes} promptId={prompt.id} />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {prompt.title}
            </h1>
            
            {/* Author & Date */}
            <div className="flex items-center mb-6">
              <img 
                src={prompt.author.avatar} 
                alt={prompt.author.name} 
                className="h-10 w-10 rounded-full mr-3 border-2 border-white"
              />
              <div>
                <p className="font-medium">{prompt.author.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {formattedDate}
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-700 text-lg mb-8">
              {prompt.description}
            </p>
            
            {/* Tags */}
            {prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {prompt.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Prompt Content */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Prompt Content</h2>
                <button 
                  onClick={copyPromptToClipboard}
                  className="flex items-center text-primary hover:text-primary/80 text-sm font-medium"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy to clipboard
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="whitespace-pre-wrap font-mono text-sm">{prompt.content}</pre>
              </div>
            </div>
            
            {/* Usage Instructions */}
            {prompt.usageInstructions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">How to Use This Prompt</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  {prompt.usageInstructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ol>
              </div>
            )}
            
            {/* Compatible AI Models */}
            {prompt.aiModels.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Compatible AI Models</h2>
                <div className="flex flex-wrap gap-2">
                  {prompt.aiModels.map((model, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromptDetail;
