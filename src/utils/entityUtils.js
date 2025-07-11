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

export const getEntityTemplates = () => {
  return [
    {
      id: "s-corp-operations",
      name: "S Corp Operations",
      type: "s-corp",
      description: "Active business operations with employment tax optimization",
      category: "operations",
      template: {
        financials: { revenue: 200000, value: null },
        details: "$200K net profit - Online Marketing"
      },
      icon: "Building2",
      searchTags: ["s-corp", "operations", "business", "active", "employment"]
    },
    {
      id: "llc-rental",
      name: "Rental Property LLC",
      type: "llc", 
      description: "Passive rental income with liability protection",
      category: "assets",
      template: {
        financials: { revenue: 48000, value: 400000 },
        details: "Downtown Property - $4K/month"
      },
      icon: "Shield",
      searchTags: ["llc", "rental", "property", "passive", "real estate"]
    },
    {
      id: "trust-family",
      name: "Family Living Trust",
      type: "trust",
      description: "Estate planning with custom inheritance rules",
      category: "foundation", 
      template: {
        financials: { revenue: null, value: 1000000 },
        details: "Kids inherit at 25, not 18 - Avoid inheritance drama!"
      },
      icon: "Vault",
      searchTags: ["trust", "estate", "inheritance", "family", "planning"]
    },
    {
      id: "llc-investment",
      name: "Investment LLC",
      type: "llc",
      description: "Portfolio investments with tax advantages",
      category: "assets",
      template: {
        financials: { revenue: 25000, value: 500000 },
        details: "Diversified Portfolio - 5% annual yield"
      },
      icon: "TrendingUp",
      searchTags: ["llc", "investment", "portfolio", "assets", "yield"]
    }
  ];
};

export const getConnectionType = (fromEntity, toEntity) => {
  // Ownership connections (thick arrows)
  if (fromEntity.type === "trust" && (toEntity.type === "llc" || toEntity.type === "s-corp")) {
    return "ownership";
  }
  // Income flow connections (dashed lines)
  if (fromEntity.type === "llc" && toEntity.type === "s-corp") {
    return "income-flow";
  }
  return "generic";
};

export const getConnectionColor = (connectionType, fromEntity, toEntity) => {
  switch (connectionType) {
    case "ownership":
      return "#3b82f6"; // Blue for ownership
    case "income-flow":
      return "#10b981"; // Green for tax-beneficial flows
    case "risk":
      return "#ef4444"; // Red for potential risks
    default:
      return "#6b7280"; // Gray for generic connections
  }
};

export const getMagneticSnapPoints = (canvasSize) => {
  const snapDistance = 20;
  const gridSize = 50;
  const snapPoints = [];
  
  // Grid-based snap points
  for (let x = 0; x <= canvasSize.width; x += gridSize) {
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      snapPoints.push({ x, y, type: "grid" });
    }
  }
  
  // Zone boundary snap points
  const zones = [
    { x: canvasSize.width * 0.05, y: canvasSize.height * 0.05 },
    { x: canvasSize.width * 0.55, y: canvasSize.height * 0.05 },
    { x: canvasSize.width * 0.05, y: canvasSize.height * 0.5 },
    { x: canvasSize.width * 0.05, y: canvasSize.height * 0.85 },
  ];
  
  zones.forEach(zone => {
    snapPoints.push({ ...zone, type: "zone" });
  });
  
  return snapPoints;
};

export const findNearestSnapPoint = (position, snapPoints, threshold = 20) => {
  let nearestPoint = null;
  let minDistance = threshold;
  
  for (const point of snapPoints) {
    const distance = Math.sqrt(
      Math.pow(position.x - point.x, 2) + Math.pow(position.y - point.y, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = point;
    }
  }
  
  return nearestPoint;
};

export const detectStructureGaps = (entities) => {
  const gaps = [];
  
  // Check for exposed assets (LLCs not owned by trust)
  const llcs = entities.filter(e => e.type === "llc");
  const trusts = entities.filter(e => e.type === "trust");
  
  llcs.forEach(llc => {
    const hasOwnership = trusts.some(trust => 
      trust.connections && trust.connections.includes(llc.Id)
    );
    
    if (!hasOwnership) {
      gaps.push({
        type: "exposed-asset",
        entity: llc,
        message: `Your ${llc.name} isn't owned by a Trust yet—drag an ownership arrow to lock in privacy protection!`,
        priority: "high"
      });
    }
  });
  
  // Check for missing income optimization
  const sCorps = entities.filter(e => e.type === "s-corp");
  sCorps.forEach(sCorp => {
    if (!sCorp.financials?.revenue || sCorp.financials.revenue < 100000) {
      gaps.push({
        type: "income-optimization",
        entity: sCorp,
        message: "Consider maximizing your S-Corp salary strategy for optimal employment tax savings.",
        priority: "medium"
      });
    }
  });
  
  return gaps;
};