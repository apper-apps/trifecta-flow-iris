import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false,
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select error={!!error} {...props}>
          {children}
        </Select>
      );
    }
    return <Input type={type} error={!!error} {...props} />;
  };

  return (
    <div className={cn("mb-4", className)}>
      <Label required={required}>
        {label}
      </Label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;