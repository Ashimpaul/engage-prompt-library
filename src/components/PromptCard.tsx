
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Prompt } from '../lib/data';
import VoteButton from './VoteButton';
import { Calendar, MessageSquare, Tag, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  variant?: 'default' | 'featured' | 'compact';
  onDelete?: (promptId: string) => void;
  showDeleteButton?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  variant = 'default', 
  onDelete,
  showDeleteButton = false
}) => {
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);
  
  // Date formatting
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(prompt.id);
    }
  };

  if (variant === 'compact') {
    return (
      <Link 
        to={`/prompt/${prompt.id}`}
        className="block hover-lift relative"
      >
        {showDeleteButton && (
          <Button
            variant="outline" 
            size="sm"
            className={cn(
              "absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 w-8 h-8 shadow-md border-gray-200 transition-all",
              isHoveringDelete ? "bg-destructive hover:bg-destructive/90" : "bg-white hover:bg-gray-100"
            )}
            onClick={handleDelete}
            onMouseEnter={() => setIsHoveringDelete(true)}
            onMouseLeave={() => setIsHoveringDelete(false)}
          >
            <Trash2 className={cn("h-4 w-4", isHoveringDelete ? "text-white" : "text-gray-500")} />
          </Button>
        )}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden card-shadow p-4 transition-all hover:border-primary/20">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{prompt.title}</h3>
          <div className="flex items-center mt-2 justify-between">
            <div className="flex items-center">
              <img 
                src={prompt.author.avatar} 
                alt={prompt.author.name} 
                className="h-5 w-5 rounded-full mr-2"
              />
              <span className="text-xs text-gray-500">{prompt.author.name}</span>
            </div>
            <VoteButton type="up" count={prompt.upvotes} promptId={prompt.id} size="sm" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link 
        to={`/prompt/${prompt.id}`}
        className="group block hover-lift relative"
      >
        {showDeleteButton && (
          <Button
            variant="outline" 
            size="sm"
            className={cn(
              "absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 w-8 h-8 shadow-md border-gray-200 transition-all",
              isHoveringDelete ? "bg-destructive hover:bg-destructive/90" : "bg-white hover:bg-gray-100"
            )}
            onClick={handleDelete}
            onMouseEnter={() => setIsHoveringDelete(true)}
            onMouseLeave={() => setIsHoveringDelete(false)}
          >
            <Trash2 className={cn("h-4 w-4", isHoveringDelete ? "text-white" : "text-gray-500")} />
          </Button>
        )}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden card-shadow h-full transition-all hover:border-primary/20">
          <div className="absolute top-0 left-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-br-lg">
            Featured
          </div>
          <div className="p-6 pt-8">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-accent text-secondary text-xs font-medium rounded-full">
                {prompt.category}
              </span>
              <div className="flex space-x-2">
                <VoteButton type="up" count={prompt.upvotes} promptId={prompt.id} size="sm" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {prompt.title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {prompt.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={prompt.author.avatar} 
                  alt={prompt.author.name} 
                  className="h-8 w-8 rounded-full mr-2 border-2 border-white"
                />
                <div>
                  <p className="text-sm font-medium">{prompt.author.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card variant
  return (
    <div className="group block hover-lift relative">
      {showDeleteButton && (
        <Button
          variant="outline" 
          size="sm"
          className={cn(
            "absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 w-8 h-8 shadow-md border-gray-200 transition-all",
            isHoveringDelete ? "bg-destructive hover:bg-destructive/90" : "bg-white hover:bg-gray-100"
          )}
          onClick={handleDelete}
          onMouseEnter={() => setIsHoveringDelete(true)}
          onMouseLeave={() => setIsHoveringDelete(false)}
        >
          <Trash2 className={cn("h-4 w-4", isHoveringDelete ? "text-white" : "text-gray-500")} />
        </Button>
      )}
      <Link 
        to={`/prompt/${prompt.id}`}
        className="block"
      >
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden card-shadow h-full transition-all hover:border-primary/20">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-accent text-secondary text-xs font-medium rounded-full">
                {prompt.category}
              </span>
              <div className="flex space-x-2">
                <VoteButton type="up" count={prompt.upvotes} promptId={prompt.id} />
                <VoteButton type="down" count={prompt.downvotes} promptId={prompt.id} />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {prompt.title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {prompt.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={prompt.author.avatar} 
                  alt={prompt.author.name} 
                  className="h-8 w-8 rounded-full mr-2 border-2 border-white"
                />
                <div>
                  <p className="text-sm font-medium">{prompt.author.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {formattedDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>12</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PromptCard;
