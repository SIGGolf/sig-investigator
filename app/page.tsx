'use client';

import React, { useEffect, useState } from 'react';
import { GraphCanvas } from '@/components/GraphCanvas';
import { useInvestigationStore } from '@/lib/store';
import { GraphData } from '@/lib/schemas';

export default function Home() {
  const { setNodes, setEdges, getGraphData } = useInvestigationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load seed data on mount
  useEffect(() => {
    const loadSeedData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading seed data...');
        
        const response = await fetch('/seed.json');
        console.log('Seed data response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const seedData: GraphData = await response.json();
        console.log('Seed data loaded:', seedData);
        
        if (!seedData.nodes || !seedData.edges) {
          throw new Error('Invalid seed data format');
        }
        
        setNodes(seedData.nodes);
        setEdges(seedData.edges);
        
        console.log('Seed data set in store');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load seed data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setIsLoading(false);
      }
    };

    loadSeedData();
  }, [setNodes, setEdges]);

  const graphData = getGraphData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Professional Header */}
      <header className="header-gradient border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    SIG Investigator
                  </h1>
                  <p className="text-sm text-gray-400 font-medium">
                    Professional Investigation Platform
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 ml-8">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Case:</span>
                <span className="text-sm text-gray-300 font-medium">Izzy Fox Investigation</span>
                <span className="status-indicator status-high">High Priority</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-400">
                <span>Entities: {graphData.nodes.length}</span>
                <span>Connections: {graphData.edges.length}</span>
              </div>
              <button className="btn-primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
              <button className="btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Investigation Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6">
              <h3 className="text-heading text-lg mb-4">Investigation Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body text-sm">Total Entities</span>
                    <span className="text-white font-semibold">{graphData.nodes.length}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(graphData.nodes.length / 10) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body text-sm">Connections</span>
                    <span className="text-white font-semibold">{graphData.edges.length}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(graphData.edges.length / 10) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body text-sm">Risk Level</span>
                    <span className="status-indicator status-high">High</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-heading text-lg mb-4">Entity Types</h3>
              <div className="space-y-3">
                {['Person', 'Company', 'CryptoWallet', 'Asset'].map((type) => {
                  const count = graphData.nodes.filter(n => n.type === type).length;
                  return (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-body text-sm">{type}</span>
                      <span className="text-white font-semibold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-heading text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-body">Add New Entity</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-body">Generate Timeline</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-body">Risk Analysis</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Graph Area */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-heading text-xl mb-2">Investigation Network Graph</h2>
                  <p className="text-body text-sm">Interactive visualization of entities and relationships</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Last Updated:</span>
                  <span className="text-sm text-gray-300">{new Date().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="relative h-[600px] cytoscape-container">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-xl z-20">
                    <div className="text-center">
                      <div className="loading-pulse w-8 h-8 bg-blue-600 rounded-full mx-auto mb-4"></div>
                      <div className="text-lg text-gray-300">Loading investigation data...</div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-xl z-20">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="text-lg text-red-400">Error: {error}</div>
                    </div>
                  </div>
                )}
                {!isLoading && !error && <GraphCanvas />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 