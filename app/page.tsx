'use client';

import React, { useEffect } from 'react';
import { GraphCanvas } from '@/components/GraphCanvas';
import { useInvestigationStore } from '@/lib/store';
import { GraphData } from '@/lib/schemas';

export default function Home() {
  const { setNodes, setEdges } = useInvestigationStore();

  // Load seed data on mount
  useEffect(() => {
    const loadSeedData = async () => {
      try {
        console.log('Loading seed data...');
        const response = await fetch('/seed.json');
        console.log('Seed data response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const seedData: GraphData = await response.json();
        console.log('Seed data loaded:', seedData);
        
        setNodes(seedData.nodes);
        setEdges(seedData.edges);
        
        console.log('Seed data set in store');
      } catch (error) {
        console.error('Failed to load seed data:', error);
      }
    };

    loadSeedData();
  }, [setNodes, setEdges]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                SIG Investigator
              </h1>
              <span className="ml-2 text-sm text-gray-500">
                Izzy Fox Investigation
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Export
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Import
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Investigation Network Graph
            </h2>
            <div className="h-96">
              <GraphCanvas />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 