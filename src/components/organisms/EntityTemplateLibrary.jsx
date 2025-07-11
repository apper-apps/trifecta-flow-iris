import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { getEntityTemplates } from "@/utils/entityUtils";

const EntityTemplateLibrary = ({ isOpen, onClose, onTemplateSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const templates = getEntityTemplates();
  const categories = ["all", "operations", "assets", "foundation"];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.searchTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template) => {
    onTemplateSelect(template);
    onClose();
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "operations":
        return "text-operations-600 bg-operations-100";
      case "assets":
        return "text-assets-600 bg-assets-100";
      case "foundation":
        return "text-foundation-600 bg-foundation-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
        >
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            className="w-96 h-full bg-white shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Entity Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredTemplates.map(template => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        getCategoryColor(template.category)
                      )}>
                        <ApperIcon name={template.icon} className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {template.description}
                        </p>
                        
                        {template.template.details && (
                          <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
                            <ApperIcon name="Info" className="w-3 h-3 inline mr-1" />
                            {template.template.details}
                          </div>
                        )}
                        
                        {template.template.financials && (
                          <div className="flex gap-2 mt-2">
                            {template.template.financials.revenue && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                ${(template.template.financials.revenue / 1000).toFixed(0)}K revenue
                              </span>
                            )}
                            {template.template.financials.value && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                ${(template.template.financials.value / 1000).toFixed(0)}K value
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <ApperIcon name="Plus" className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No templates found matching your criteria</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Info" className="w-4 h-4" />
                <span>Drag templates directly onto the canvas</span>
              </div>
            </div>
          </motion.div>
          
          {/* Overlay */}
          <div className="flex-1" onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntityTemplateLibrary;