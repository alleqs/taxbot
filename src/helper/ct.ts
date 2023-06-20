import type { CTe, CTeReg, FullCTe } from '../types'
import { cfopMap } from '../constants/cfopMap';
import { state } from '../store';
import { formatCNPJ, formatCPF, formatIE, parser } from './common';
import { getWb } from '../excel/ct';
import { modalMap } from '../constants/modalMap';


function isFullCTe(obj: CTe | FullCTe): obj is FullCTe {
   return !!(obj as FullCTe).cteProc;
}

export async function xmlToCtRegs(file: File): Promise<CTeReg> {
   const xml = await file.text();
   const _cte: CTe | FullCTe = parser.parse(xml);
   const fullCT = isFullCTe(_cte);
   const cte = fullCT ? _cte.cteProc.CTe.infCte : _cte.CTe.infCte;

   const { ide: { dhEmi, mod, nCT: _nCT, natOp, cDV, cCT: _cNF, cUF, serie: _serie, tpAmb, tpEmis, tpCTe, modal },
      emit: { CNPJ: _CNPJEmit, IE: IEEmit, xNome: rsEmit, CPF: CPFEmit, enderEmit: { UF: ufEmit } },
      dest: { CNPJ: CNPJDest, IE: IEDest, xNome: rsDest, CPF: CPFDest, enderDest: { UF: ufDest } },
      vPrest: { vTPrest }, infCTeNorm: { infDoc: { infNFe: { chave: chaveNFe } } }
   } = cte;
   const [anoEmissao, mesEmissao,] = dhEmi.split('-');
   const AAMM = `${anoEmissao.slice(-2)}${mesEmissao}`;
   const CNPJEmit = formatCNPJ(_CNPJEmit);
   const nCT = String(_nCT).padStart(9, '0')
   const serie = String(_serie).padStart(3, '0');
   const cCT = String(_cNF).padStart(8, '0');
   const chaveCT = `${cUF}${AAMM}${String(_CNPJEmit).padStart(14, '0')}${mod}${serie}${nCT}${tpEmis}${cCT}${cDV}`;

   const cteReg: CTeReg = {
      dtEmissao: new Date(dhEmi),
      nCT,
      chaveCT,
      modelo: mod,
      natOp,
      modal: modalMap[+modal],

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
      chaveNFe: String(chaveCT),
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