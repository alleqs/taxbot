import Excel from 'exceljs';
import type { CTeReg } from '../types';

const wb = new Excel.Workbook();
const ws = wb.addWorksheet('itens');


ws.columns = [
   { header: 'Data Emissão', key: 'dtEmissao', width: 12, style: { numFmt: 'yyyy/mm/dd' } },
   { header: 'Núm. CTe', key: 'nCT', width: 10 },
   { header: 'Chave CTe', key: 'chaveCT', width: 45 },
   { header: 'Mod.', key: 'modelo', width: 4 },
   { header: 'Natureza Operacao', key: 'natOp', width: 25 },
   { header: 'Modal', key: 'modal', width: 6 },

   // { header: 'Tipo NF', key: 'tpNF', width: 10 },
   // { header: 'Ambiente', key: 'tpAmb', width: 10 },
   // { header: 'Tipo Emissão', key: 'tpEmis', width: 10 },

   { header: 'CNPJ Emitente', key: 'CNPJEmit', width: 16 },
   { header: 'IE Emitente', key: 'IEEmit', width: 13 },
   { header: 'Razão Social Emitente', key: 'rsEmit', width: 30 },
   { header: 'CPF Emitente', key: 'CPFEmit' },
   { header: 'UF Emitente', key: 'ufEmit', width: 4 },
   // { header: 'CNAE Emitente', key: 'cnaeEmit' },
   // { header: 'Descr. CNAE Emitente', key: 'descCnaeEmit' },

   { header: 'CNPJ Destinatário', key: 'CNPJDest', width: 16 },
   { header: 'IE Destinatário', key: 'IEDest', width: 13 },
   { header: 'Razão Social Destinatário', key: 'rsDest', width: 25 },
   { header: 'CPF Destinatário', key: 'CPFDest', width: 8 },
   { header: 'UF Destinatário', key: 'ufDest', width: 4, },
   // { header: 'CNAE Destinatário', key: 'cnaeDest', width: 8 },
   // { header: 'Descr. CNAE Destinatário', key: 'descCnaeDest' },

   { header: 'Valor Prestação', key: 'vPrest', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Chave NFe', key: 'chaveNFe', width: 45 },
];


export function getWb(regs: CTeReg[]) {

   ws.addRows(regs);
   // ws.duplicateRow(1, 1, false);
   // ws.insertRow(1, { a: 1 });
   // const row1 = ws.getRow(1);
   // const row2 = ws.getRow(2);
   // row1.font = { bold: true };
   // row1.alignment = { horizontal: 'center' };
   // row2.font = { bold: true };
   // ws.getCell('A1').value = 'Nota Fiscal';
   // ws.mergeCells('A1:H1');
   // ws.getCell('I1').value = 'Emitente';
   // ws.mergeCells('I1:O1');
   // ws.getCell('P1').value = 'Destinatário';
   // ws.mergeCells('P1:V1');
   // ws.getCell('W1').value = 'Itens';
   // ws.mergeCells('W1:AG1');
   // ws.getCell('AH1').value = 'ICMS Itens';
   // ws.mergeCells('AH1:AS1');
   // ws.getCell('AT1').value = 'Totais';
   // ws.mergeCells('AT1:BC1');

   return wb;
}