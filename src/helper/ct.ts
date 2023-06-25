import type { CTe, CTeReg, FullCTe, ICMSCT } from '../types'
// import { cfopMap } from '../constants/cfopMap';
// import { state } from '../store';
import { formatCNPJ, formatCPF, formatIE } from './common';
import { getWb } from '../excel/ct';
import { modalMap } from '../constants/modalMap';
import { XMLParser } from 'fast-xml-parser';
import { tomadorMap } from '../constants/tomaDorMap';

const options = {
   parseTagValue: false,
   tagValueProcessor: (tagName: string, tagValue: unknown) => {
      if (tagName === 'chave') return String(tagValue);
      return undefined;
   }
};
const parser = new XMLParser(options);

function isFullCTe(obj: CTe | FullCTe): obj is FullCTe {
   return !!(obj as FullCTe).cteProc;
}

export async function xmlToCtRegs(file: File): Promise<CTeReg> {
   const xml = await file.text();
   const _cte: CTe | FullCTe = parser.parse(xml);
   const fullCT = isFullCTe(_cte);
   const cte = fullCT ? _cte.cteProc.CTe.infCte : _cte.CTe.infCte;

   const { ide: { dhEmi, mod, nCT: _nCT, natOp, cDV, cCT: _cNF, cUF, serie: _serie, tpAmb, tpEmis, tpCTe, modal, toma3: { toma } },
      emit: { CNPJ: _CNPJEmit, IE: IEEmit, xNome: rsEmit, CPF: CPFEmit, enderEmit: { UF: ufEmit } },
      dest: { CNPJ: CNPJDest, IE: IEDest, xNome: rsDest, CPF: CPFDest, enderDest: { UF: ufDest } },
      vPrest: { vTPrest }, infCTeNorm: { infDoc: { infNFe } }, imp: { ICMS }
   } = cte;
   const nfes = Array.isArray(infNFe) ? infNFe.map(({ chave }) => chave) : [infNFe.chave];
   const chaveNFe = nfes.join(" ");
   const [anoEmissao, mesEmissao,] = dhEmi.split('-');
   const AAMM = `${anoEmissao.slice(-2)}${mesEmissao}`;
   const CNPJEmit = formatCNPJ(_CNPJEmit);
   const nCT = String(_nCT).padStart(9, '0')
   const serie = String(_serie).padStart(3, '0');
   const cCT = String(_cNF).padStart(8, '0');
   const chaveCT = `${cUF}${AAMM}${String(_CNPJEmit).padStart(14, '0')}${mod}${serie}${nCT}${tpEmis}${cCT}${cDV}`;

   const cteReg: CTeReg = {
      dtEmissao: new Date(dhEmi),
      nCT: _nCT,
      chaveCT,
      modelo: mod,
      natOp,
      modal: modalMap[+modal],
      tomador: tomadorMap[toma],

      CNPJEmit,
      IEEmit: String(IEEmit),
      rsEmit,
      CPFEmit,
      ufEmit,

      CNPJDest: formatCNPJ(CNPJDest),
      IEDest,
      rsDest,
      CPFDest,
      ufDest,

      vPrest: +vTPrest,
      chaveNFe,
      ...toICMSReg(ICMS)
   };
   return cteReg;
}

export async function createCtSheet(regs: CTeReg[], link: HTMLAnchorElement) {
   const wb = getWb(regs);
   const buffer = await wb.xlsx.writeBuffer();
   const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   link.href = URL.createObjectURL(file);
   link.download = 'CTe.xlsx';
}

function toICMSReg(icms: ICMSCT): { CST: number } & Record<'vBC' | 'pICMS' | 'vICMS', number> {

   if ('ICMS00' in icms) {
      const { CST, pICMS, vBC, vICMS } = icms.ICMS00;
      // const a = { CST, vBC: +vBC, pICMS: +pICMS, vICMS: +vICMS }
      return { CST, vBC: +vBC, pICMS: +pICMS, vICMS: +vICMS };
   } else if ('ICMS20' in icms) {
      const { CST, pICMS, vBC, vICMS } = icms.ICMS20;
      return { CST, vBC: +vBC, pICMS: +pICMS, vICMS: +vICMS };
   } else if ('ICMS45' in icms) {
      const { CST } = icms.ICMS45;
      return { CST, vBC: 0, pICMS: 0, vICMS: 0 };
   } else if ('ICMS60' in icms) {
      const { CST } = icms.ICMS60;
      return { CST, vBC: 0, pICMS: 0, vICMS: 0 };
   } else if ('ICMS90' in icms) {
      const { CST, pICMS, vBC, vICMS } = icms.ICMS90;
      return { CST, vBC: +vBC, pICMS: +pICMS, vICMS: +vICMS };
   } else if ('ICMSOutraUF' in icms) {
      const { CST, pICMSOutraUF, vBCOutraUF, vICMSOutraUF } = icms.ICMSOutraUF;
      return { CST, vBC: +vBCOutraUF, pICMS: +pICMSOutraUF, vICMS: +vICMSOutraUF };
   } else {
      const { CST } = icms.ICMSSN;
      return { CST, vBC: 0, pICMS: 0, vICMS: 0 };
   }
}