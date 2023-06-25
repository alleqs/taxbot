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
   { header: 'Tomador', key: 'tomador', width: 8 },

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
   { header: 'CST', key: 'CST', width: 10 },
   { header: 'Base de Cálc.', key: 'vBC', width: 16, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Alíquota', key: 'pICMS', width: 8, style: { numFmt: '#,##0;-#,##0;-' } },
   { header: 'ICMS', key: 'vICMS', width: 16, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
];


export function getWb(regs: CTeReg[]) {
   ws.addRows(regs);
   ws.getRow(1).font = { bold: true };

   return wb;
}