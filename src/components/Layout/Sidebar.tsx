
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  PlusCircle, 
  User, 
  BarChart, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import Logo from '@/components/ui/logo';
import AuthButtons from '@/components/Authentication/AuthButtons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}

const NavItem = ({ icon, label, to, end = false }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
          : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'}
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.aside 
      className="w-64 h-screen overflow-y-auto border-r border-sidebar-border bg-sidebar"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full p-6">
        <div className="pb-6">
          <Logo size="md" />
        </div>
        
        <nav className="space-y-1">
          <motion.div variants={itemVariants}>
            <NavItem icon={<Home size={18} />} label="Home" to="/" end />
          </motion.div>
          <motion.div variants={itemVariants}>
            <NavItem icon={<Compass size={18} />} label="Explore" to="/explore" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <NavItem icon={<PlusCircle size={18} />} label="Create Podcast" to="/create" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <NavItem icon={<User size={18} />} label="Profile" to="/profile" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <NavItem icon={<BarChart size={18} />} label="Analytics" to="/analytics" />
          </motion.div>
        </nav>
        
        <div className="mt-auto">
          <div className="space-y-1">
            <motion.div variants={itemVariants}>
              <NavItem icon={<Settings size={18} />} label="Settings" to="/settings" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <NavItem icon={<HelpCircle size={18} />} label="Help & Support" to="/help" />
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-6 pt-4 border-t border-sidebar-border"
            variants={itemVariants}
          >
            <AuthButtons minimal />
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
