import Excel from 'exceljs';
import type { Analitico } from '../types';

const wb = new Excel.Workbook();
const wsEntrada = wb.addWorksheet('entradas');
const wsSaida = wb.addWorksheet('saidas');

wsEntrada.getRow(1).font = { bold: true };
wsEntrada.getRow(1).alignment = { horizontal: 'center' };
wsSaida.getRow(1).font = { bold: true };
wsSaida.getRow(1).alignment = { horizontal: 'center' };

const cols = [
   { header: 'CST', key: 'cst', width: 8 },
   { header: 'CFOP', key: 'cfop', width: 8 },
   { header: 'Alíquota', key: 'aliq', width: 8, style: { numFmt: '#,##0;-#,##0;-' } },
   { header: 'Valor da op.', key: 'valOper', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Base de Calculo ICMS ', key: 'bc', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Total ICMS', key: 'icms', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Base de Calculo ICMS ST', key: 'bcST', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor ICMS ST', key: 'sT', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Redução BC ICMS', key: 'redBc', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
];


wsEntrada.columns = cols;
wsSaida.columns = cols;

export function getWb(entradas: Analitico[], saidas: Analitico[]) {
   wsEntrada.addRows(entradas);
   wsSaida.addRows(saidas);
   return wb;
}