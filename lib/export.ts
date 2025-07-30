import { toPng, toSvg } from 'html-to-image';
import { GraphData } from './schemas';

export const exportGraphAsPNG = async (element: HTMLElement, filename: string = 'sig-graph.png'): Promise<void> => {
  try {
    const dataUrl = await toPng(element, {
      quality: 1.0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw error;
  }
};

export const exportGraphAsSVG = async (element: HTMLElement, filename: string = 'sig-graph.svg'): Promise<void> => {
  try {
    const dataUrl = await toSvg(element, {
      quality: 1.0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw error;
  }
};

export const exportGraphAsJSON = (graphData: GraphData, filename: string = 'sig-graph.json'): void => {
  try {
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(dataBlob);
    link.click();
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to export JSON:', error);
    throw error;
  }
};

export const generateMermaid = (graphData: GraphData): string => {
  const { nodes, edges } = graphData;
  
  let mermaid = 'flowchart LR\n';
  
  // Add nodes
  nodes.forEach(node => {
    const label = node.detail 
      ? `${node.label}\\nType: ${node.type}\\n${node.detail}`
      : `${node.label}\\nType: ${node.type}`;
    
    if (node.role) {
      mermaid += `  ${node.id}["${label}\\nRole: ${node.role}"]\n`;
    } else {
      mermaid += `  ${node.id}["${label}"]\n`;
    }
  });
  
  // Add edges
  edges.forEach((edge, index) => {
    const source = edge.source;
    const target = edge.target;
    const description = edge.description || 'Link';
    const certainty = edge.certainty;
    const nature = edge.nature;
    
    if (edge.certainty === 'Confirmed') {
      mermaid += `  ${source} -- "${description}\\n${certainty} | ${nature}" --> ${target}\n`;
    } else {
      mermaid += `  ${source} -. "${description}\\n${certainty} | ${nature}" .-> ${target}\n`;
    }
  });
  
  // Add styling
  mermaid += '\n  classDef person fill:#e9f0ff,stroke:#6b87c4,stroke-width:1px;\n';
  mermaid += '  classDef company fill:#e9ffe9,stroke:#69a56a,stroke-width:1px;\n';
  mermaid += '  classDef wallet fill:#ffe9e9,stroke:#b66,stroke-width:1px;\n';
  mermaid += '  classDef asset fill:#fff9e9,stroke:#d4a017,stroke-width:1px;\n';
  mermaid += '  classDef unknown fill:#f6f6f6,stroke:#bdbdbd,stroke-dasharray:3 3;\n\n';
  
  // Apply classes
  const personNodes = nodes.filter(n => n.type === 'Person').map(n => n.id).join(',');
  const companyNodes = nodes.filter(n => n.type === 'Company').map(n => n.id).join(',');
  const walletNodes = nodes.filter(n => n.type === 'CryptoWallet').map(n => n.id).join(',');
  const assetNodes = nodes.filter(n => n.type === 'Asset').map(n => n.id).join(',');
  const unknownNodes = nodes.filter(n => n.type === 'Unknown').map(n => n.id).join(',');
  
  if (personNodes) mermaid += `  class ${personNodes} person;\n`;
  if (companyNodes) mermaid += `  class ${companyNodes} company;\n`;
  if (walletNodes) mermaid += `  class ${walletNodes} wallet;\n`;
  if (assetNodes) mermaid += `  class ${assetNodes} asset;\n`;
  if (unknownNodes) mermaid += `  class ${unknownNodes} unknown;\n`;
  
  // Add edge styling
  edges.forEach((edge, index) => {
    const color = edge.nature === 'Illicit' ? '#d33' : edge.nature === 'Legitimate' ? '#3a3' : '#9a9a9a';
    const style = edge.certainty === 'Confirmed' ? 'stroke-width:2px' : 'stroke-dasharray:5 5';
    mermaid += `  linkStyle ${index} stroke:${color},${style},color:${color}\n`;
  });
  
  return mermaid;
}; 