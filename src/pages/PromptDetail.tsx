
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VoteButton from '../components/VoteButton';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import { Calendar, Copy, Tag, MessageCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Prompt, User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentData {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showComments, setShowComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  // Simplified function to get a proper display name
  const generateDisplayName = (profile: any): string => {
    console.log('Raw profile data for display name:', profile);
    
    // Handle completely missing profile
    if (!profile) {
      console.warn('Profile is null or undefined');
      return 'User';
    }
    
    // Direct approach: Check if email exists and use it if the name is missing or Anonymous User
    if ((!profile.name || profile.name === 'Anonymous User') && profile.email) {
      const emailUsername = profile.email.split('@')[0];
      if (emailUsername) {
        console.log('Using email username:', emailUsername);
        return emailUsername
          .split(/[._\-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
      }
    }
    
    // If name exists and isn't Anonymous User, use it
    if (profile.name && profile.name !== 'Anonymous User') {
      console.log('Using profile name:', profile.name);
      return profile.name;
    }
    
    // Fall back to user_metadata if available
    if (profile.user_metadata && profile.user_metadata.full_name) {
      console.log('Using metadata full name:', profile.user_metadata.full_name);
      return profile.user_metadata.full_name;
    }
    
    console.log('Using default User name');
    return 'User';
  };

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Direct SQL query to get more complete user data
        const { data: promptWithFullUserData, error: fullDataError } = await supabase
          .from('user_prompts')
          .select(`
            *,
            profiles:user_id (
              id,
              name,
              email,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();
          
        if (fullDataError) {
          console.error('Error fetching prompt with full user data:', fullDataError);
          setLoading(false);
          return;
        }
        
        if (!promptWithFullUserData) {
          setLoading(false);
          return;
        }
        
        console.log('Complete prompt data with user:', promptWithFullUserData);
        
        // If profiles data is incomplete, try to get user data directly from auth.users
        let authorName = 'User';
        let avatarUrl = '';
        
        if (promptWithFullUserData.profiles) {
          console.log('Profiles data found:', promptWithFullUserData.profiles);
          authorName = generateDisplayName(promptWithFullUserData.profiles);
          avatarUrl = promptWithFullUserData.profiles?.avatar_url || '';
        } else {
          console.log('No profiles data, fetching from profiles table');
          // Try to get user data from profiles table
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, email, avatar_url')
            .eq('id', promptWithFullUserData.user_id)
            .single();
          
          if (profileData) {
            console.log('Profile data found:', profileData);
            authorName = generateDisplayName(profileData);
            avatarUrl = profileData.avatar_url || '';
          } else {
            // Last resort: try to get data from auth.users through a server function
            console.log('No profile found, using user_id for name');
            if (promptWithFullUserData.user_id && promptWithFullUserData.user_id.includes('@')) {
              const emailUsername = promptWithFullUserData.user_id.split('@')[0];
              authorName = emailUsername
                .split(/[._\-]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(' ');
            }
          }
        }
        
        console.log('Final author name:', authorName);
        
        const formattedPrompt: Prompt = {
          id: promptWithFullUserData.id,
          title: promptWithFullUserData.title,
          description: promptWithFullUserData.description,
          content: promptWithFullUserData.content,
          category: promptWithFullUserData.category,
          author: {
            id: promptWithFullUserData.user_id,
            name: authorName,
            avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`,
            username: '',
            bio: '',
            joinedDate: promptWithFullUserData.created_at,
            contributions: 0
          },
          tags: promptWithFullUserData.tags || [],
          upvotes: promptWithFullUserData.upvotes,
          downvotes: promptWithFullUserData.downvotes,
          createdAt: promptWithFullUserData.created_at,
          updatedAt: promptWithFullUserData.updated_at,
          usageInstructions: promptWithFullUserData.usage_instructions || [],
          aiModels: promptWithFullUserData.ai_models || [],
          isFeatured: false,
          isTrending: false
        };
        
        setPrompt(formattedPrompt);
        
        loadComments(promptWithFullUserData.id);
      } catch (error) {
        console.error('Error fetching prompt:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrompt();
  }, [id]);

  const loadComments = async (promptId: string) => {
    try {
      setLoadingComments(true);
      
      // Get comments with more direct user data
      const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .select('id, text, created_at, user_id')
        .eq('prompt_id', promptId)
        .order('created_at', { ascending: false });
        
      if (commentError) {
        throw commentError;
      }
      
      if (!commentData || commentData.length === 0) {
        setComments([]);
        setLoadingComments(false);
        return;
      }

      const userIds = [...new Set(commentData.map(comment => comment.user_id))];
      console.log('Comment user IDs:', userIds);
      
      // Fetch all relevant user profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .in('id', userIds);
      
      console.log('Comment profiles raw data:', profilesData);
      
      const profilesMap: Record<string, any> = {};
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
      }

      const commentsWithAuthors = commentData.map(comment => {
        const profile = profilesMap[comment.user_id];
        console.log(`Processing comment ${comment.id} with profile:`, profile);
        
        const authorName = generateDisplayName(profile || { id: comment.user_id });
        console.log(`Generated comment author name for ${comment.id}:`, authorName);
        
        const avatarUrl = profile?.avatar_url || '';
        
        return {
          id: comment.id,
          text: comment.text,
          createdAt: comment.created_at,
          author: {
            id: comment.user_id,
            name: authorName,
            avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`
          }
        };
      });
      
      setComments(commentsWithAuthors);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-20 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

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
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-accent text-secondary text-sm font-medium rounded-full">
                {prompt.category}
              </span>
              <div className="flex space-x-3">
                <VoteButton type="up" count={prompt.upvotes} promptId={prompt.id} />
                <VoteButton type="down" count={prompt.downvotes} promptId={prompt.id} />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {prompt.title}
            </h1>
            
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 mr-3 border-2 border-white">
                <AvatarImage src={prompt.author.avatar} alt={prompt.author.name} />
                <AvatarFallback>{prompt.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{prompt.author.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {formattedDate}
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg mb-8">
              {prompt.description}
            </p>
            
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
            
            {prompt.aiModels.length > 0 && (
              <div className="mb-8">
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
            
            <div className="border-t border-gray-100 pt-6 mt-8">
              <button 
                className="flex items-center mb-4 text-gray-700 hover:text-primary font-medium"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                <span>Comments ({comments.length})</span>
                <span className="ml-2 text-sm text-gray-500">
                  {showComments ? '(hide)' : '(show)'}
                </span>
              </button>
              
              {showComments && (
                <div>
                  <CommentForm 
                    promptId={prompt!.id} 
                    onCommentAdded={() => loadComments(prompt!.id)} 
                  />
                  
                  <div className="mt-6">
                    {loadingComments ? (
                      <div className="flex justify-center py-8">
                        <Loader className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : comments.length > 0 ? (
                      <div className="space-y-1">
                        {comments.map((comment) => (
                          <Comment key={comment.id} comment={comment} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromptDetail;
