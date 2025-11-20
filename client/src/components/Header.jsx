import { motion } from 'framer-motion';
import { FiZap, FiMenu, FiSettings, FiGithub } from 'react-icons/fi';
import { useStore } from '../store';

const Header = () => {
  const { sidebarOpen, setSidebarOpen } = useStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="h-16 glass border-b border-gray-800 flex items-center justify-between px-3 md:px-6 relative z-20"
    >
      <div className="flex items-center space-x-2 md:space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FiMenu className="w-5 h-5" />
        </motion.button>
        
        <motion.div 
          className="flex items-center space-x-2 md:space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <FiZap className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <motion.div
              className="absolute inset-0 bg-primary rounded-full filter blur-xl opacity-50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Stormer
          </h1>
        </motion.div>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FiSettings className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
        
        <motion.a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FiGithub className="w-4 h-4 md:w-5 md:h-5" />
        </motion.a>
      </div>
    </motion.header>
  );
};

export default Header;
