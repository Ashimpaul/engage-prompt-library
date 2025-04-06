
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

  // Improved display name generator that better preserves the original name
  const generateDisplayName = (profile: any): string => {
    if (!profile) return 'Anonymous User';
    
    // First priority: Use the name if it exists and isn't obviously a system-generated ID
    if (profile.name && typeof profile.name === 'string' && profile.name.trim() !== '') {
      // System-generated names typically follow patterns like "User 123abc" or similar
      const isSystemGenerated = 
        /^user\s+[a-f0-9]+$/i.test(profile.name) || // "User" followed by hex digits
        profile.name === 'Unknown User' ||
        profile.name === 'Anonymous User';
      
      if (!isSystemGenerated) {
        // It's a real user-provided name, use it
        return profile.name.trim();
      }
    }
    
    // Second priority: Format from email if available
    if (profile.email && typeof profile.email === 'string') {
      try {
        // Extract username part before the @ symbol
        const emailUsername = profile.email.split('@')[0];
        
        // Format it nicely: convert john.doe_smith to John Doe Smith
        const formattedName = emailUsername
          .split(/[._\-]/) // Split by common separators
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
        
        // Only use if we got something reasonable
        if (formattedName && formattedName.length > 1) {
          return formattedName;
        }
      } catch (error) {
        console.error('Error formatting email for display name:', error);
      }
    }
    
    // Last resort fallback
    return 'Anonymous User';
  };

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data: promptData, error: promptError } = await supabase
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
          
        if (promptError) {
          console.error('Error fetching prompt:', promptError);
          setLoading(false);
          return; // Will show "Prompt Not Found"
        }
        
        if (!promptData) {
          setLoading(false);
          return; // Will show "Prompt Not Found"
        }
        
        // Store the raw profile data for debugging
        console.log('Raw profiles data:', promptData.profiles);
        
        // Generate author name from the profile data
        const authorName = generateDisplayName(promptData.profiles);
        console.log('Generated prompt author name:', authorName);
        
        const formattedPrompt: Prompt = {
          id: promptData.id,
          title: promptData.title,
          description: promptData.description,
          content: promptData.content,
          category: promptData.category,
          author: {
            id: promptData.user_id,
            name: authorName,
            avatar: promptData.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`,
            username: '',
            bio: '',
            joinedDate: promptData.created_at,
            contributions: 0
          },
          tags: promptData.tags || [],
          upvotes: promptData.upvotes,
          downvotes: promptData.downvotes,
          createdAt: promptData.created_at,
          updatedAt: promptData.updated_at,
          usageInstructions: promptData.usage_instructions || [],
          aiModels: promptData.ai_models || [],
          isFeatured: false,
          isTrending: false
        };
        
        setPrompt(formattedPrompt);
        
        loadComments(promptData.id);
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
      
      // Fetch all profile data for comment authors
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .in('id', userIds);
      
      // Store profiles in a map for quick lookup
      const profilesMap: Record<string, any> = {};
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
      }

      // Log profile data for debugging
      console.log('Comment profiles data:', profilesMap);

      const commentsWithAuthors = commentData.map(comment => {
        const profile = profilesMap[comment.user_id];
        
        // Generate display name with improved logic
        const authorName = generateDisplayName(profile);
        console.log(`Comment author (${comment.id}) display name:`, authorName);
        
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
