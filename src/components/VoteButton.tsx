
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VoteButtonProps {
  type: 'up' | 'down';
  count: number;
  promptId: string;
  size?: 'sm' | 'md' | 'lg';
}

const VoteButton: React.FC<VoteButtonProps> = ({ type, count, promptId, size = 'md' }) => {
  const { user, isAuthenticated } = useAuth();
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(count);

  // Check if user has already voted on this prompt
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const checkExistingVote = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('prompt_id', promptId)
        .eq('user_id', user.id)
        .eq('vote_type', type)
        .single();
      
      if (data && !error) {
        setVoted(true);
      }
    };
    
    checkExistingVote();
  }, [promptId, type, user, isAuthenticated]);

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      if (voted) {
        // Remove the vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('prompt_id', promptId)
          .eq('user_id', user.id)
          .eq('vote_type', type);
          
        if (error) throw error;
        
        setVoted(false);
        setVoteCount(prevCount => prevCount - 1);
        toast.info(type === 'up' ? 'Upvote removed' : 'Downvote removed');
      } else {
        // Add the new vote without removing opposite votes
        // This allows users to both upvote and downvote
        const { error } = await supabase
          .from('votes')
          .insert({
            prompt_id: promptId,
            user_id: user.id,
            vote_type: type
          });
          
        if (error) throw error;
        
        setVoted(true);
        setVoteCount(prevCount => prevCount + 1);
        toast.success(type === 'up' ? 'Prompt upvoted!' : 'Prompt downvoted');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to process your vote');
    }
  };

  // Determine icon size based on the size prop
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  
  // Determine button styles based on the size prop
  const buttonClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs' 
    : size === 'lg' 
      ? 'px-4 py-2 text-base' 
      : 'px-3 py-1.5 text-sm';

  return (
    <button
      onClick={handleVote}
      className={`${buttonClasses} rounded-full flex items-center gap-1.5 transition-all hover-lift ${
        voted
          ? type === 'up'
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {type === 'up' ? (
        <ArrowUp className={`${iconSize} ${voted ? 'text-green-600' : ''}`} />
      ) : (
        <ArrowDown className={`${iconSize} ${voted ? 'text-red-600' : ''}`} />
      )}
      <span className="font-medium">{voteCount}</span>
    </button>
  );
};

export default VoteButton;
