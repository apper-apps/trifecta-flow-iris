import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item",
  actionLabel = "Get Started",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <ApperIcon name={icon} className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {description}
          </p>

          <div className="space-y-4">
            {onAction && (
              <Button
                onClick={onAction}
                variant="primary"
                className="flex items-center gap-2 mx-auto"
              >
                <ApperIcon name={icon} className="w-4 h-4" />
                {actionLabel}
              </Button>
            )}
            
            <div className="text-sm text-gray-500">
              <p className="mb-2">Quick tips to get started:</p>
              <ul className="text-left space-y-1">
                <li>• Use the Operations zone for S-Corp businesses</li>
                <li>• Place investments in the Assets zone</li>
                <li>• Trust structures go in the Foundation</li>
                <li>• All tax flow appears in the 1040 zone</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Empty;