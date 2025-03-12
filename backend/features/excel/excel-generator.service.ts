import mappings from '../../resources/template-column-mappings.json' with { type: 'json' };
import { VisitTypes } from '../../utils/mappings.types.ts';
// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs';
import * as fs from 'node:fs';
XLSX.set_fs(fs);

// 1 indexed
const TEMPLATE_START_ROW = 4;

export function copyFromTemplate() {
  const dirname = Deno.cwd();
  return XLSX.readFile(`${dirname}/backend/resources/template.xlsx`);
}

export function writeToFile(wb: XLSX.WorkBook) {
  const dirname = Deno.cwd();
  XLSX.writeFile(wb, `${dirname}/backend/resources/output.xlsx`);
}

/**
 * Update the workbook in place with the given data
 */
export function updateWorkbook(
  wb: XLSX.WorkBook,
  visitType: VisitTypes,
  patientId: string,
  // deno-lint-ignore no-explicit-any
  data: any
) {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const dataMappings = mappings.visit[visitType];
  // 1 indexed
  const rowNumber = findPatientRowNumber(sheet, patientId);
  sheet[`A${rowNumber}`] = { t: 's', v: patientId };
  for (const [key, value] of Object.entries(dataMappings)) {
    if (data[key] === undefined) continue;

    const { column, type } = value;
    const cell = `${column}${rowNumber}`;
    const cellType = toSheetJsType(type);
    sheet[cell] = { t: cellType, v: data[key] };
  }
}

/**
 * Converts the type of the value to the SheetJS type
 * @param type - The type of the value
 * @returns SheetJS type for the value
 */
function toSheetJsType(type: string) {
  switch (type) {
    case 'boolean': // Boolean values are converted to 0/1
    case 'number':
      return 'n';
    case 'string':
      return 's';
    default:
      return 's';
  }
}

/**
 * Finds the row number of the patient in the sheet
 * If the patient is not found, returns the next available row number
 * @param sheet - The sheet to search in
 * @param patientId - The patient ID to search for
 * @returns The row number of the patient
 */
function findPatientRowNumber(sheet: XLSX.WorkSheet, patientId: string) {
  let i = TEMPLATE_START_ROW;
  while (sheet[`A${i}`] && sheet[`A${i}`].v !== patientId) {
    i++;
  }
  return i;
}
