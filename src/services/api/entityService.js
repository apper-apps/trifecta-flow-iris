import mockEntities from "@/services/mockData/entities.json";

let entities = [...mockEntities];

export const entityService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...entities];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const entity = entities.find(e => e.Id === id);
    if (!entity) {
      throw new Error(`Entity with Id ${id} not found`);
    }
    return { ...entity };
  },

async create(entityData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newEntity = {
      ...entityData,
      Id: entities.length > 0 ? Math.max(...entities.map(e => e.Id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    entities.push(newEntity);
    return { ...newEntity };
  },

  async update(id, entityData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = entities.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error(`Entity with Id ${id} not found`);
    }
    entities[index] = {
      ...entities[index],
      ...entityData,
      Id: id,
      updatedAt: new Date().toISOString(),
    };
    return { ...entities[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = entities.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error(`Entity with Id ${id} not found`);
    }
    entities.splice(index, 1);
    return true;
  },
};