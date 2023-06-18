import Excel from 'exceljs';
import type { Analitico, InfoContrib } from '../types';
import { formatDate, formatIE } from '../helper/common';

const wb = new Excel.Workbook();
const wsEntrada = wb.addWorksheet('entradas');
const wsSaida = wb.addWorksheet('saidas');

const entrRow = wsEntrada.getRow(1);
entrRow.font = { bold: true };
entrRow.alignment = { horizontal: 'center' };
const exRow = wsSaida.getRow(1);
exRow.font = { bold: true };
exRow.alignment = { horizontal: 'center' };

const cols = [
   { header: 'Per. Apuração', key: 'anoMes', width: 13, style: { numFmt: 'yyyy-mm' } },
   { header: 'CST', key: 'cst', width: 8 },
   { header: 'CFOP', key: 'cfop', width: 8 },
   { header: 'Alíquota', key: 'aliq', width: 8, style: { numFmt: '#,##0;-#,##0;-' } },
   { header: 'Valor da op.', key: 'valOper', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Base de Calculo ICMS ', key: 'bc', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Total ICMS', key: 'icms', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'BC ICMS ST', key: 'bcST', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor ICMS ST', key: 'sT', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Redução BC ICMS', key: 'redBc', width: 20, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
];


export function getWb(entradas: Analitico[], saidas: Analitico[], { nome, IE, iniEscrit, fimEscrit }: InfoContrib) {
   const titulo = `${nome}     IE: ${formatIE(IE)}     Per. apuração: ${formatDate(iniEscrit)} a ${formatDate(fimEscrit)}`;
   wsEntrada.columns = cols;
   wsSaida.columns = cols;
   wsEntrada.addRows(entradas);
   //insere nome da empresa na primeira linha
   wsEntrada.duplicateRow(1, 1, false);
   wsEntrada.getCell('A1').value = titulo;
   wsEntrada.mergeCells('A1:J1');
   wsSaida.addRows(saidas);
   wsSaida.duplicateRow(1, 1, false);
   wsSaida.getCell('A1').value = titulo;
   wsSaida.mergeCells('A1:J1');
   return wb;
}

