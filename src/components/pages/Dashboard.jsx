import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import CanvasToolbar from "@/components/organisms/CanvasToolbar";
import Canvas from "@/components/organisms/Canvas";
import EntityForm from "@/components/molecules/EntityForm";
import EntityTemplateLibrary from "@/components/organisms/EntityTemplateLibrary";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { entityService } from "@/services/api/entityService";
import { aiTipService } from "@/services/api/aiTipService";
import { detectStructureGaps } from "@/utils/entityUtils";
const Dashboard = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showEntityForm, setShowEntityForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [viewMode, setViewMode] = useState("2d");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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

  const handleDeleteEntity = async (entityId) => {
    try {
      await entityService.delete(entityId);
      setEntities(prev => prev.filter(e => e.Id !== entityId));
      setSelectedEntity(null);
      toast.success("Entity deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete entity");
      console.error("Error deleting entity:", err);
    }
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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleView = () => {
    setViewMode(prev => prev === "2d" ? "3d" : "2d");
    toast.info(`Switched to ${viewMode === "2d" ? "3D" : "2D"} view`);
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
      />
      <div className="flex-1 relative">
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
            viewMode={viewMode}
            zoom={zoom}
            pan={pan}
            onPanChange={setPan}
            onGapDetection={handleGapDetection}
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
    </div>
  );
};

export default Dashboard;