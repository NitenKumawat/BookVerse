import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Animated Image */}
      <motion.img
        src="https://cdni.iconscout.com/illustration/premium/thumb/404-error-3700958-3119147.png"
        alt="Page Not Found"
        className="w-96 max-w-full mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: [30, 20, 30] }} 
        transition={{ delay: 0.3, duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated Button */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white text-lg font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Go Back Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
