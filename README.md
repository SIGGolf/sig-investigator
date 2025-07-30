# SIG Investigator

A full-stack investigation network graph tool for SIG, built with Next.js 14, TypeScript, and Cytoscape.js.

## Features

- **Interactive Network Graph**: Visualize entities and relationships using Cytoscape.js with dagre layout
- **Entity Types**: Support for Persons, Companies, Crypto Wallets, Assets, and Unknown entities
- **Relationship Styling**: Visual distinction between Confirmed/Suspected and Illicit/Neutral/Legitimate relationships
- **CSV Import**: Import timeline and entity matrix data from CSV files
- **Export Capabilities**: Export graphs as PNG, SVG, JSON, and generate DOCX reports
- **Search & Filtering**: Advanced filtering by entity type, certainty, nature, and date ranges
- **Chain of Custody**: SHA256 hashing for imported files
- **Mermaid Integration**: Generate and preview Mermaid diagrams
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Graph Visualization**: Cytoscape.js, cytoscape-dagre
- **State Management**: Zustand
- **Data Validation**: Zod
- **CSV Parsing**: PapaParse
- **Export**: html-to-image, docx
- **Date Handling**: date-fns, date-fns-tz
- **Icons**: Lucide React

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a package manager:
     ```bash
     # Windows (using winget)
     winget install OpenJS.NodeJS
     
     # macOS (using Homebrew)
     brew install node
     
     # Linux (using apt)
     sudo apt update && sudo apt install nodejs npm
     ```

2. **Clone and install dependencies**:
   ```bash
   cd sig-investigator
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Basic Navigation

- **Zoom**: Use mouse wheel or zoom controls in the top-right
- **Pan**: Click and drag to move around the graph
- **Select**: Click on nodes or edges to view details
- **Reset View**: Click the reset button to fit all elements

### Importing Data

1. Click the "Import" button in the header
2. Upload CSV files:
   - `expanded_timeline.csv` - Timeline data with entities and events
   - `witness_entity_matrix.csv` - Entity relationship matrix
3. The graph will automatically update with new nodes and relationships

### Exporting

- **PNG/SVG**: Export high-quality images of the current graph view
- **JSON**: Export the complete graph data structure
- **DOCX Report**: Generate a comprehensive investigation report

### Filtering

- **Search**: Use the search box to find entities by name, role, or selectors
- **Entity Types**: Filter by Person, Company, Crypto Wallet, etc.
- **Certainty**: Show/hide Confirmed vs Suspected relationships
- **Nature**: Show/hide Illicit, Neutral, or Legitimate relationships

## Data Model

### Entity Types
- **Person**: Individuals involved in the investigation
- **Company**: Organizations and businesses
- **CryptoWallet**: Cryptocurrency wallets and addresses
- **Asset**: Physical or digital assets
- **Unknown**: Entities with undetermined type

### Relationship Properties
- **Certainty**: Confirmed or Suspected
- **Nature**: Illicit, Neutral, or Legitimate
- **Amount**: Financial amounts with currency
- **Date**: ISO timestamp
- **References**: Supporting evidence or exhibits

## File Structure

```
sig-investigator/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── GraphCanvas.tsx   # Main graph component
├── lib/                  # Utility libraries
│   ├── schemas.ts        # Zod schemas and types
│   ├── store.ts          # Zustand state management
│   ├── cyStyle.ts        # Cytoscape styling
│   ├── mapping.ts        # CSV mapping utilities
│   ├── export.ts         # Export functions
│   ├── hashing.ts        # SHA256 utilities
│   └── docxReport.ts     # DOCX report generation
├── public/               # Static assets
│   └── seed.json         # Initial graph data
└── package.json          # Dependencies and scripts
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Entity Types**: Update `schemas.ts` and `cyStyle.ts`
2. **New Export Formats**: Add functions to `export.ts`
3. **New UI Components**: Create in `components/` directory
4. **State Management**: Extend the Zustand store in `store.ts`

## Troubleshooting

### Common Issues

1. **Node.js not found**: Install Node.js from [nodejs.org](https://nodejs.org/)
2. **Port 3000 in use**: Change port in `package.json` scripts
3. **Build errors**: Clear `.next` folder and reinstall dependencies
4. **Graph not loading**: Check browser console for errors

### Performance Tips

- Use filters to reduce graph complexity
- Export large graphs as images rather than interactive views
- Consider using web workers for large CSV imports

## License

This project is proprietary software for SIG. All rights reserved.

## Support

For technical support or feature requests, contact the development team. 