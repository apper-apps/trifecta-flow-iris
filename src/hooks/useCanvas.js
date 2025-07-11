import { useState, useCallback } from "react";

const useCanvas = (initialZoom = 1, initialPan = { x: 0, y: 0 }) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState(initialPan);
  const [isDragging, setIsDragging] = useState(false);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
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
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handlePanStart,
    handlePanEnd,
    handlePan,
    setPan,
  };
};

export default useCanvas;