import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun } from 'docx';
import { GraphData } from './schemas';

export const generateDocxReport = async (
  graphData: GraphData, 
  caseName: string = 'Izzy Fox Investigation',
  graphImageBase64?: string
): Promise<Blob> => {
  const { nodes, edges } = graphData;
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title page
        new Paragraph({
          text: caseName,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        
        new Paragraph({
          text: 'Investigation Report',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          text: `Generated on ${new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        
        // Summary section
        new Paragraph({
          text: 'Executive Summary',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: `This investigation involves ${nodes.length} entities and ${edges.length} relationships. `,
              bold: true,
            }),
            new TextRun({
              text: 'The network diagram below shows the connections between persons, companies, and crypto wallets identified in this case.',
            }),
          ],
          spacing: { after: 200 },
        }),
        
        // Statistics table
        new Paragraph({
          text: 'Investigation Statistics',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Metric', bold: true })],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Count', bold: true })],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Total Entities' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: nodes.length.toString() })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Persons' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: nodes.filter(n => n.type === 'Person').length.toString() })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Companies' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: nodes.filter(n => n.type === 'Company').length.toString() })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Crypto Wallets' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: nodes.filter(n => n.type === 'CryptoWallet').length.toString() })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Total Relationships' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: edges.length.toString() })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Confirmed Relationships' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: edges.filter(e => e.certainty === 'Confirmed').length.toString() })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: 'Illicit Relationships' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: edges.filter(e => e.nature === 'Illicit').length.toString() })],
                }),
              ],
            }),
          ],
        }),
        
        // Key entities section
        new Paragraph({
          text: 'Key Entities',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }),
        
        ...nodes
          .filter(node => node.role || node.riskScore && node.riskScore > 70)
          .map(node => new Paragraph({
            children: [
              new TextRun({
                text: `${node.label} (${node.type})`,
                bold: true,
              }),
              new TextRun({
                text: node.role ? ` - ${node.role}` : '',
                italics: true,
              }),
              new TextRun({
                text: node.detail ? ` - ${node.detail}` : '',
              }),
            ],
            spacing: { after: 100 },
          })),
        
        // Network diagram section
        new Paragraph({
          text: 'Network Diagram',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }),
        
        new Paragraph({
          text: 'The following diagram shows the relationships between entities in this investigation. Node colors indicate entity types, and edge styles indicate relationship certainty and nature.',
          spacing: { after: 200 },
        }),
        
        // Insert graph image if provided
        ...(graphImageBase64 ? [
          new Paragraph({
            children: [
              new ImageRun({
                data: Buffer.from(graphImageBase64.split(',')[1], 'base64'),
                transformation: {
                  width: 600,
                  height: 400,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
        ] : []),
        
        // Mermaid code section
        new Paragraph({
          text: 'Mermaid Diagram Code',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 300, after: 200 },
        }),
        
        new Paragraph({
          text: 'The following Mermaid code can be used to recreate this diagram:',
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          text: '```mermaid\nflowchart LR\n  izzy["Izzy Fox\\nType: Person\\nRole: Victim"]\n  jens["Jens Albers\\nType: Person\\nRole: Primary Suspect"]\n  albers["Albers Capital\\nType: Company\\nUK Reg #12345\\nSuspected shell company"]\n  walletA["Crypto Wallet A\\nType: Crypto Wallet\\nDetail: Received funds from Albers Capital"]\n  newNode["(Add New Node Here)\\nType: Person/Company/Wallet/etc.\\nDetail: Role or identifier"]\n\n  izzy -- "Invested £250,000\\nConfirmed | Illicit" --> albers\n  jens -- "Director\\nConfirmed | Neutral" --> albers\n  albers -- "Transferred funds\\nConfirmed | Illicit" --> walletA\n  jens -. "Controls wallet\\nSuspected | Illicit" .-> walletA\n  newNode -. "Describe link\\nSuspected | Neutral" .-> walletA\n\n  classDef person fill:#e9f0ff,stroke:#6b87c4,stroke-width:1px;\n  classDef company fill:#e9ffe9,stroke:#69a56a,stroke-width:1px;\n  classDef wallet fill:#ffe9e9,stroke:#b66,stroke-width:1px;\n  classDef unknown fill:#f6f6f6,stroke:#bdbdbd,stroke-dasharray:3 3;\n\n  class izzy,jens person;\n  class albers company;\n  class walletA wallet;\n  class newNode unknown;\n\n  linkStyle 0 stroke:#d33,stroke-width:2px,color:#d33\n  linkStyle 1 stroke:#9a9a9a,color:#666\n  linkStyle 2 stroke:#d33,stroke-width:2px,color:#d33\n  linkStyle 3 stroke:#d33,stroke-dasharray:5 5,color:#d33\n  linkStyle 4 stroke:#9a9a9a,stroke-dasharray:5 5,color:#666\n```',
          spacing: { after: 200 },
        }),
        
        // Footer
        new Paragraph({
          text: 'End of Report',
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      ],
    }],
  });
  
  return await Packer.toBlob(doc);
}; 