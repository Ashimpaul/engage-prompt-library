
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

  // Enhanced function to determine author name with better persistence
  const determineAuthorName = () => {
    // If we don't have a name, default to Anonymous User
    if (!comment.author.name || typeof comment.author.name !== 'string' || comment.author.name.trim() === '') {
      return 'Anonymous User';
    }
    
    // Check for specific patterns that indicate system-generated names
    const name = comment.author.name.trim();
    const isSystemGenerated = 
      /^user\s+[a-f0-9]+$/i.test(name) ||  // "User" followed by hex digits
      /^anonymous\s+user$/i.test(name) ||   // "Anonymous User" case insensitive
      /^unknown\s+user$/i.test(name);       // "Unknown User" case insensitive
      
    // Return the original name unless it's system-generated
    return isSystemGenerated ? 'Anonymous User' : name;
  };
  
  // Get the display name
  const authorName = determineAuthorName();
  
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
