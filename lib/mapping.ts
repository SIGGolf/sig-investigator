import Papa from 'papaparse';
import { TimelineRow, MatrixRow, NodeRecord, EdgeRecord, TimelineRowSchema, MatrixRowSchema } from './schemas';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export const parseTimelineCSV = (csvContent: string): TimelineRow[] => {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    console.error('CSV parsing errors:', result.errors);
  }

  const timelineRows: TimelineRow[] = [];
  
  for (const row of result.data) {
    try {
      const parsed = TimelineRowSchema.parse(row);
      timelineRows.push(parsed);
    } catch (error) {
      console.error('Failed to parse timeline row:', row, error);
    }
  }

  return timelineRows;
};

export const parseMatrixCSV = (csvContent: string): MatrixRow[] => {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    console.error('CSV parsing errors:', result.errors);
  }

  const matrixRows: MatrixRow[] = [];
  
  for (const row of result.data) {
    try {
      const parsed = MatrixRowSchema.parse(row);
      matrixRows.push(parsed);
    } catch (error) {
      console.error('Failed to parse matrix row:', row, error);
    }
  }

  return matrixRows;
};

export const timelineToNodes = (timelineRows: TimelineRow[]): NodeRecord[] => {
  const nodes: NodeRecord[] = [];
  const seenEntities = new Set<string>();

  for (const row of timelineRows) {
    // Process persons
    if (row.persons) {
      const persons = row.persons.split(',').map(p => p.trim()).filter(p => p);
      for (const person of persons) {
        if (!seenEntities.has(person)) {
          seenEntities.add(person);
          nodes.push({
            id: person.toLowerCase().replace(/\s+/g, '_'),
            label: person,
            type: 'Person',
            tags: ['timeline'],
            createdAt: row.timestamp,
          });
        }
      }
    }

    // Process organizations
    if (row.orgs) {
      const orgs = row.orgs.split(',').map(o => o.trim()).filter(o => o);
      for (const org of orgs) {
        if (!seenEntities.has(org)) {
          seenEntities.add(org);
          nodes.push({
            id: org.toLowerCase().replace(/\s+/g, '_'),
            label: org,
            type: 'Company',
            tags: ['timeline'],
            createdAt: row.timestamp,
          });
        }
      }
    }

    // Process wallets
    if (row.wallets) {
      const wallets = row.wallets.split(',').map(w => w.trim()).filter(w => w);
      for (const wallet of wallets) {
        if (!seenEntities.has(wallet)) {
          seenEntities.add(wallet);
          nodes.push({
            id: wallet.toLowerCase().replace(/\s+/g, '_'),
            label: wallet,
            type: 'CryptoWallet',
            tags: ['timeline'],
            createdAt: row.timestamp,
          });
        }
      }
    }
  }

  return nodes;
};

export const matrixToNodes = (matrixRows: MatrixRow[]): NodeRecord[] => {
  return matrixRows.map(row => ({
    id: row.entity.toLowerCase().replace(/\s+/g, '_'),
    label: row.entity,
    type: row.category === 'Person' ? 'Person' : 'Company',
    role: row.inferred_role,
    tags: ['matrix'],
    riskScore: row.mentions > 10 ? 80 : row.mentions > 5 ? 60 : 40,
    selectors: {
      emails: row.emails ? row.emails.split(',').map(e => e.trim()) : undefined,
      phones: row.phones ? row.phones.split(',').map(p => p.trim()) : undefined,
      wallets: row.wallets ? row.wallets.split(',').map(w => w.trim()) : undefined,
    },
    createdAt: row.first_seen,
    updatedAt: row.last_seen,
  }));
};

export const timelineToEdges = (timelineRows: TimelineRow[]): EdgeRecord[] => {
  const edges: EdgeRecord[] = [];
  let edgeId = 1;

  for (const row of timelineRows) {
    const entities: string[] = [];
    
    if (row.persons) {
      entities.push(...row.persons.split(',').map(p => p.trim()).filter(p => p));
    }
    if (row.orgs) {
      entities.push(...row.orgs.split(',').map(o => o.trim()).filter(o => o));
    }
    if (row.wallets) {
      entities.push(...row.wallets.split(',').map(w => w.trim()).filter(w => w));
    }

    // Create edges between all entities mentioned in the same timeline entry
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const source = entities[i].toLowerCase().replace(/\s+/g, '_');
        const target = entities[j].toLowerCase().replace(/\s+/g, '_');
        
        edges.push({
          id: `timeline_${edgeId++}`,
          source,
          target,
          description: `Mentioned together in timeline: ${row.context.substring(0, 50)}...`,
          certainty: 'Suspected',
          nature: 'Neutral',
          date: row.timestamp,
          references: [`Timeline entry: ${row.timestamp}`],
        });
      }
    }
  }

  return edges;
};

export const formatDateForDisplay = (isoString: string): string => {
  try {
    const utcDate = parseISO(isoString);
    const londonDate = utcToZonedTime(utcDate, 'Europe/London');
    return format(londonDate, 'dd/MM/yyyy HH:mm');
  } catch {
    return isoString;
  }
};

export const formatDateForStorage = (date: Date): string => {
  return zonedTimeToUtc(date, 'Europe/London').toISOString();
}; 