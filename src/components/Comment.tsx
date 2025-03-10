
import React from 'react';
import { type Comment } from '../lib/data';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  comment: Comment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  // Format the date as "X time ago" (e.g., "5 minutes ago", "2 hours ago")
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <div className="border-b border-gray-100 py-4">
      <div className="flex items-start space-x-3">
        <img 
          src={comment.author.avatar} 
          alt={comment.author.name} 
          className="h-8 w-8 rounded-full mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{comment.author.name}</h4>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="mt-1 text-gray-700">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
