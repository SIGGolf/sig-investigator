import { NodeRecord, EdgeRecord, EntityType, Certainty, Nature } from './schemas';

export const cyLayout = {
  name: 'dagre',
  rankDir: 'LR',
  spacingFactor: 1.2,
  nodeDimensionsIncludeLabels: true,
  animate: true,
  animationDuration: 500,
  fit: true,
  padding: 50,
};

export const getNodeShape = (type: EntityType): string => {
  switch (type) {
    case 'Person': return 'ellipse';
    case 'Company': return 'rectangle';
    case 'CryptoWallet': return 'diamond';
    case 'Asset': return 'hexagon';
    case 'Unknown': return 'roundrectangle';
    default: return 'ellipse';
  }
};

export const getNodeColor = (type: EntityType): string => {
  switch (type) {
    case 'Person': return '#e9f0ff';
    case 'Company': return '#e9ffe9';
    case 'CryptoWallet': return '#ffe9e9';
    case 'Asset': return '#fff9e9';
    case 'Unknown': return '#f6f6f6';
    default: return '#f6f6f6';
  }
};

export const getNodeBorderColor = (type: EntityType): string => {
  switch (type) {
    case 'Person': return '#6b87c4';
    case 'Company': return '#69a56a';
    case 'CryptoWallet': return '#b66';
    case 'Asset': return '#d4a017';
    case 'Unknown': return '#bdbdbd';
    default: return '#bdbdbd';
  }
};

export const getEdgeStyle = (certainty: Certainty): string => {
  return certainty === 'Confirmed' ? 'solid' : 'dashed';
};

export const getEdgeColor = (nature: Nature): string => {
  switch (nature) {
    case 'Illicit': return '#d33';
    case 'Neutral': return '#9a9a9a';
    case 'Legitimate': return '#3a3';
    default: return '#9a9a9a';
  }
};

export const getEdgeWidth = (amount?: number): number => {
  if (!amount) return 1;
  if (amount < 1000) return 1;
  if (amount < 10000) return 2;
  if (amount < 100000) return 3;
  return 4;
};

export const cyStyle: any = [
  // Node styles
  {
    selector: 'node',
    style: {
      'background-color': 'data(color)',
      'border-color': 'data(borderColor)',
      'border-width': 1,
      'shape': 'data(shape)',
      'width': 80,
      'height': 60,
      'label': 'data(label)',
      'text-wrap': 'wrap',
      'text-max-width': 70,
      'font-size': 10,
      'text-valign': 'center',
      'text-halign': 'center',
      'color': '#333',
    }
  },
  
  // Edge styles
  {
    selector: 'edge',
    style: {
      'width': 'data(width)',
      'line-color': 'data(color)',
      'target-arrow-color': 'data(color)',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'line-style': 'data(style)',
      'label': 'data(label)',
      'font-size': 8,
      'text-rotation': 'autorotate',
      'text-margin-y': -10,
      'color': 'data(color)',
    }
  },
  
  // Selected elements
  {
    selector: 'node:selected',
    style: {
      'border-width': 3,
      'border-color': '#007bff',
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'width': 'data(width)',
      'line-color': '#007bff',
      'target-arrow-color': '#007bff',
    }
  },
  
  // Hover effects
  {
    selector: 'node:hover',
    style: {
      'border-width': 2,
      'border-color': '#007bff',
    }
  },
  {
    selector: 'edge:hover',
    style: {
      'width': 'data(width)',
      'line-color': '#007bff',
      'target-arrow-color': '#007bff',
    }
  }
];

export const createCytoscapeElements = (nodes: NodeRecord[], edges: EdgeRecord[]) => {
  const elements = {
    nodes: nodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        role: node.role,
        detail: node.detail,
        tags: node.tags,
        riskScore: node.riskScore,
        selectors: node.selectors,
        color: getNodeColor(node.type),
        borderColor: getNodeBorderColor(node.type),
        shape: getNodeShape(node.type),
      }
    })),
    edges: edges.map(edge => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.description || '',
        certainty: edge.certainty,
        nature: edge.nature,
        date: edge.date,
        amount: edge.amount,
        currency: edge.currency,
        references: edge.references,
        color: getEdgeColor(edge.nature),
        style: getEdgeStyle(edge.certainty),
        width: getEdgeWidth(edge.amount),
      }
    }))
  };
  
  return elements;
}; 