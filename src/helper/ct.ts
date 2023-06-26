import type { CTe, CTeReg, FullCTe, ICMS, ICMSCT } from '../types'
// import { cfopMap } from '../constants/cfopMap';
// import { state } from '../store';
import { formatCNPJ, formatCPF, formatIE, getFileContent } from './common';
import { getWb } from '../excel/ct';
import { modalMap, tomadorMap, tpCTeMap } from '../constants/cte';
import { XMLParser } from 'fast-xml-parser';

const options = {
   ignoreAttributes: false,
   parseTagValue: false,
   tagValueProcessor: (tagName: string, tagValue: unknown) => {
      if (tagName === 'chave') return String(tagValue);
      return undefined;
   }
};
const parser = new XMLParser(options);

function isFullCTe(obj: CTe | FullCTe): obj is FullCTe {
   // return !!(obj as FullCTe).cteProc;
   return ('cteProc' in obj) || ('procCTe' in obj);
}

export async function xmlToCtRegs(file: File, accObjLength: number): Promise<[CTeReg[], number]> {

   const regs: CTeReg[] = [];
   const [xmls, newAccObjLength] = await getFileContent(file, accObjLength);

   for (const xml of xmls) {
      const _cte: CTe | FullCTe = parser.parse(xml);
      const fullCT = isFullCTe(_cte);
      const cte = fullCT ? Object.values(_cte)[0].CTe.infCte : _cte.CTe.infCte;

      // try {
      //    const { ide: { dhEmi, mod, nCT: _nCT, natOp, cDV, cCT: _cNF, cUF, serie: _serie, tpAmb, tpEmis, tpCTe, modal },
      //       emit: { CNPJ: _CNPJEmit, IE: IEEmit, xNome: rsEmit, CPF: CPFEmit, enderEmit: { UF: ufEmit } },
      //       dest: { CNPJ: CNPJDest, IE: IEDest, xNome: rsDest, CPF: CPFDest, enderDest: { UF: ufDest } },
      //       vPrest: { vTPrest }, imp: { ICMS }
      //    } = cte;
      // } catch (err) {
      //    console.log('err', err)
      // }

      const { ide: { dhEmi, mod, nCT: _nCT, natOp, cDV, cCT: _cNF, cUF, serie: _serie, tpAmb, tpEmis, tpCTe, modal },
         emit: { CNPJ: _CNPJEmit, IE: IEEmit, xNome: rsEmit, CPF: CPFEmit, enderEmit: { UF: ufEmit } },
         dest: { CNPJ: CNPJDest, IE: IEDest, xNome: rsDest, CPF: CPFDest, enderDest: { UF: ufDest } },
         vPrest: { vTPrest }, imp: { ICMS }
      } = cte;
      //infCTeNorm: { infDoc: { infNFe } }
      const { toma: codTomador } = 'toma3' in cte.ide ? cte.ide.toma3 : cte.ide.toma4;
      const nfes =
         'infCTeNorm' in cte && 'infNFe' in cte.infCTeNorm.infDoc ?
            Array.isArray(cte.infCTeNorm.infDoc.infNFe)
               ? cte.infCTeNorm.infDoc.infNFe.map(({ chave }) => chave)
               : [cte.infCTeNorm.infDoc.infNFe.chave]
            : [];
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
         modal: modalMap[+modal] ?? '',
         tomador: tomadorMap[codTomador] ?? '',
         tpCTe: tpCTeMap[+tpCTe] ?? '',

         CNPJEmit,
         IEEmit: String(IEEmit),
         rsEmit,
         CPFEmit,
         ufEmit,
         transpOptanteSN: optanteSN(ICMS) ? 'sim' : '-',

         CNPJDest: formatCNPJ(CNPJDest),
         IEDest,
         rsDest,
         CPFDest,
         ufDest,

         vPrest: +vTPrest,
         chaveNFe,
         ...toICMSReg(ICMS)
      };
      regs.push(cteReg)
   }
   return [regs, newAccObjLength]
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

function optanteSN(icms: ICMSCT) {
   return 'ICMSSN' in icms && icms.ICMSSN.indSN === '1';
}