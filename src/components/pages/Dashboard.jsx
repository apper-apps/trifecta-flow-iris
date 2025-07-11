import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { detectStructureGaps, getDefaultZone } from "@/utils/entityUtils";
import ApperIcon from "@/components/ApperIcon";
import Canvas from "@/components/organisms/Canvas";
import EntityTemplateLibrary from "@/components/organisms/EntityTemplateLibrary";
import CanvasToolbar from "@/components/organisms/CanvasToolbar";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import EntityForm from "@/components/molecules/EntityForm";
import useCanvas from "@/hooks/useCanvas";
import { aiTipService } from "@/services/api/aiTipService";
import { entityService } from "@/services/api/entityService";
const Dashboard = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showEntityForm, setShowEntityForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [viewMode, setViewMode] = useState("2d");
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showSections, setShowSections] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  
  // Canvas controls using custom hook
  const {
    zoom,
    pan,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handlePanStart,
    handlePanEnd,
    handlePan,
    setPan,
  } = useCanvas(1, { x: 0, y: 0 });
  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await entityService.getAll();
      setEntities(data);
    } catch (err) {
      setError("Failed to load entities. Please try again.");
      console.error("Error loading entities:", err);
    } finally {
      setLoading(false);
    }
  };

const handleCreateEntity = async (entityData) => {
    try {
      const newEntity = await entityService.create({
        ...entityData,
        position: selectedTemplate?.position || { x: 100, y: 100 },
        zone: getDefaultZone(entityData.type),
        connections: [],
      });
      setEntities(prev => [...prev, newEntity]);
      setShowEntityForm(false);
      setSelectedTemplate(null);
      toast.success("Entity created successfully!");
    } catch (err) {
      toast.error("Failed to create entity");
      console.error("Error creating entity:", err);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowEntityForm(true);
  };

  const handleGapDetection = async (currentEntities) => {
    try {
      const gaps = detectStructureGaps(currentEntities);
      
      if (gaps.length > 0) {
        // Show AI tip for the first gap found
        const firstGap = gaps[0];
        const aiTip = {
          trigger: firstGap.type,
          message: firstGap.message,
          priority: firstGap.priority
        };
        
        // Store AI tip for display
        await aiTipService.create(aiTip);
        
        // Show toast notification
        if (firstGap.priority === "high") {
          toast.warning(firstGap.message);
        } else {
          toast.info(firstGap.message);
        }
      }
    } catch (err) {
      console.error("Error detecting gaps:", err);
    }
  };

  const handleUpdateEntity = async (entityData) => {
    try {
      const updatedEntity = await entityService.update(editingEntity.Id, entityData);
      setEntities(prev => prev.map(e => e.Id === editingEntity.Id ? updatedEntity : e));
      setEditingEntity(null);
      setShowEntityForm(false);
      toast.success("Entity updated successfully!");
    } catch (err) {
      toast.error("Failed to update entity");
      console.error("Error updating entity:", err);
    }
  };

  const handleEntityUpdate = async (updatedEntity) => {
    try {
      const updated = await entityService.update(updatedEntity.Id, updatedEntity);
      setEntities(prev => prev.map(e => e.Id === updatedEntity.Id ? updated : e));
    } catch (err) {
      toast.error("Failed to update entity position");
      console.error("Error updating entity:", err);
    }
  };
const handleEditEntity = (entity) => {
    setEditingEntity(entity);
    setShowEntityForm(true);
  };

  const handleDeleteEntity = async (entityId) => {
    try {
      await entityService.delete(entityId);
      setEntities(prev => prev.filter(e => e.Id !== entityId));
      setSelectedEntity(null);
      setEntityToDelete(null);
      setShowDeleteConfirm(false);
      toast.success("Entity deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete entity");
      console.error("Error deleting entity:", err);
    }
  };

  const handleDeleteConfirm = (entityId) => {
    const entity = entities.find(e => e.Id === entityId);
    if (entity) {
      setEntityToDelete(entity);
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setEntityToDelete(null);
    setShowDeleteConfirm(false);
  };

  const getDefaultZone = (type) => {
    switch (type) {
      case "s-corp":
      case "business":
        return "operations";
      case "llc":
      case "property":
      case "investment":
        return "assets";
      case "trust":
        return "foundation";
      default:
        return "operations";
    }
  };

  const handleAutoArrange = () => {
    const zonePositions = {
      operations: { x: 150, y: 150 },
      assets: { x: 700, y: 150 },
      foundation: { x: 150, y: 450 },
      flow: { x: 150, y: 650 },
    };

    const zoneCounters = {
      operations: 0,
      assets: 0,
      foundation: 0,
      flow: 0,
    };

    const updatedEntities = entities.map(entity => {
      const zone = entity.zone || getDefaultZone(entity.type);
      const basePosition = zonePositions[zone];
      const offset = zoneCounters[zone] * 200;
      
      zoneCounters[zone]++;

      return {
        ...entity,
        position: {
          x: basePosition.x + (offset % 400),
          y: basePosition.y + Math.floor(offset / 400) * 120,
        },
        zone,
      };
    });

    setEntities(updatedEntities);
    toast.success("Entities auto-arranged!");
};

  const handleToggleView = () => {
    setViewMode(prev => prev === "2d" ? "3d" : "2d");
    toast.info(`Switched to ${viewMode === "2d" ? "3D" : "2D"} view`);
  };

  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
    toast.info(`Grid view ${showGrid ? "disabled" : "enabled"}`);
  };

  const handleToggleSections = () => {
    setShowSections(prev => !prev);
    toast.info(`Sections view ${showSections ? "disabled" : "enabled"}`);
  };

  // Get effective view mode for canvas
  const getCanvasViewMode = () => {
    if (showGrid) return "grid";
    if (showSections) return "sections";
    return viewMode;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEntities} />;
  }

