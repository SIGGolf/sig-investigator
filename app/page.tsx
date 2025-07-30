'use client';

import React, { useEffect, useState } from 'react';
import { GraphCanvas } from '@/components/GraphCanvas';
import { useInvestigationStore } from '@/lib/store';
import { GraphData } from '@/lib/schemas';

export default function Home() {
  const { setNodes, setEdges } = useInvestigationStore();
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
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-lg text-gray-600">Loading investigation data...</div>
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-lg text-red-600">Error: {error}</div>
                </div>
              )}
              {!isLoading && !error && <GraphCanvas />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 