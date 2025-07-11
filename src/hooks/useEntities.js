import { useState, useEffect } from "react";
import { entityService } from "@/services/api/entityService";

const useEntities = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("Failed to load entities");
      console.error("Error loading entities:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEntity = async (entityData) => {
    try {
      const newEntity = await entityService.create(entityData);
      setEntities(prev => [...prev, newEntity]);
      return newEntity;
    } catch (err) {
      console.error("Error creating entity:", err);
      throw err;
    }
  };

  const updateEntity = async (id, entityData) => {
    try {
      const updatedEntity = await entityService.update(id, entityData);
      setEntities(prev => prev.map(e => e.Id === id ? updatedEntity : e));
      return updatedEntity;
    } catch (err) {
      console.error("Error updating entity:", err);
      throw err;
    }
  };

  const deleteEntity = async (id) => {
    try {
      await entityService.delete(id);
      setEntities(prev => prev.filter(e => e.Id !== id));
    } catch (err) {
      console.error("Error deleting entity:", err);
      throw err;
    }
  };

  return {
    entities,
    loading,
    error,
    loadEntities,
    createEntity,
    updateEntity,
    deleteEntity,
  };
};

export default useEntities;