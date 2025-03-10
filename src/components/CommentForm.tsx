
import React, { useState } from 'react';
import { addComment } from '../lib/data';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface CommentFormProps {
  promptId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ promptId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addComment(promptId, comment);
      setComment('');
      toast.success('Comment added successfully');
      onCommentAdded();
    } catch (error) {
      toast.error('Failed to add comment');
      console.error(error);
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
            placeholder="Add a comment..."
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
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
