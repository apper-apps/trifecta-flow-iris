import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
          >
            <ApperIcon name="Zap" className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Trifecta Flow
        </h2>
        
        <p className="text-gray-600 mb-8">
          Setting up your tax optimization canvas...
        </p>

        <div className="space-y-4 max-w-md mx-auto">
          {/* Skeleton canvas zones */}
          <div className="flex gap-4">
            <div className="flex-1 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg animate-pulse" />
            <div className="flex-1 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;