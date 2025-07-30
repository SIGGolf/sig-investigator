import { create } from 'zustand';
import { NodeRecord, EdgeRecord, TimelineRow, MatrixRow, GraphData } from './schemas';

interface InvestigationState {
  // Graph data
  nodes: NodeRecord[];
  edges: EdgeRecord[];
  
  // Timeline and evidence
  timeline: TimelineRow[];
  matrix: MatrixRow[];
  
  // UI state
  selectedNode: NodeRecord | null;
  selectedEdge: EdgeRecord | null;
  searchTerm: string;
  filters: {
    showSuspected: boolean;
    showLegitimate: boolean;
    entityTypes: string[];
    dateRange: { start: string; end: string } | null;
  };
  
  // Import files
  importedFiles: Array<{
    name: string;
    hash: string;
    type: 'timeline' | 'matrix';
  }>;
  
  // Actions
  setNodes: (nodes: NodeRecord[]) => void;
  setEdges: (edges: EdgeRecord[]) => void;
  addNode: (node: NodeRecord) => void;
  updateNode: (id: string, updates: Partial<NodeRecord>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: EdgeRecord) => void;
  updateEdge: (id: string, updates: Partial<EdgeRecord>) => void;
  deleteEdge: (id: string) => void;
  
  setTimeline: (timeline: TimelineRow[]) => void;
  setMatrix: (matrix: MatrixRow[]) => void;
  
  setSelectedNode: (node: NodeRecord | null) => void;
  setSelectedEdge: (edge: EdgeRecord | null) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<InvestigationState['filters']>) => void;
  
  addImportedFile: (file: { name: string; hash: string; type: 'timeline' | 'matrix' }) => void;
  
  // Computed selectors
  getFilteredNodes: () => NodeRecord[];
  getFilteredEdges: () => EdgeRecord[];
  getGraphData: () => GraphData;
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  timeline: [],
  matrix: [],
  selectedNode: null,
  selectedEdge: null,
  searchTerm: '',
  filters: {
    showSuspected: true,
    showLegitimate: true,
    entityTypes: [],
    dateRange: null,
  },
  importedFiles: [],
  
  // Actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node] 
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(node => 
      node.id === id ? { ...node, ...updates, updatedAt: new Date().toISOString() } : node
    )
  })),
  
  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter(node => node.id !== id),
    edges: state.edges.filter(edge => edge.source !== id && edge.target !== id)
  })),
  
  addEdge: (edge) => set((state) => ({ 
    edges: [...state.edges, edge] 
  })),
  
  updateEdge: (id, updates) => set((state) => ({
    edges: state.edges.map(edge => 
      edge.id === id ? { ...edge, ...updates } : edge
    )
  })),
  
  deleteEdge: (id) => set((state) => ({
    edges: state.edges.filter(edge => edge.id !== id)
  })),
  
  setTimeline: (timeline) => set({ timeline }),
  setMatrix: (matrix) => set({ matrix }),
  
  setSelectedNode: (node) => set({ selectedNode: node, selectedEdge: null }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  addImportedFile: (file) => set((state) => ({
    importedFiles: [...state.importedFiles, file]
  })),
  
  // Computed selectors
  getFilteredNodes: () => {
    const state = get();
    let filtered = state.nodes;
    
    // Filter by search term
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter(node => 
        node.label.toLowerCase().includes(term) ||
        node.role?.toLowerCase().includes(term) ||
        node.detail?.toLowerCase().includes(term) ||
        node.selectors?.emails?.some(email => email.toLowerCase().includes(term)) ||
        node.selectors?.phones?.some(phone => phone.toLowerCase().includes(term)) ||
        node.selectors?.wallets?.some(wallet => wallet.toLowerCase().includes(term))
      );
    }
    
    // Filter by entity type
    if (state.filters.entityTypes.length > 0) {
      filtered = filtered.filter(node => 
        state.filters.entityTypes.includes(node.type)
      );
    }
    
    return filtered;
  },
  
  getFilteredEdges: () => {
    const state = get();
    let filtered = state.edges;
    
    // Filter by certainty
    if (!state.filters.showSuspected) {
      filtered = filtered.filter(edge => edge.certainty === 'Confirmed');
    }
    
    // Filter by nature
    if (!state.filters.showLegitimate) {
      filtered = filtered.filter(edge => edge.nature !== 'Legitimate');
    }
    
    // Filter by date range
    if (state.filters.dateRange) {
      filtered = filtered.filter(edge => {
        if (!edge.date) return true;
        const edgeDate = new Date(edge.date);
        const start = state.filters.dateRange!.start ? new Date(state.filters.dateRange!.start) : null;
        const end = state.filters.dateRange!.end ? new Date(state.filters.dateRange!.end) : null;
        
        if (start && edgeDate < start) return false;
        if (end && edgeDate > end) return false;
        return true;
      });
    }
    
    return filtered;
  },
  
  getGraphData: () => {
    const state = get();
    return {
      nodes: state.getFilteredNodes(),
      edges: state.getFilteredEdges(),
    };
  },
})); 