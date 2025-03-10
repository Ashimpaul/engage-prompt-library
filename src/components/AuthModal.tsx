
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Google, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { googleSignIn } = useAuth();

  const handleGoogleSignIn = () => {
    googleSignIn();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to PromptVerse</DialogTitle>
          <DialogDescription>
            Access your account to create, share, and save prompts
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Button 
            onClick={handleGoogleSignIn} 
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              className="w-5 h-5"
            >
              <path 
                fill="#EA4335" 
                d="M12 5c1.617 0 3.082.629 4.172 1.657l2.828-2.829C17.038 1.957 14.675 1 12 1S6.962 1.957 5 3.828l2.828 2.829C8.918 5.629 10.383 5 12 5z"
              />
              <path 
                fill="#4285F4" 
                d="M23 12c0-.85-.064-1.665-.193-2.449H12v4.672h6.209c-.267 1.434-1.08 2.649-2.306 3.466v2.882h3.736C21.758 18.345 23 15.5 23 12z"
              />
              <path 
                fill="#FBBC05" 
                d="M5 12c0-.834.152-1.631.429-2.371L2.6 6.801C1.583 8.382 1 10.12 1 12c0 1.88.583 3.618 1.6 5.199l2.828-2.828A7.998 7.998 0 0 1 5 12z"
              />
              <path 
                fill="#34A853" 
                d="M12 19c2.583 0 4.739-.857 6.308-2.321l-3.736-2.882c-1.025.702-2.372 1.097-3.801 1.097-2.917 0-5.39-1.973-6.273-4.622L1.6 13.199C3.072 16.71 7.185 19 12 19z"
              />
              <path fill="none" d="M0 0h24v24H0z"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                More options coming soon
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
