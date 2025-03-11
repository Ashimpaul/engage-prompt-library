
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Navigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PromptCard from '@/components/PromptCard';
import { Prompt } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const MyPrompts = () => {
  const { isAuthenticated, user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserPrompts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Format the prompts to match the Prompt type
      const formattedPrompts = data.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        category: prompt.category,
        author: {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          avatar: user.avatar || "",
          username: user.username || "",
          bio: user.bio || "",
          joinedDate: user.joinedDate || "",
          contributions: user.contributions || 0
        },
        tags: prompt.tags || [],
        upvotes: prompt.upvotes,
        downvotes: prompt.downvotes,
        createdAt: prompt.created_at,
        updatedAt: prompt.updated_at,
        usageInstructions: prompt.usage_instructions || [],
        aiModels: prompt.ai_models || [],
        isFeatured: false,
        isTrending: false
      }));
      
      setPrompts(formattedPrompts);
    } catch (error: any) {
      console.error('Error fetching prompts:', error);
      toast({
        title: "Error",
        description: "Failed to load your prompts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPrompts();
    }
  }, [isAuthenticated, user]);

  const handleDeletePrompt = async (promptId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setPrompts(prompts.filter(prompt => prompt.id !== promptId));
      
      toast({
        title: "Success",
        description: "Prompt deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting prompt:', error);
      toast({
        title: "Error",
        description: "Failed to delete the prompt.",
        variant: "destructive",
      });
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 mt-10">
        <div className="layout-container">
          <h1 className="text-3xl font-bold mb-8">My Prompts</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : prompts.length === 0 ? (
            <div>
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>No prompts yet</AlertTitle>
                <AlertDescription>
                  You haven't created any prompts yet. Create your first prompt to see it here.
                </AlertDescription>
              </Alert>
              
              <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-4">Create your first prompt</p>
                <p className="text-sm text-gray-500">
                  When you create prompts, they will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <div key={prompt.id}>
                  <PromptCard 
                    prompt={prompt} 
                    showDeleteButton={true}
                    onDelete={handleDeletePrompt}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyPrompts;
