import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const EntityForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "s-corp",
    revenue: initialData?.financials?.revenue || "",
    value: initialData?.financials?.value || "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const entityData = {
      name: formData.name.trim(),
      type: formData.type,
      financials: {
        revenue: formData.revenue ? parseFloat(formData.revenue) : null,
        value: formData.value ? parseFloat(formData.value) : null,
      },
    };

    onSubmit(entityData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Entity" : "Create New Entity"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Entity Name"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            placeholder="Enter entity name"
          />

          <FormField
            label="Entity Type"
            type="select"
            required
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            error={errors.type}
          >
            <option value="s-corp">S-Corporation</option>
            <option value="llc">LLC</option>
            <option value="trust">Trust</option>
            <option value="business">Business</option>
            <option value="property">Property</option>
            <option value="investment">Investment</option>
          </FormField>

          <FormField
            label="Annual Revenue"
            type="number"
            value={formData.revenue}
            onChange={(e) => handleChange("revenue", e.target.value)}
            placeholder="0"
            min="0"
            step="1000"
          />

          <FormField
            label="Asset Value"
            type="number"
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            placeholder="0"
            min="0"
            step="1000"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {initialData ? "Update Entity" : "Create Entity"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default EntityForm;