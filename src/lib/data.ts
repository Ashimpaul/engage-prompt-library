
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  contributions: number;
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

// Mock Users
export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    username: "alexj",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "AI researcher and prompt engineer with 5+ years experience in NLP.",
    joinedDate: "Jan 2023",
    contributions: 48
  },
  {
    id: "user2",
    name: "Samantha Lee",
    username: "samlee",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Creative writer using AI to generate story ideas and character development.",
    joinedDate: "Mar 2023",
    contributions: 32
  },
  {
    id: "user3",
    name: "Marcus Chen",
    username: "mchen",
    avatar: "https://i.pravatar.cc/150?img=3",
    bio: "Full stack developer and AI enthusiast. Building tools that leverage LLMs.",
    joinedDate: "Dec 2022",
    contributions: 57
  },
  {
    id: "user4",
    name: "Olivia Parker",
    username: "oliviap",
    avatar: "https://i.pravatar.cc/150?img=8",
    bio: "Digital marketing specialist using AI to improve content strategy.",
    joinedDate: "Feb 2023",
    contributions: 23
  }
];

// Mock Categories
export const categories: Category[] = [
  {
    id: "cat1",
    name: "Creative Writing",
    icon: "pencil",
    description: "Prompts for storytelling, poetry, and creative content generation",
    promptCount: 87
  },
  {
    id: "cat2",
    name: "Programming",
    icon: "code",
    description: "Prompts for code generation, debugging, and software development",
    promptCount: 64
  },
  {
    id: "cat3",
    name: "Business",
    icon: "briefcase",
    description: "Prompts for marketing, sales, business strategies, and more",
    promptCount: 53
  },
  {
    id: "cat4",
    name: "Education",
    icon: "graduation-cap",
    description: "Prompts for learning, teaching, and educational content",
    promptCount: 41
  },
  {
    id: "cat5",
    name: "Personal Productivity",
    icon: "calendar",
    description: "Prompts for organization, planning, and personal development",
    promptCount: 38
  },
  {
    id: "cat6",
    name: "Data Analysis",
    icon: "bar-chart",
    description: "Prompts for data interpretation, visualization, and insights",
    promptCount: 29
  },
];

