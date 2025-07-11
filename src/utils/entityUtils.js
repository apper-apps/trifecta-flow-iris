export const getEntityTypeColor = (type) => {
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
      return "default";
  }
};

export const getEntityTypeIcon = (type) => {
  switch (type) {
    case "s-corp":
      return "Building2";
    case "llc":
      return "Shield";
    case "trust":
      return "Vault";
    case "business":
      return "Briefcase";
    case "property":
      return "Home";
    case "investment":
      return "TrendingUp";
    default:
      return "Circle";
  }
};

export const getDefaultZone = (type) => {
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

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateTotalRevenue = (entities) => {
  return entities.reduce((total, entity) => {
    return total + (entity.financials?.revenue || 0);
  }, 0);
};

export const calculateTotalValue = (entities) => {
  return entities.reduce((total, entity) => {
    return total + (entity.financials?.value || 0);
  }, 0);
};

export const getEntitiesByZone = (entities, zone) => {
  return entities.filter(entity => entity.zone === zone);
};

export const validateEntityPosition = (position, canvasSize) => {
  return {
    x: Math.max(0, Math.min(position.x, canvasSize.width - 200)),
    y: Math.max(0, Math.min(position.y, canvasSize.height - 150)),
  };
};