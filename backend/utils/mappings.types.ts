import mappings from '../resources/template-column-mappings.json' with { type: 'json' };

export type VisitTypes = keyof typeof mappings.visit;
// Note: Booleans are 1/0
export type CellTypes = 'number' | 'string' | 'boolean' | 'date';
