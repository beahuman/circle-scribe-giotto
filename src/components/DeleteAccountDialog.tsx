
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, AlertCircle } from 'lucide-react';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteAccountDialog = ({ open, onOpenChange }: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDelete = () => {
    // In a real app, this would call auth service to delete the account
    toast({
      title: "Account Deleted",
      description: "Your account has been deleted successfully",
      variant: "destructive",
    });
    
    onOpenChange(false);
    
    // Redirect to home after account deletion
    setTimeout(() => navigate('/'), 1500);
  };
  
  const isDeleteDisabled = confirmText !== 'delete';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" strokeWidth={1.5} />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center p-3 border border-destructive/20 rounded-xl bg-destructive/5 my-4">
          <AlertCircle className="h-5 w-5 text-destructive mr-2" strokeWidth={1.5} />
          <p className="text-sm text-destructive">All your game history and settings will be lost.</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">To confirm, type "delete" below:</Label>
            <Input 
              id="confirmation" 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              placeholder="delete"
              className="border-destructive/30 focus-visible:ring-destructive/30"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleteDisabled}
          >
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
