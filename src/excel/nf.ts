import Excel from 'exceljs';
import type { NfFullReg } from '../types';


export function getWb(regs: NfFullReg[]) {
   const wb = new Excel.Workbook();
   const ws = wb.addWorksheet('itens');
   setColumns(ws);
   ws.addRows(regs);
   // ws.duplicateRow(1, 1, false);
   ws.insertRow(1, { a: 1 });
   const row1 = ws.getRow(1);
   const row2 = ws.getRow(2);
   row1.font = { bold: true };
   row1.alignment = { horizontal: 'center' };
   row2.font = { bold: true };
   ws.getCell('A1').value = 'Nota Fiscal';
   ws.mergeCells('A1:H1');
   ws.getCell('I1').value = 'Emitente';
   ws.mergeCells('I1:O1');
   ws.getCell('P1').value = 'Destinatário';
   ws.mergeCells('P1:V1');
   ws.getCell('W1').value = 'Itens';
   ws.mergeCells('W1:AG1');
   ws.getCell('AH1').value = 'ICMS Itens';
   ws.mergeCells('AH1:AS1');
   ws.getCell('AT1').value = 'Totais';
   ws.mergeCells('AT1:BC1');
   // row1.border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
   // row2.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

   return wb;
}

function setColumns(ws: Excel.Worksheet) {

   ws.columns = [
      // { header: 'Ano Emissão', key: 'anoEmissao', width: 6 },
      // { header: 'Mes Emissao', key: 'mesEmissao', width: 3 },
      { header: 'Data Emissão', key: 'dtEmissao', width: 12, style: { numFmt: 'yyyy/mm/dd' } },
      { header: 'Núm. NF', key: 'numNF', width: 10 },
      { header: 'Chave NF', key: 'chaveNF', width: 45 },
      { header: 'Mod.', key: 'modelo', width: 4 },
      { header: 'Natureza Operacao', key: 'natOp', width: 25 },
      { header: 'Tipo NF', key: 'tpNF', width: 10 },
      { header: 'Ambiente', key: 'tpAmb', width: 10 },
      { header: 'Tipo Emissão', key: 'tpEmis', width: 10 },

      { header: 'CNPJ Emitente', key: 'CNPJEmit', width: 16 },
      { header: 'IE Emitente', key: 'IEEmit', width: 13 },
      { header: 'Razão Social Emitente', key: 'rsEmit', width: 30 },
      { header: 'CPF Emitente', key: 'CPFEmit' },
      { header: 'UF Emitente', key: 'ufEmit', width: 4 },
      { header: 'CNAE Emitente', key: 'cnaeEmit' },
      { header: 'Descr. CNAE Emitente', key: 'descCnaeEmit' },

      { header: 'CNPJ Destinatário', key: 'CNPJDest', width: 16 },
      { header: 'IE Destinatário', key: 'IEDest', width: 13 },
      { header: 'Razão Social Destinatário', key: 'rsDest', width: 25 },
      { header: 'CPF Destinatário', key: 'CPFDest', width: 8 },
      { header: 'UF Destinatário', key: 'ufDest', width: 4 },
      { header: 'CNAE Destinatário', key: 'cnaeDest', width: 8 },
      { header: 'Descr. CNAE Destinatário', key: 'descCnaeDest' },

      { header: '# Sequencial do Item', key: 'numSeqItem', width: 6 },
      { header: 'NCM', key: 'NCM', width: 10 },
      { header: 'Descr. NCM', key: 'descNCM', width: 25 },
      { header: 'CFOP', key: 'CFOP', width: 8 },
      { header: 'Descr. CFOP', key: 'descCFOP', width: 25 },
      { header: 'Cód. Prod.', key: 'codProd', width: 10 },
      { header: 'Descr. Prod.', key: 'descProd', width: 30 },
      { header: 'Qde. Comercial', key: 'qCom', width: 10, style: { numFmt: '#,##0' } },
      { header: 'Unidade', key: 'uCom', width: 10 },
      { header: 'Valor Unitário Comercial', key: 'vUnCom', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'Total Produto', key: 'vProd', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },

      { header: 'Origem', key: 'orig', width: 8 },
      { header: 'CST', key: 'CST', width: 8 },
      { header: 'BC item', key: 'vBCItem', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'Alíquota', key: 'pICMS', width: 8 },
      { header: 'ICMS item', key: 'vICMSItem', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'BC ICMS ST Item', key: 'vBCSTItem', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'Alíq. ICMS ST', key: 'pICMSST', width: 8 },
      { header: 'ICMS ST', key: 'vICMSST', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'BC ST Retido', key: 'vBCSTRet', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'ICMS ST Retido', key: 'vICMSSTRet', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'BC ST Destino', key: 'vBCSTDest', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
      { header: 'ICMS ST Destino', key: 'vICMSSTDest', width: 8, style: { numFmt: '#,##0.00;-#,##0.00;-' } },

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
   ];

}