// Mock Prompts
export const prompts: Prompt[] = [
  {
    id: "prompt1",
    title: "Comprehensive Code Refactoring Assistant",
    description: "A detailed prompt that helps you refactor code with best practices and improved efficiency",
    content: "Analyze the following code for potential improvements. Consider: 1) Time & space complexity, 2) Readability & maintainability, 3) Design patterns that could be applied, 4) Error handling, 5) Edge cases. Provide a refactored version with comments explaining your changes.",
    category: "Programming",
    tags: ["coding", "refactoring", "optimization"],
    author: users[0],
    createdAt: "2023-06-10T14:30:00Z",
    updatedAt: "2023-06-15T09:45:00Z",
    upvotes: 342,
    downvotes: 12,
    usageInstructions: [
      "Copy and paste your code after the prompt",
      "Specify any particular concerns you have about the current implementation",
      "Mention the programming language if it's not obvious",
      "Provide context about what the code is trying to accomplish"
    ],
    aiModels: ["GPT-4", "Claude", "Gemini"],
    isFeatured: true,
    isTrending: true
  },
  {
    id: "prompt2",
    title: "Character Development Framework",
    description: "Create deep, nuanced characters for your stories with this comprehensive prompt",
    content: "Help me develop a complex character with the following structure: 1) Basic demographics & appearance, 2) Psychological profile (motivations, fears, desires), 3) Background & formative experiences, 4) Relationships & social dynamics, 5) Internal conflicts & contradictions, 6) Character arc potential. For each aspect, provide 3 unusual or unique elements that avoid stereotypes.",
    category: "Creative Writing",
    tags: ["writing", "characters", "storytelling"],
    author: users[1],
    createdAt: "2023-05-22T11:15:00Z",
    updatedAt: "2023-05-22T11:15:00Z",
    upvotes: 287,
    downvotes: 5,
    usageInstructions: [
      "Optionally, provide initial ideas for your character",
      "Specify the genre or setting of your story",
      "Mention if you want to focus on any particular aspect of character development",
      "Use the output as a foundation, then add your own creative touches"
    ],
    aiModels: ["GPT-4", "Claude", "Gemini"],
    isFeatured: true,
    isTrending: false
  },
  {
    id: "prompt3",
    title: "Strategic SWOT Analysis Generator",
    description: "Generate a detailed SWOT analysis for any business idea or existing company",
    content: "Conduct a comprehensive SWOT analysis for the following business [describe business]. Structure your response in these sections: 1) Strengths (internal positives - resources, USPs, expertise), 2) Weaknesses (internal negatives - limitations, resource gaps, disadvantages), 3) Opportunities (external positives - market trends, partnerships, emerging needs), 4) Threats (external negatives - competitors, regulations, economic factors). For each section, provide 5-7 specific, actionable insights rather than generic points. Conclude with 3 strategic recommendations based on this analysis.",
    category: "Business",
    tags: ["strategy", "business-planning", "analysis"],
    author: users[2],
    createdAt: "2023-07-05T16:20:00Z",
    updatedAt: "2023-07-08T10:30:00Z",
    upvotes: 208,
    downvotes: 8,
    usageInstructions: [
      "Provide a detailed description of the business or idea",
      "Include the industry and target market information",
      "Mention any specific challenges or advantages already known",
      "For existing businesses, provide background on current performance"
    ],
    aiModels: ["GPT-4", "Claude"],
    isFeatured: false,
    isTrending: true
  },
  {
    id: "prompt4",
    title: "Comprehensive Learning Curriculum Creator",
    description: "Generate a structured learning path for any subject with resources and milestones",
    content: "Create a detailed learning curriculum for mastering [subject]. Structure it as follows: 1) Beginner level (fundamental concepts, resources, projects, estimated time), 2) Intermediate level (advancing skills, specialized topics, resources, projects), 3) Advanced level (expert concepts, specialization paths, resources, projects). For each level, include: recommended books, online courses, practice exercises, assessment methods, and milestones to track progress. Add learning tips specific to this subject and common pitfalls to avoid.",
    category: "Education",
    tags: ["learning", "education", "curriculum"],
    author: users[3],
    createdAt: "2023-04-18T09:40:00Z",
    updatedAt: "2023-05-01T14:25:00Z",
    upvotes: 176,
    downvotes: 3,
    usageInstructions: [
      "Specify the subject you want to learn",
      "Mention your current knowledge level if applicable",
      "Indicate any specific goals or applications you have in mind",
      "Specify time constraints if relevant"
    ],
    aiModels: ["GPT-4", "Claude", "Gemini"],
    isFeatured: true,
    isTrending: false
  },
  {
    id: "prompt5",
    title: "Weekly Personal Productivity System",
    description: "Create a customized weekly planning and productivity system tailored to your needs",
    content: "Design a personalized weekly productivity system for me based on these parameters: [your work type, commitments, goals, constraints]. Include: 1) A template for weekly planning with specific sections, 2) Daily structure recommendations with time blocks, 3) Habit tracking framework for 3-5 key habits, 4) Review questions for daily/weekly reflection, 5) Methods to prioritize tasks effectively, 6) Strategies to minimize procrastination based on my specific patterns. Make the system realistic and sustainable rather than overly ambitious.",
    category: "Personal Productivity",
    tags: ["productivity", "planning", "habits"],
    author: users[0],
    createdAt: "2023-08-12T13:50:00Z", 
    updatedAt: "2023-08-14T11:20:00Z",
    upvotes: 154,
    downvotes: 6,
    usageInstructions: [
      "Describe your typical work/life situation",
      "List any current productivity challenges you face",
      "Mention your goals and priorities",
      "Indicate how much time you can realistically dedicate to planning"
    ],
    aiModels: ["GPT-4", "Claude"],
    isFeatured: false, 
    isTrending: true
  },
  {
    id: "prompt6",
    title: "Data Interpretation & Visualization Guide",
    description: "Get expert guidance on analyzing data sets and creating effective visualizations",
    content: "I have the following dataset [describe dataset]. Help me with a comprehensive analysis approach: 1) Recommend initial exploratory analysis techniques for this specific data type, 2) Suggest 5 potential insights that might be valuable to extract, 3) Recommend 3-5 visualization types that would best represent this data with rationale for each, 4) Provide guidance on statistical methods appropriate for this dataset, 5) Outline potential pitfalls or misinterpretations to avoid with this specific data type. If relevant, include sample code snippets in Python using pandas/matplotlib/seaborn.",
    category: "Data Analysis",
    tags: ["data", "visualization", "analysis"],
    author: users[2],
    createdAt: "2023-07-30T10:15:00Z",
    updatedAt: "2023-07-30T10:15:00Z",
    upvotes: 132,
    downvotes: 4,
    usageInstructions: [
      "Describe your dataset (variables, size, format)",
      "Explain the purpose of your analysis",
      "Mention your level of expertise with data analysis",
      "Specify any particular insights you're seeking"
    ],
    aiModels: ["GPT-4", "Claude"],
    isFeatured: false,
    isTrending: false
  }
];

// Helper functions with localStorage integration
export function getAllPrompts(): Prompt[] {
  try {
    const userPrompts = JSON.parse(localStorage.getItem('userPrompts') || '[]');
    return [...prompts, ...userPrompts];
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
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const newComment: Comment = {
      id: `comment${Date.now()}`,
      text,
      author: user,
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
