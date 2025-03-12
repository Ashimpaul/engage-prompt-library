
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  username?: string;
  bio?: string;
  joinedDate?: string;
  contributions?: number;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  promptId: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  usageInstructions: string[];
  aiModels: string[];
  isFeatured: boolean;
  isTrending: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  promptCount: number;
}

// Categories remain for UI display
export const categories: Category[] = [
  {
    id: "cat1",
    name: "Creative Writing",
    icon: "pencil",
    description: "Prompts for storytelling, poetry, and creative content generation",
    promptCount: 0
  },
  {
    id: "cat2",
    name: "Programming",
    icon: "code",
    description: "Prompts for code generation, debugging, and software development",
    promptCount: 0
  },
  {
    id: "cat3",
    name: "Business",
    icon: "briefcase",
    description: "Prompts for marketing, sales, business strategies, and more",
    promptCount: 0
  },
  {
    id: "cat4",
    name: "Education",
    icon: "graduation-cap",
    description: "Prompts for learning, teaching, and educational content",
    promptCount: 0
  },
  {
    id: "cat5",
    name: "Personal Productivity",
    icon: "calendar",
    description: "Prompts for organization, planning, and personal development",
    promptCount: 0
  },
  {
    id: "cat6",
    name: "Data Analysis",
    icon: "bar-chart",
    description: "Prompts for data interpretation, visualization, and insights",
    promptCount: 0
  },
];

// Replace mock users and prompts with empty arrays
export const users: User[] = [];
export const prompts: Prompt[] = [];

// Helper functions with localStorage integration
export function getAllPrompts(): Prompt[] {
  try {
    const userPrompts = JSON.parse(localStorage.getItem('userPrompts') || '[]');
    
    // Set newly created prompts to be featured and trending for demonstration
    const enhancedPrompts = userPrompts.map((prompt: Prompt) => ({
      ...prompt,
      isFeatured: true,
      isTrending: true
    }));
    
    return [...prompts, ...enhancedPrompts];
  } catch (error) {
    console.error('Error loading user prompts from localStorage:', error);
    return prompts;
  }
}

export function getFeaturedPrompts(): Prompt[] {
  return getAllPrompts().filter(prompt => prompt.isFeatured);
}

export function getTrendingPrompts(): Prompt[] {
  return getAllPrompts().filter(prompt => prompt.isTrending);
}

export function getPromptsByCategory(categoryName: string): Prompt[] {
  return getAllPrompts().filter(prompt => prompt.category === categoryName);
}

export function getPromptById(id: string): Prompt | undefined {
  return getAllPrompts().find(prompt => prompt.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

// Comments functions
export function getCommentsByPromptId(promptId: string): Comment[] {
  try {
    const comments = JSON.parse(localStorage.getItem('promptComments') || '[]');
    return comments.filter((comment: Comment) => comment.promptId === promptId);
  } catch (error) {
    console.error('Error loading comments from localStorage:', error);
    return [];
  }
}

export function addComment(promptId: string, text: string, userId: string = 'user1'): Comment {
  try {
    const comments = JSON.parse(localStorage.getItem('promptComments') || '[]');
    const user = getUserById(userId);
    
    // Create a default user if not found
    const author: User = user || {
      id: userId,
      name: "Anonymous User",
      avatar: `https://ui-avatars.com/api/?name=Anonymous+User&background=random`,
    };
    
    const newComment: Comment = {
      id: `comment${Date.now()}`,
      text,
      author,
      createdAt: new Date().toISOString(),
      promptId
    };
    
    comments.push(newComment);
    localStorage.setItem('promptComments', JSON.stringify(comments));
    
    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}
