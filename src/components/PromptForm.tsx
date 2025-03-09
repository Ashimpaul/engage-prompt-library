
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users, categories } from '@/lib/data';
import { toast } from 'sonner';

const PromptForm = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.title || !formData.description || !formData.content || !formData.category) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call to create a prompt
    setTimeout(() => {
      // In a real app, you would send this to a backend
      const newPrompt = {
        id: `prompt${Math.floor(Math.random() * 10000)}`,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        author: users[0], // In a real app, this would be the logged-in user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        usageInstructions: formData.usageInstructions.split('\n').filter(line => line.trim() !== ''),
        aiModels: formData.aiModels.split(',').map(model => model.trim()),
        isFeatured: false,
        isTrending: false
      };
      
      console.log('Created new prompt:', newPrompt);
      toast.success('Prompt created successfully!');
      setIsSubmitting(false);
      
      // In a real app, after successfully creating the prompt, navigate to the detail page
      // For now, we'll just go back to the home page
      navigate('/');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          </select>
        </div>
        
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
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 mr-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Prompt'}
        </button>
      </div>
    </form>
  );
};

export default PromptForm;
