import mockAITips from "@/services/mockData/aiTips.json";

let aiTips = [...mockAITips];

export const aiTipService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...aiTips];
  },

  async getTipsByTrigger(trigger) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return aiTips.filter(tip => tip.trigger === trigger);
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tip = aiTips.find(t => t.Id === id);
    if (!tip) {
      throw new Error(`AI tip with Id ${id} not found`);
    }
    return { ...tip };
  },

  async create(tipData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTip = {
      ...tipData,
      Id: Math.max(...aiTips.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    aiTips.push(newTip);
    return { ...newTip };
  },

  async update(id, tipData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = aiTips.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error(`AI tip with Id ${id} not found`);
    }
    aiTips[index] = {
      ...aiTips[index],
      ...tipData,
      Id: id,
      updatedAt: new Date().toISOString(),
    };
    return { ...aiTips[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = aiTips.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error(`AI tip with Id ${id} not found`);
    }
    aiTips.splice(index, 1);
    return true;
  },
};