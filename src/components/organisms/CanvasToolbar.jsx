import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CanvasToolbar = ({ 
  onCreateEntity, 
  onToggleView, 
  onShowTemplates,
  viewMode = "2d",
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onResetView,
  onAutoArrange,
  showGrid = false,
  onToggleGrid,
  showSections = true,
  onToggleSections,
  isPanning = false,
  selectedEntity = null,
  onEditEntity,
  onDeleteEntity,
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`toolbar-gradient sticky top-0 z-40 px-6 py-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Zap" className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trifecta Flow
            </h1>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
<div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={onShowTemplates}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Package" className="w-4 h-4" />
              Templates
            </Button>
            
            <Button
              variant="outline"
              onClick={onCreateEntity}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              Add Entity
            </Button>
            
            <Button
              variant="outline"
              onClick={onAutoArrange}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Shuffle" className="w-4 h-4" />
              Auto Arrange
            </Button>
          </div>
          
          {/* Entity Management Controls */}
          {selectedEntity && (
            <>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
                  <ApperIcon name="Target" className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {selectedEntity.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => onEditEntity && onEditEntity(selectedEntity)}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDeleteEntity && onDeleteEntity(selectedEntity.Id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </>
          )}
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-2">
            <Button
              variant={showGrid ? "primary" : "outline"}
              onClick={onToggleGrid}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Grid3x3" className="w-4 h-4" />
              Grid
            </Button>
            
            <Button
              variant={showSections ? "primary" : "outline"}
              onClick={onToggleSections}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Layout" className="w-4 h-4" />
              Sections
            </Button>
          </div>
        </div>

<div className="flex items-center gap-3">
          {/* Pan Mode Indicator */}
          {isPanning && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
              <ApperIcon name="Move" className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Panning</span>
            </div>
          )}
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              disabled={zoom <= 0.5}
              className="p-2"
            >
              <ApperIcon name="ZoomOut" className="w-4 h-4" />
            </Button>
            
            <span className="px-2 py-1 text-sm font-medium text-gray-700 min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              disabled={zoom >= 2}
              className="p-2"
            >
              <ApperIcon name="ZoomIn" className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={onResetView}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
            Reset View
          </Button>

          <Button
            variant={viewMode === "3d" ? "primary" : "outline"}
            onClick={onToggleView}
            className="flex items-center gap-2"
          >
            <ApperIcon name={viewMode === "3d" ? "Box" : "Square"} className="w-4 h-4" />
            {viewMode === "3d" ? "3D View" : "2D View"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CanvasToolbar;