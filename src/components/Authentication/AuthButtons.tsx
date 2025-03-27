
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";

interface AuthButtonsProps {
  minimal?: boolean;
}

const AuthButtons = ({ minimal = false }: AuthButtonsProps) => {
  return (
    <div className={`flex ${minimal ? "flex-col w-full gap-2" : "flex-row gap-4"}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button variant="outline" className="flex items-center gap-2 glass-card hover:bg-white/10">
          <LogIn className="w-4 h-4" />
          {minimal ? "Sign In" : "Sign in to your account"}
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button className="flex items-center gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white">
          <UserPlus className="w-4 h-4" />
          {minimal ? "Sign Up" : "Create an account"}
        </Button>
      </motion.div>
    </div>
  );
};

export default AuthButtons;
