import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import EntityCard from "@/components/molecules/EntityCard";
import CanvasZones from "@/components/organisms/CanvasZones";
import MiniMap from "@/components/molecules/MiniMap";
import AITip from "@/components/molecules/AITip";
import { aiTipService } from "@/services/api/aiTipService";
import { getMagneticSnapPoints, findNearestSnapPoint, getConnectionType, getConnectionColor } from "@/utils/entityUtils";

const Canvas = ({ 
  entities = [], 
  onEntityUpdate,
  onEntitySelect,
  selectedEntity = null,
  onEntityEdit,
  onEntityDelete,
  viewMode = "2d",
  zoom = 1,
  pan = { x: 0, y: 0 },
  onPanChange,
  onGapDetection,
  className 
}) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEntity, setDraggedEntity] = useState(null);
  const [highlightedZone, setHighlightedZone] = useState(null);
  const [aiTip, setAiTip] = useState(null);
  const [aiTipVisible, setAiTipVisible] = useState(false);
  const [aiTipPosition, setAiTipPosition] = useState({ x: 0, y: 0 });
  const [snapPoints, setSnapPoints] = useState([]);
  const [activeSnapPoint, setActiveSnapPoint] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [hoveredConnection, setHoveredConnection] = useState(null);
const canvasSize = { width: 1200, height: 800 };
  const viewportSize = { width: 800, height: 600 };

  useEffect(() => {
    setSnapPoints(getMagneticSnapPoints(canvasSize));
  }, [canvasSize]);

  // Enhanced gap detection
  useEffect(() => {
    if (entities.length > 0 && onGapDetection) {
      const timer = setTimeout(() => {
        onGapDetection(entities);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [entities, onGapDetection]);

// Handle entity drag with magnetic snapping
  const handleEntityDragStart = (e, entity) => {
    setIsDragging(true);
    setDraggedEntity(entity);
    e.dataTransfer.setData("text/plain", entity.Id.toString());
  };
  const handleEntityDragEnd = (e) => {
    setIsDragging(false);
    setDraggedEntity(null);
    setHighlightedZone(null);
    setActiveSnapPoint(null);
  };

  const handleEntityDragOver = (e) => {
    e.preventDefault();
    if (isDragging && draggedEntity) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const nearestSnap = findNearestSnapPoint({ x, y }, snapPoints);
      setActiveSnapPoint(nearestSnap);
    }
  };
// Handle zone drop with magnetic snapping
const handleZoneDrop = (e, zone) => {
    e.preventDefault();
    const entityId = e.dataTransfer.getData("text/plain");
    const entity = entities.find(e => e.Id === parseInt(entityId));
    
    if (entity && entity.zone !== zone) {
      const rect = canvasRef.current.getBoundingClientRect();
      let x = (e.clientX - rect.left - pan.x) / zoom;
      let y = (e.clientY - rect.top - pan.y) / zoom;
      
      // Apply magnetic snapping
      if (activeSnapPoint) {
        x = activeSnapPoint.x;
        y = activeSnapPoint.y;
      }
      
      const updatedEntity = {
        ...entity,
        zone,
        position: { x, y }
      };
      
      onEntityUpdate(updatedEntity);
      
      // Show AI tip for zone placement
      showAITip(zone, { x: e.clientX, y: e.clientY });
    }
  };

  // Connection handling
  const handleConnectionStart = (entity) => {
    setIsConnecting(true);
    setConnectionStart(entity);
  };

  const handleConnectionEnd = (targetEntity) => {
    if (connectionStart && targetEntity && connectionStart.Id !== targetEntity.Id) {
      const updatedStartEntity = {
        ...connectionStart,
        connections: [...(connectionStart.connections || []), targetEntity.Id]
      };
      onEntityUpdate(updatedStartEntity);
      showAITip("connection", { x: 400, y: 300 });
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };
const handleZoneDragOver = (e) => {
    e.preventDefault();
    handleEntityDragOver(e);
  };
  // AI tip functionality
  const showAITip = async (trigger, position) => {
    try {
      const tips = await aiTipService.getTipsByTrigger(trigger);
      if (tips.length > 0) {
        setAiTip(tips[0]);
        setAiTipPosition(position);
        setAiTipVisible(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setAiTipVisible(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error showing AI tip:", error);
    }
  };

// Handle canvas panning
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

const handleCanvasMouseDown = (e) => {
    // Only allow panning if clicking on canvas background, not on entities
    if (e.target === canvasRef.current || e.target.closest('.canvas-background')) {
      const isClickingEntity = e.target.closest('.entity-card');
      if (!isClickingEntity) {
        setIsPanning(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning && onPanChange) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      onPanChange(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCanvasMouseMove);
        document.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }
  }, [isPanning, lastMousePos]);

const getZoneFromPosition = (x, y) => {
    const zones = [
      { id: "operations", bounds: { x: 0.05, y: 0.05, width: 0.4, height: 0.4 } },
      { id: "assets", bounds: { x: 0.55, y: 0.05, width: 0.4, height: 0.4 } },
      { id: "foundation", bounds: { x: 0.05, y: 0.5, width: 0.9, height: 0.3 } },
      { id: "flow", bounds: { x: 0.05, y: 0.85, width: 0.9, height: 0.1 } },
    ];

    // Use absolute positioning instead of relative
    for (const zone of zones) {
      const zoneLeft = canvasSize.width * zone.bounds.x;
      const zoneTop = canvasSize.height * zone.bounds.y;
      const zoneRight = zoneLeft + (canvasSize.width * zone.bounds.width);
      const zoneBottom = zoneTop + (canvasSize.height * zone.bounds.height);
      
      if (x >= zoneLeft && x <= zoneRight && y >= zoneTop && y <= zoneBottom) {
        return zone.id;
      }
    }
    return null;
  };

return (
    <div className={cn("relative flex-1 overflow-hidden bg-white", className)}>
      {/* Canvas Container */}
      <div 
        className="relative w-full h-full overflow-hidden"
        onMouseDown={handleCanvasMouseDown}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Canvas Background */}
        <div
          className={cn(
            "canvas-background absolute inset-0 z-0",
            viewMode === "grid" && "canvas-grid",
            viewMode === "sections" && "canvas-sections"
          )}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
        />
        
        {/* Canvas Content */}
        <motion.div
          ref={canvasRef}
          className="absolute inset-0 z-10"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
<div
            className="relative w-full h-full"
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
            }}
            onDrop={(e) => {
              const rect = canvasRef.current.getBoundingClientRect();
              const zone = getZoneFromPosition(
                (e.clientX - rect.left - pan.x) / zoom,
                (e.clientY - rect.top - pan.y) / zoom
              );
              if (zone) {
                handleZoneDrop(e, zone);
              }
            }}
            onDragOver={handleZoneDragOver}
          >
        {/* Zones */}
        <CanvasZones
          canvasSize={canvasSize}
          onZoneHover={setHighlightedZone}
          highlightedZone={highlightedZone}
        />

        {/* Entities */}
<AnimatePresence>
          {entities.map((entity) => (
            <motion.div
              key={entity.Id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute"
              style={{
                left: entity.position.x,
                top: entity.position.y,
                zIndex: selectedEntity?.Id === entity.Id ? 10 : 5,
              }}
            >
<EntityCard
                  entity={entity}
                  isDragging={draggedEntity?.Id === entity.Id}
                  onDragStart={(e) => handleEntityDragStart(e, entity)}
                  onDragEnd={handleEntityDragEnd}
                  onClick={() => onEntitySelect(entity)}
                  onConnectionStart={() => handleConnectionStart(entity)}
                  onConnectionEnd={() => handleConnectionEnd(entity)}
                  isConnecting={isConnecting}
                  connectionStart={connectionStart}
                  onEdit={onEntityEdit}
                  onDelete={onEntityDelete}
                  isSelected={selectedEntity?.Id === entity.Id}
                  className={cn(
                    selectedEntity?.Id === entity.Id && "ring-2 ring-blue-500"
                  )}
                />
            </motion.div>
          ))}
        </AnimatePresence>

{/* Enhanced Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {entities.map((entity) => 
            entity.connections?.map((connectionId) => {
              const connectedEntity = entities.find(e => e.Id === connectionId);
              if (!connectedEntity) return null;

              const connectionType = getConnectionType(entity, connectedEntity);
              const connectionColor = getConnectionColor(connectionType, entity, connectedEntity);
              const isHovered = hoveredConnection === `${entity.Id}-${connectionId}`;

              return (
                <g key={`${entity.Id}-${connectionId}`}>
                  {/* Connection line */}
                  <line
                    className={cn(
                      "transition-all duration-300",
                      isHovered ? "opacity-100" : "opacity-70"
                    )}
                    x1={entity.position.x + 90}
                    y1={entity.position.y + 50}
                    x2={connectedEntity.position.x + 90}
                    y2={connectedEntity.position.y + 50}
                    stroke={connectionColor}
                    strokeWidth={connectionType === "ownership" ? 4 : 2}
                    strokeDasharray={connectionType === "income-flow" ? "8,4" : "none"}
                    onMouseEnter={() => setHoveredConnection(`${entity.Id}-${connectionId}`)}
                    onMouseLeave={() => setHoveredConnection(null)}
                  />
                  
                  {/* Arrow marker */}
                  <defs>
                    <marker
                      id={`arrow-${entity.Id}-${connectionId}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3, 0 6"
                        fill={connectionColor}
                      />
                    </marker>
                  </defs>
                  
                  {/* Apply arrow to line */}
                  <line
                    x1={entity.position.x + 90}
                    y1={entity.position.y + 50}
                    x2={connectedEntity.position.x + 90}
                    y2={connectedEntity.position.y + 50}
                    stroke={connectionColor}
                    strokeWidth={connectionType === "ownership" ? 4 : 2}
                    strokeDasharray={connectionType === "income-flow" ? "8,4" : "none"}
                    markerEnd={`url(#arrow-${entity.Id}-${connectionId})`}
                    opacity={isHovered ? 1 : 0.7}
                    className="transition-opacity duration-300"
                  />

                  {/* Pulsing effect on hover */}
                  {isHovered && (
                    <line
                      x1={entity.position.x + 90}
                      y1={entity.position.y + 50}
                      x2={connectedEntity.position.x + 90}
                      y2={connectedEntity.position.y + 50}
                      stroke={connectionColor}
                      strokeWidth={connectionType === "ownership" ? 8 : 4}
                      opacity="0.3"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            }) || []
          )}
        </svg>

        {/* Magnetic Snap Points */}
        {isDragging && activeSnapPoint && (
          <motion.div
            className="absolute w-6 h-6 border-2 border-blue-500 rounded-full bg-blue-100"
            style={{
              left: activeSnapPoint.x - 12,
              top: activeSnapPoint.y - 12,
              zIndex: 20
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
)}
          </div>
        </motion.div>
      </div>

{/* Mini Map */}
<div className="absolute bottom-4 right-4 z-30">
        {/* Only render MiniMap when dimensions are valid to prevent canvas errors */}
        {canvasSize.width > 0 && canvasSize.height > 0 && 
         viewportSize.width > 0 && viewportSize.height > 0 && 
         entities.length > 0 && (
          <MiniMap
            entities={entities}
            canvasSize={canvasSize}
            viewportSize={viewportSize}
            pan={pan}
            zoom={zoom}
            onNavigate={onPanChange}
          />
        )}
      </div>
      {/* AI Tip */}
      <AITip
        tip={aiTip}
        isVisible={aiTipVisible}
        onClose={() => setAiTipVisible(false)}
        position={aiTipPosition}
      />
    </div>
  );
};

export default Canvas;