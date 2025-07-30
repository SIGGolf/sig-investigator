'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useInvestigationStore } from '@/lib/store';
import { cyStyle, cyLayout, createCytoscapeElements } from '@/lib/cyStyle';
import { NodeRecord, EdgeRecord } from '@/lib/schemas';

// Register dagre layout
cytoscape.use(dagre);

interface GraphCanvasProps {
  className?: string;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    getGraphData, 
    setSelectedNode, 
    setSelectedEdge,
    selectedNode,
    selectedEdge 
  } = useInvestigationStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape
    cyRef.current = cytoscape({
      container: containerRef.current,
      style: cyStyle,
      layout: cyLayout,
      elements: {
        nodes: [],
        edges: []
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      selectionType: 'single',
    });

    // Event handlers
    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeData = node.data();
      const nodeRecord: NodeRecord = {
        id: nodeData.id,
        label: nodeData.label,
        type: nodeData.type,
        role: nodeData.role,
        detail: nodeData.detail,
        tags: nodeData.tags,
        riskScore: nodeData.riskScore,
        selectors: nodeData.selectors,
        createdAt: nodeData.createdAt,
        updatedAt: nodeData.updatedAt,
      };
      setSelectedNode(nodeRecord);
    });

    cyRef.current.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      const edgeData = edge.data();
      const edgeRecord: EdgeRecord = {
        id: edgeData.id,
        source: edgeData.source,
        target: edgeData.target,
        description: edgeData.label,
        certainty: edgeData.certainty,
        nature: edgeData.nature,
        date: edgeData.date,
        amount: edgeData.amount,
        currency: edgeData.currency,
        references: edgeData.references,
      };
      setSelectedEdge(edgeRecord);
    });

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    setIsLoading(false);

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [setSelectedNode, setSelectedEdge]);

  // Update graph when data changes
  useEffect(() => {
    if (!cyRef.current) return;

    const graphData = getGraphData();
    const elements = createCytoscapeElements(graphData.nodes, graphData.edges);
    
    cyRef.current.elements().remove();
    cyRef.current.add(elements);
    cyRef.current.layout(cyLayout).run();
  }, [getGraphData]);

  // Highlight selected elements
  useEffect(() => {
    if (!cyRef.current) return;

    // Clear previous selections
    cyRef.current.elements().removeClass('highlighted');

    if (selectedNode) {
      const node = cyRef.current.getElementById(selectedNode.id);
      if (node.length > 0) {
        node.addClass('highlighted');
        cyRef.current.fit(node, { padding: 50 });
      }
    }

    if (selectedEdge) {
      const edge = cyRef.current.getElementById(selectedEdge.id);
      if (edge.length > 0) {
        edge.addClass('highlighted');
        const source = edge.source();
        const target = edge.target();
        cyRef.current.fit([source, target], { padding: 50 });
      }
    }
  }, [selectedNode, selectedEdge]);

  const handleResetView = () => {
    if (cyRef.current) {
      cyRef.current.fit();
    }
  };

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() * 1.2,
        renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 }
      });
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() / 1.2,
        renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 }
      });
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50"
          title="Zoom In"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50"
          title="Reset View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
          <div className="text-lg">Loading graph...</div>
        </div>
      )}

      {/* Graph container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gray-50"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}; 