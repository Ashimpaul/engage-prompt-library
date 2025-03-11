
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  promptId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ promptId, onCommentAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    if (!isAuthenticated) {
      toast.error('Please sign in to comment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          prompt_id: promptId,
          user_id: user.id,
          text: comment.trim()
        });
        
      if (error) throw error;
      
      setComment('');
      toast.success('Comment added successfully');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-3">
        <div className="flex-grow">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment"}
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting || !isAuthenticated}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim() || !isAuthenticated}
            className="h-full px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