return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <CanvasToolbar
        onCreateEntity={() => setShowEntityForm(true)}
        onToggleView={handleToggleView}
        onShowTemplates={() => setShowTemplateLibrary(true)}
        viewMode={viewMode}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onAutoArrange={handleAutoArrange}
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
        showSections={showSections}
        onToggleSections={handleToggleSections}
        isPanning={isDragging}
        selectedEntity={selectedEntity}
        onEditEntity={handleEditEntity}
        onDeleteEntity={handleDeleteConfirm}
      />
      <div className="flex-1 relative overflow-hidden">
        {entities.length === 0 ? (
          <Empty
            title="No entities yet"
            description="Create your first entity to start building your Trifecta structure"
            actionLabel="Create Entity"
            onAction={() => setShowEntityForm(true)}
          />
        ) : (
<Canvas
              entities={entities}
              onEntityUpdate={handleEntityUpdate}
              onEntitySelect={setSelectedEntity}
              selectedEntity={selectedEntity}
              onEntityEdit={handleEditEntity}
              onEntityDelete={handleDeleteConfirm}
              viewMode={getCanvasViewMode()}
              zoom={zoom}
              pan={pan}
              onPanChange={setPan}
              onGapDetection={handleGapDetection}
              className="w-full h-full"
            />
          )}
      </div>

{showEntityForm && (
        <EntityForm
          initialData={editingEntity}
          selectedTemplate={selectedTemplate}
          onSubmit={editingEntity ? handleUpdateEntity : handleCreateEntity}
          onCancel={() => {
            setShowEntityForm(false);
            setEditingEntity(null);
            setSelectedTemplate(null);
          }}
        />
      )}

      <EntityTemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onTemplateSelect={handleTemplateSelect}
/>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && entityToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Entity</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{entityToDelete.name}</strong>? 
              This will remove all connections and data associated with this entity.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={() => handleDeleteEntity(entityToDelete.Id)}
                className="flex-1"
              >
                Delete Entity
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;