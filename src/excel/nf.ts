import Excel from 'exceljs';
import type { RegFull } from '../types';

const wb = new Excel.Workbook();
const ws = wb.addWorksheet('itens');
ws.getRow(1).font = { bold: true };
ws.columns = [
   { header: 'Ano Emissão', key: 'anoEmissao', width: 6 },
   { header: 'Mes Emissao', key: 'mesEmissao', width: 3 },
   { header: 'Data Emissao', key: 'dtEmissao', width: 10, outlineLevel: 1 },
   { header: 'Cnpj Emitente', key: 'CNPJEmit', width: 15 },
   { header: 'Inscricao Emitente', key: 'IEEmit' },
   { header: 'Razao Social Emitente', key: 'rsEmit', width: 30 },
   { header: 'Cpf Emitente', key: 'CPFEmit' },
   { header: 'Uf Emitente', key: 'ufEmit', width: 4 },
   { header: 'Cod Cnae Emitente', key: 'cnaeEmit' },
   { header: 'Desc. Cnae Emitente', key: 'descCnaeEmit' },
   { header: 'Modelo', key: 'modelo', width: 4 },
   { header: 'Numero NFe', key: 'numNF', width: 10 },
   { header: 'Chave NFe', key: 'chaveNF', width: 10 },

   { header: 'Valor Total Bruto Nfei', key: 'vProd', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor Total Desconto Nfei', key: 'vDesc', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor Total Frete Nfei', key: 'vFrete', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor Total Seguro Nfe', key: 'vSeg', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor de Outras Desp Acess', key: 'vOutro', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },

   { header: 'Cod NCM', key: 'NCM', width: 10 },
   { header: 'Desc. NCM', key: 'descNCM', width: 25 },
   { header: 'Cod CFOP', key: 'CFOP', width: 8 },
   { header: 'Desc. CFOP', key: 'descCFOP', width: 25 },

   { header: 'Numero Sequencial do Item', key: 'numSeqItem', width: 6 },
   { header: 'Cod Produto Nfe', key: 'codProd', width: 10 },
   { header: 'Descricao Produto Nfe', key: 'descProd', width: 30 },
   { header: 'Quantidade Comercial Nfei', key: 'qCom', width: 10, style: { numFmt: '#,##0' } },
   { header: 'Cs Un Comercial Nfei', key: 'uCom', width: 10 },
   { header: 'Valor Unitario Comercial Nfei', key: 'vUnCom', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },

   { header: 'Valor Base de Calculo do Icms', key: 'vBC', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor do Icms', key: 'vICMS', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor da Base de Calculo do Icms ST', key: 'vBCST', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor do Icms ST', key: 'vST', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor do Icms Desonerado', key: 'vICMSDeson', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },
   { header: 'Valor IPI', key: 'vIPI', width: 10, style: { numFmt: '#,##0.00;-#,##0.00;-' } },

   { header: 'Cnpj Destinatario', key: 'CNPJDest', width: 15 },
   { header: 'Inscricao Destinatario', key: 'IEDest', width: 10 },
   { header: 'Razao Social Destinatario', key: 'rsDest', width: 25 },
   { header: 'Cpf Destinatario IPI', key: 'CPFDest', width: 8 },

   { header: 'Cod Cnae Destinatario', key: 'cnaeDest', width: 8 },
   { header: 'Desc. Cnae Destinatario', key: 'descCnaeDest' },
   { header: 'Natureza Operacao', key: 'natOp', width: 25 },
   { header: 'Tipo NF', key: 'tpNF', width: 10 },
   { header: 'Tipo Ambiente', key: 'tpAmb', width: 10 },
   { header: 'Tipo Emissão', key: 'tpEmis', width: 10 },

];

export function getWb(regs: RegFull[]) {
   ws.addRows(regs);
   return wb;
}