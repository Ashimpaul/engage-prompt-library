
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  // Get author display name with priority logic
  const getAuthorDisplayName = () => {
    // Check if we have a valid name first
    if (comment.author?.name && 
        comment.author.name !== 'Anonymous' && 
        comment.author.name !== 'User' && 
        comment.author.name !== 'Anonymous User') {
      return comment.author.name;
    }
    
    // Next try to get name from email in author id
    if (comment.author?.id && comment.author.id.includes('@')) {
      const emailUsername = comment.author.id.split('@')[0];
      if (emailUsername) {
        return emailUsername
          .split(/[._\-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
      }
    }
    
    // Fallback
    return 'Anonymous';
  };

  const authorName = getAuthorDisplayName();
  
  // Get initials for avatar fallback (max 2 characters)
  const initials = authorName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="border-b border-gray-100 py-4">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={comment.author.avatar} alt={authorName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
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
