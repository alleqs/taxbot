import Excel from 'exceljs';
import type { RegFull } from '../types';

const wb = new Excel.Workbook();
const ws = wb.addWorksheet('itens');
ws.getRow(1).font = { bold: true };
ws.columns = [
   // { header: 'Ano Emissão', key: 'anoEmissao', width: 6 },
   // { header: 'Mes Emissao', key: 'mesEmissao', width: 3 },
   { header: 'Data Emissão', key: 'dtEmissao', width: 12, style: { numFmt: 'yyyy/mm/dd' } },
   { header: 'Cnpj Emitente', key: 'CNPJEmit', width: 15 },
   { header: 'IE Emitente', key: 'IEEmit' },
   { header: 'Razão Social Emitente', key: 'rsEmit', width: 30 },
   { header: 'CPF Emitente', key: 'CPFEmit' },
   { header: 'UF Emitente', key: 'ufEmit', width: 4 },
   { header: 'CNAE Emitente', key: 'cnaeEmit' },
   { header: 'Descr. CNAE Emitente', key: 'descCnaeEmit' },
   { header: 'Mod.', key: 'modelo', width: 4 },
   { header: 'Número NFe', key: 'numNF', width: 10 },
   { header: 'Chave NFe', key: 'chaveNF', width: 10 },

   { header: 'Total Produtos', key: 'vProdTot', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Total Desconto', key: 'vDesc', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Total Frete', key: 'vFrete', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Total Seguro', key: 'vSeg', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Total Outras Desp. Acess.', key: 'vOutro', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'BC ICMS', key: 'vBC', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'ICMS', key: 'vICMS', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'BC ICMS ST', key: 'vBCST', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'ICMS ST', key: 'vST', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'ICMS Desonerado', key: 'vICMSDeson', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'IPI', key: 'vIPI', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },

   { header: 'NCM', key: 'NCM', width: 10 },
   { header: 'Descr. NCM', key: 'descNCM', width: 25 },
   { header: 'CFOP', key: 'CFOP', width: 8 },
   { header: 'Descr. CFOP', key: 'descCFOP', width: 25 },

   { header: '# Sequencial do Item', key: 'numSeqItem', width: 6 },
   { header: 'Cód. Prod.', key: 'codProd', width: 10 },
   { header: 'Descr. Prod.', key: 'descProd', width: 30 },
   { header: 'Qde. Comercial', key: 'qCom', width: 10, style: { numFmt: '#,##0' } },
   { header: 'Unidade', key: 'uCom', width: 10 },
   { header: 'Valor Unitário Comercial', key: 'vUnCom', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Total Produto', key: 'vProd', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },

   { header: 'CNPJ Destinatário', key: 'CNPJDest', width: 15 },
   { header: 'IE Destinatário', key: 'IEDest', width: 10 },
   { header: 'Razão Social Destinatário', key: 'rsDest', width: 25 },
   { header: 'CPF Destinatário', key: 'CPFDest', width: 8 },

   { header: 'CNAE Destinatário', key: 'cnaeDest', width: 8 },
   { header: 'Descr. CNAE Destinatário', key: 'descCnaeDest' },
   { header: 'Natureza Operacao', key: 'natOp', width: 25 },
   { header: 'Tipo NF', key: 'tpNF', width: 10 },
   { header: 'Tipo Ambiente', key: 'tpAmb', width: 10 },
   { header: 'Tipo Emissão', key: 'tpEmis', width: 10 },

];

export function getWb(regs: RegFull[]) {

   ws.addRows(regs);
   // ws.duplicateRow(1, 1, false);
   // ws.getCell('A1').value = 'opa';
   // ws.mergeCells('A1:AQ1');
   return wb;
}