import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users, categories } from '@/lib/data';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import AuthModal from './AuthModal';

const PromptForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    usageInstructions: '',
    aiModels: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'category' && value === 'custom') {
      setShowCustomCategoryInput(true);
    } else if (name === 'category') {
      setShowCustomCategoryInput(false);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to create a prompt');
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare the form data with custom category if applicable
    const finalFormData = {
      ...formData,
      category: showCustomCategoryInput ? customCategory : formData.category
    };
    
    // Validate form
    if (!finalFormData.title || !finalFormData.description || !finalFormData.content || !finalFormData.category) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Create a new prompt
    setTimeout(() => {
      // Generate a unique ID
      const promptId = `prompt${Math.floor(Math.random() * 10000)}`;
      
      // Create the new prompt object
      const newPrompt = {
        id: promptId,
        title: finalFormData.title,
        description: finalFormData.description,
        content: finalFormData.content,
        category: finalFormData.category,
        tags: finalFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        author: user || users[0], // Use logged in user or fallback to first user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        usageInstructions: finalFormData.usageInstructions.split('\n').filter(line => line.trim() !== ''),
        aiModels: finalFormData.aiModels.split(',').map(model => model.trim()).filter(model => model !== ''),
        isFeatured: false,
        isTrending: false
      };
      
      // In a real app, you would send this to a backend
      // For this demo, we'll store it in localStorage
      const existingPrompts = JSON.parse(localStorage.getItem('userPrompts') || '[]');
      const updatedPrompts = [...existingPrompts, newPrompt];
      localStorage.setItem('userPrompts', JSON.stringify(updatedPrompts));
      
      console.log('Created new prompt:', newPrompt);
      toast.success('Prompt created successfully!');
      setIsSubmitting(false);
      
      // Navigate to the newly created prompt
      navigate(`/prompt/${promptId}`);
    }, 1500);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        {!isAuthenticated && (
          <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Login required</h3>
              <p className="text-sm text-blue-600">You need to be logged in to create and share prompts</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </button>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="E.g., Comprehensive Code Refactoring Assistant"
              required
            />
            <p className="text-xs text-gray-500 mt-1">A concise, descriptive title that clearly indicates what your prompt does</p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A brief description of what your prompt does"
              required
            />
            <p className="text-xs text-gray-500 mt-1">1-2 sentences explaining the purpose and value of your prompt</p>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Prompt Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="The full prompt text that users will copy and use with AI models"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The complete prompt text that users will copy and use with their AI assistant</p>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="custom">Create new category...</option>
            </select>
          </div>
          
          {showCustomCategoryInput && (
            <div>
              <label htmlFor="customCategory" className="block text-sm font-medium mb-1">
                Custom Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customCategory"
                name="customCategory"
                value={customCategory}
                onChange={handleCustomCategoryChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a new category name"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="E.g., coding, refactoring, optimization"
            />
            <p className="text-xs text-gray-500 mt-1">Add relevant tags to help users find your prompt</p>
          </div>
          
          <div>
            <label htmlFor="usageInstructions" className="block text-sm font-medium mb-1">
              Usage Instructions (each on new line)
            </label>
            <textarea
              id="usageInstructions"
              name="usageInstructions"
              value={formData.usageInstructions}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Step 1: Copy and paste your code after the prompt&#10;Step 2: Specify any particular concerns"
            />
            <p className="text-xs text-gray-500 mt-1">Step-by-step instructions to help users effectively use your prompt</p>
          </div>
          
          <div>
            <label htmlFor="aiModels" className="block text-sm font-medium mb-1">
              Compatible AI Models (comma separated)
            </label>
            <input
              type="text"
              id="aiModels"
              name="aiModels"
              value={formData.aiModels}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="E.g., GPT-4, Claude, Gemini"
            />
            <p className="text-xs text-gray-500 mt-1">List which AI models this prompt works best with</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Prompt'}
          </button>
        </div>
      </form>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default PromptForm;
