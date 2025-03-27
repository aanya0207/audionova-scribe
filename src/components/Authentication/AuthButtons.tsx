
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface AuthButtonsProps {
  minimal?: boolean;
}

const AuthButtons = ({ minimal = false }: AuthButtonsProps) => {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  // If user is signed in, show profile button and sign out button
  if (isSignedIn && user) {
    return (
      <div className={`flex ${minimal ? "flex-col w-full gap-2" : "flex-row gap-4"}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            className="flex items-center gap-2 glass-card hover:bg-white/10"
            onClick={() => navigate("/profile")}
          >
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="w-5 h-5 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }} 
            />
            {minimal ? "Profile" : user.firstName || "My Profile"}
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline"
            className="flex items-center gap-2 bg-sidebar-primary/10 hover:bg-sidebar-primary/20 text-sidebar-primary"
            onClick={() => signOut(() => navigate("/"))}
          >
            <LogOut className="w-4 h-4" />
            {minimal ? "Sign Out" : "Sign out"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // If user is not signed in, show sign in and sign up buttons
  return (
    <div className={`flex ${minimal ? "flex-col w-full gap-2" : "flex-row gap-4"}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="outline" 
          className="flex items-center gap-2 glass-card hover:bg-white/10"
          onClick={() => navigate("/sign-in")}
        >
          <LogIn className="w-4 h-4" />
          {minimal ? "Sign In" : "Sign in to your account"}
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          className="flex items-center gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white"
          onClick={() => navigate("/sign-up")}
        >
          <UserPlus className="w-4 h-4" />
          {minimal ? "Sign Up" : "Create an account"}
        </Button>
      </motion.div>
    </div>
  );
};

export default AuthButtons;
