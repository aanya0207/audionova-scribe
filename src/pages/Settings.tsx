
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Mail, Lock, Link2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useUser } from '@clerk/clerk-react';

const Settings = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    website: '',
  });
  
  const [accountForm, setAccountForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  React.useEffect(() => {
    if (isLoaded && user) {
      setProfileForm({
        name: user.fullName || '',
        bio: '', // Assuming bio would be stored elsewhere
        website: '',
      });
      
      setAccountForm({
        email: user.emailAddresses[0]?.emailAddress || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [isLoaded, user]);
  
  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully."
    });
  };
  
  const handleUpdateEmail = () => {
    // In a real app, this would update the email
    toast({
      title: "Email Updated",
      description: "Your email has been updated successfully. Please verify your new email address."
    });
  };
  
  const handleUpdatePassword = () => {
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would update the password
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully."
    });
    
    setAccountForm(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would delete the account
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive"
    });
  };
  
  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sidebar-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </motion.div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div>
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                    <AvatarFallback className="text-xl">{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileFormChange}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileFormChange}
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={profileForm.website}
                      onChange={handleProfileFormChange}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Email Address</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={accountForm.email}
                  onChange={handleAccountFormChange}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleUpdateEmail}>
                  Update Email
                </Button>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={accountForm.currentPassword}
                  onChange={handleAccountFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={accountForm.newPassword}
                  onChange={handleAccountFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={handleAccountFormChange}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Linked Accounts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-lg border border-destructive/20">
            <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
            <p className="text-muted-foreground mb-4">
              Once you delete your account, there is no going back. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
