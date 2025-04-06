
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

  // Enhanced function to determine author name with more aggressive persistence
  const determineAuthorName = () => {
    // Check if we have a name with actual content
    if (!comment.author || !comment.author.name || typeof comment.author.name !== 'string' || comment.author.name.trim() === '') {
      console.log('Comment author name missing or empty:', comment.id);
      return 'Anonymous User';
    }
    
    const name = comment.author.name.trim();
    
    // Check for specific patterns that indicate system-generated or placeholder names
    const isSystemGenerated = 
      /^user\s+[a-f0-9]+$/i.test(name) ||         // "User" followed by hex digits
      /^anonymous\s+user$/i.test(name) ||         // "Anonymous User" case insensitive
      /^unknown\s+user$/i.test(name) ||           // "Unknown User" case insensitive
      name === 'Anonymous User' ||                 // Exact match for Anonymous User
      name === 'Unknown User';                     // Exact match for Unknown User
      
    // If it's not a real name, try to extract one from author ID if possible
    if (isSystemGenerated && comment.author.id && comment.author.id.includes('@')) {
      // If the ID is an email address, extract the username part
      const emailUsername = comment.author.id.split('@')[0];
      if (emailUsername) {
        const formattedName = emailUsername
          .split(/[._\-]/) // Split by common separators
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
        
        if (formattedName && formattedName.length > 1) {
          return formattedName;
        }
      }
    }
      
    // Return the original name unless it's system-generated
    return isSystemGenerated ? 'Anonymous User' : name;
  };
  
  // Get the display name with our improved function
  const authorName = determineAuthorName();
  
  // Log for debugging
  console.log('Comment author display name:', authorName, 'Original:', comment.author.name);
  
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
