import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
              <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="primary"
                className="flex items-center gap-2"
              >
                <ApperIcon name="RefreshCw" className="w-4 h-4" />
                Try Again
              </Button>
            )}
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Error;