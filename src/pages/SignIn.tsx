
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/logo';

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo size="lg" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-md glass-card p-6 rounded-xl"
      >
        <ClerkSignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none glass-card",
              headerTitle: "text-xl font-bold",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-sidebar-primary hover:bg-sidebar-primary/90",
              formFieldInput: "border-input bg-background",
              footerAction: "text-sidebar-primary hover:text-sidebar-primary/90",
              identityPreviewEditButton: "text-sidebar-primary hover:text-sidebar-primary/90",
            }
          }}
          routing="path"
          path="/sign-in"
        />
      </motion.div>
    </div>
  );
};

export default SignIn;
