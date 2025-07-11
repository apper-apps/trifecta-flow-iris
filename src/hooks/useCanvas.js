import { useState, useCallback } from "react";

const useCanvas = (initialZoom = 1, initialPan = { x: 0, y: 0 }) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState(initialPan);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState("2d");
  const [showGrid, setShowGrid] = useState(false);
  const [showSections, setShowSections] = useState(true);

const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleToggleView = useCallback(() => {
    setViewMode(prev => prev === "2d" ? "3d" : "2d");
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const handleToggleSections = useCallback(() => {
    setShowSections(prev => !prev);
  }, []);

  const handlePanStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handlePanEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePan = useCallback((deltaX, deltaY) => {
    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
  }, []);

return {
    zoom,
    pan,
    isDragging,
    viewMode,
    showGrid,
    showSections,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleToggleView,
    handleToggleGrid,
    handleToggleSections,
    handlePanStart,
    handlePanEnd,
    handlePan,
    setPan,
    setViewMode,
    setShowGrid,
    setShowSections,
  };
};

export default useCanvas;