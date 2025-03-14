
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface CommentProps {
  comment: {
    id: string;
    text: string;
    createdAt: string;
    author: Author;
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  // Format the date as "X time ago" (e.g., "5 minutes ago", "2 hours ago")
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  // Display a reasonable name (never "Unknown User") and use "Anonymous User" as fallback
  const authorName = comment.author.name && comment.author.name !== 'Unknown User' 
    ? comment.author.name 
    : 'Anonymous User';

  return (
    <div className="border-b border-gray-100 py-4">
      <div className="flex items-start space-x-3">
        <img 
          src={comment.author.avatar} 
          alt={authorName} 
          className="h-8 w-8 rounded-full mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{authorName}</h4>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="mt-1 text-gray-700">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
