import type { FullNFe, ICMS, ICMSItem, Item, NfMiniReg, NFe, NfStats, NfStatus, NfReg, NfFullReg } from '../types'
import { cfopMap } from '../constants/cfopMap';
import { cnaeMap } from '../constants/cnaeMap';
import { ncmMap } from '../constants/ncmMap';
import { getWb } from '../excel/nf';
import { state } from '../store';
import { formatCNPJ, formatCPF, formatIE, getFileContent } from './common';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

function isFullNFe(obj: NFe | FullNFe): obj is FullNFe {
   return !!(obj as FullNFe).nfeProc;
}

export async function xmlToNfRegs(file: File): Promise<NfFullReg[]> {
   const regs: NfFullReg[] = [];
   const nfStats: NfStats = { emConting: 0, homolog: 0, semProtAut: 0, numNfs: 0 };

   const [xmls, newAccObjLength] = await getFileContent(file);

   for (const xml of xmls) {

      const _nfe: NFe | FullNFe = parser.parse(xml);
      const fullNF = isFullNFe(_nfe);
      const nfe = fullNF ? _nfe.nfeProc.NFe.infNFe : _nfe.NFe.infNFe;
      const { ide: { dhEmi, mod, nNF: _nNF, natOp, cDV, cNF: _cNF, cUF, serie: _serie, tpAmb, tpEmis, tpNF }, det: _det, emit, dest,
         total: { ICMSTot: { vProd: vProdTot, vDesc, vSeg, vFrete, vOutro, vBC, vICMS, vBCST, vST, vICMSDeson, vIPI } },
      } = nfe;
      const { CNPJ: _CNPJEmit, IE: IEEmit, xNome: xNomeEmit, CNAE: cnaeEmit, CPF: CPFEmit } = tpNF === 1 ? emit : dest;
      const { CNPJ: CNPJDest, IE: IEDest, xNome: xNomeDest, CNAE: cnaeDest, CPF: CPFDest } = tpNF === 1 ? dest : emit;
      const [ufEmit, ufDest] = tpNF === 1 ? [emit.enderEmit.UF, dest.enderDest.UF] : [dest.enderDest.UF, emit.enderEmit.UF];
      const [anoEmissao, mesEmissao,] = dhEmi.split('-');
      const det = Array.isArray(_det) ? _det : [_det];
      const items: Item[] =
         det.map(({ prod: { NCM, CFOP, cProd, qCom, uCom, vUnCom, xProd, vProd }, imposto: { ICMS } }, i) =>
         ({
            NCM, CFOP, numSeqItem: i + 1, codProd: cProd, descProd: xProd, qCom, uCom, vUnCom, vProd, descCFOP:
               cfopMap[CFOP] ?? '', descNCM: ncmMap[NCM] ?? '', ...getICMSReg(ICMS)
         }));
      const AAMM = `${anoEmissao.slice(-2)}${mesEmissao}`;
      const CNPJEmit = formatCNPJ(_CNPJEmit);
      const nNF = String(_nNF).padStart(9, '0')
      const serie = String(_serie).padStart(3, '0');
      const cNF = String(_cNF).padStart(8, '0');
      const chaveNF = `${cUF}${AAMM}${String(emit.CNPJ).padStart(14, '0')}${mod}${serie}${nNF}${tpEmis}${cNF}${cDV}`;
      const nfStatus: NfStatus = {
         emConting: tpEmis !== 1,
         homolog: tpAmb === 2,
         semProtAut: !fullNF
      };
      updateStats(nfStatus, nfStats);

      const NfMiniReg: NfMiniReg = {
         dtEmissao: new Date(dhEmi),
         CNPJEmit,
         IEEmit: ufEmit.toUpperCase() === 'AM' ? formatIE(IEEmit) : IEEmit,
         rsEmit: xNomeEmit,
         CPFEmit: formatCPF(CPFEmit),
         ufEmit,
         cnaeEmit: cnaeEmit,
         descCnaeEmit: cnaeEmit ? cnaeMap[cnaeEmit] : '',
         modelo: mod,
         numNF: _nNF,
         CNPJDest: formatCNPJ(CNPJDest),
         IEDest: ufDest.toUpperCase() === 'AM' ? formatIE(IEDest) : IEDest && String(IEDest),
         rsDest: xNomeDest,
         CPFDest: formatCPF(CPFDest),
         ufDest,
         cnaeDest,
         descCnaeDest: cnaeDest ? cnaeMap[cnaeDest] : '',
         natOp,
         tpAmb: tpAmb === 1 ? 'produção' : 'homologação',
         tpEmis: tpEmis === 1 ? 'normal' : 'contingência',
         tpNF: tpNF === 1 ? 'saída' : 'entrada',
         chaveNF: String(chaveNF),
      };

      const monthRegs = items.map((item, i) => {
         const reg: NfReg = {
            ...NfMiniReg,
            vProdTot: i === 0 ? vProdTot : 0,
            vDesc: i === 0 ? vDesc : 0,
            vFrete: i === 0 ? vFrete : 0,
            vSeg: i === 0 ? vSeg : 0,
            vOutro: i === 0 ? vOutro : 0,
            vBC: i === 0 ? vBC : 0,
            vICMS: i === 0 ? vICMS : 0,
            vBCST: i === 0 ? vBCST : 0,
            vST: i === 0 ? vST : 0,
            vICMSDeson: i === 0 ? vICMSDeson : 0,
            vIPI: i === 0 ? vIPI : 0,
         }
         return { ...reg, ...item };
      });
      regs.push(...monthRegs);
      // yield ([monthRegs, nfStats, len] as [NfFullReg[], NfStats, number])
   }
   return regs;
}

function updateStats({ emConting, homolog, semProtAut }: NfStatus, stats: NfStats) {
   if (emConting) stats.emConting++;
   if (homolog) stats.homolog++;
   if (semProtAut) stats.semProtAut++;
}

export async function createNfSheet(regs: NfFullReg[], link: HTMLAnchorElement) {
   const wb = getWb(regs);
   const buffer = await wb.xlsx.writeBuffer();
   const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   link.href = URL.createObjectURL(file);
   link.download = 'NFe-itens.xlsx';
}

export function formatNfStats({ numNfs, emConting, homolog, semProtAut }: NfStats) {
   const msgs = [
      `Total de notas fiscais: ${numNfs}`,
      `Notas fiscais emitidas em contingência: ${emConting}`,
      `Notas fiscais emitidas em ambiente de homologação: ${homolog}`,
      `Notas fiscais com protocolo de autorização omitido: ${semProtAut}`
   ];
   state.msgs = msgs;
}


function getICMSReg(icms: ICMS | undefined): ICMSItem | {} {
   if (icms === undefined) return {};

   if ('ICMS00' in icms) {
      const { orig, CST, vBC: vBCItem, pICMS, vICMS: vICMSItem } = icms.ICMS00;
      return { orig, CST: String(CST).padStart(2, '0'), vBCItem, pICMS, vICMSItem };
   } else if ('ICMS10' in icms) {
      const { orig, CST, vBC: vBCItem, pICMS, vICMS: vICMSItem, vBCST: vBCSTItem, pICMSST, vICMSST } = icms.ICMS10;
      return { orig, CST: String(CST).padStart(2, '0'), vBCItem, pICMS, vICMSItem, vBCSTItem, pICMSST, vICMSST };
   } else if ('ICMS20' in icms) {
      const { orig, CST, vBC: vBCItem, pICMS, vICMS: vICMSItem } = icms.ICMS20;
      return { orig, CST: String(CST).padStart(2, '0'), vBCItem, pICMS, vICMSItem };
   } else if ('ICMS30' in icms) {
      const { orig, CST, vBCST: vBCSTItem, pICMSST, vICMSST } = icms.ICMS30;
      return { orig, CST: String(CST).padStart(2, '0'), vBCSTItem, pICMSST, vICMSST };
   } else if ('ICMS40' in icms) {
      const { orig, CST, vICMS: vICMSItem } = icms.ICMS40;
      return { orig, CST: String(CST).padStart(2, '0'), vICMSItem };
   } else if ('ICMS51' in icms) {
      const { orig, CST, vBC: vBCItem, pICMS, vICMS: vICMSItem } = icms.ICMS51;
      return { orig, CST: String(CST).padStart(2, '0'), vBCItem, pICMS, vICMSItem };
   } else if ('ICMS60' in icms) {
      const { orig, CST, vBCSTRet, vICMSSTRet } = icms.ICMS60;
      return { orig, CST: String(CST).padStart(2, '0'), vBCSTRet, vICMSSTRet };
   } else if ('ICMS70' in icms) {
      const { orig, CST, vBC: vBCItem, pICMS, vICMS: vICMSItem, vBCST: vBCSTItem, pICMSST, vICMSST } = icms.ICMS70;
      return { orig, CST: String(CST).padStart(2, '0'), vBCItem, pICMS, vICMSItem, vBCSTItem, pICMSST, vICMSST };
   } else if ('ICMS90' in icms) {
      const { orig, CST, vBC: vBCItem, pICMS, vICMS: vICMSItem, vBCST: vBCSTItem, pICMSST, vICMSST } = icms.ICMS90;
      return { orig, CST: String(CST).padStart(2, '0'), vBCItem, pICMS, vICMSItem, vBCSTItem, pICMSST, vICMSST };
   } else if ('ICMSPart' in icms) {
      const { orig, CST, vBC: vBCItem, pICMS, vICMS: vICMSItem, vBCST: vBCSTItem, pICMSST, vICMSST } = icms.ICMSPart;
      return { orig, CST: String(CST).padStart(2, '0'), vBCItem, pICMS, vICMSItem, vBCSTItem, pICMSST, vICMSST };
   } else if ('ICMSST' in icms) {
      const { orig, CST, vBCSTRet, vICMSSTRet, vBCSTDest, vICMSSTDest } = icms.ICMSST;
      return { orig, CST: String(CST).padStart(2, '0'), vBCSTRet, vICMSSTRet, vBCSTDest, vICMSSTDest };
   }
   return {};
}


// export function readNFes(fileList: FileList) {

//    const acc: SumarioFull = { vBC: 0, vBCST: 0, vICMS: 0, vNF: 0, vProd: 0, vST: 0, validas: 0, invalidas: 0, totalNFs: 0 };
//    return Promise.all([...Array(fileList.length).keys()].map(i => {

//       const file = fileList[i];
//       if (file.type !== 'text/xml') {
//          return;
//       }

//       return new Promise<[Sumario, boolean]>(r => {
//          file.text().then(xml => {
//             const nfe: NFe | FullNFe = parser.parse(xml);
//             // console.log('nfe', nfe)
//             const sumario = sumariza(nfe);
//             validateXML(xml).then(docValido => {
//                r([sumario, docValido] as [Sumario, boolean])
//             });
//          })
//       })
//    }))
//       .then(_arr => {
//          const arr = _arr.filter((b): b is [Sumario, boolean] => b !== undefined)
//          for (const [sumario, docValido] of arr) {
//             atualizaSumario(acc, sumario, docValido);
//          }
//          return acc;
//       });
// }

// export function readNFes2(fileList: FileList) {
//    const acc: SumarioFull = { vBC: 0, vBCST: 0, vICMS: 0, vNF: 0, vProd: 0, vST: 0, validas: 0, invalidas: 0, totalNFs: 0 };
//    return new Promise<SumarioFull>(async r => {
//       for (const i = 0; i < fileList.length; i++) {
//          // console.log('fileList[i].type', fileList[i].type)
//          const file = fileList[i];
//          if (file.type !== 'text/xml') {
//             continue;
//          }
//          const xml = await file.text();
//          const nfe: NFe | FullNFe = parser.parse(xml);
//          // console.log('nfe', nfe)
//          const sumario = sumariza(nfe);
//          const docValido = await validateXML(xml);
//          atualizaSumario(acc, sumario, docValido);
//          // console.log('i', i)
//       }
//       r(acc)
//    });
// }

// export function readNFes3(fileList: FileList) {

//    const acc: SumarioFull = { vBC: 0, vBCST: 0, vICMS: 0, vNF: 0, vProd: 0, vST: 0, validas: 0, invalidas: 0, totalNFs: 0 };
//    return Promise.all([...Array(fileList.length).keys()].map(i => {
//       const file = fileList[i];
//       if (file.type !== 'text/xml') {
//          return;
//       }
//       return file.text()
//    }))
//       .then(_xmls => {
//          const xmls = _xmls.filter((b): b is string => b !== undefined)
//          for (const xml of xmls) {
//             const nfe: NFe | FullNFe = parser.parse(xml);
//             //       // console.log('nfe', nfe)
//             const sumario = sumariza(nfe);
//             validateXML(xml).then(docValido => {
//                atualizaSumario(acc, sumario, docValido);
//             });
//          }
//          return acc;
//       });
// }


// export function sumariza(nfe: NFe | FullNFe): Sumario {
//    if (isFullNFe(nfe)) {
//       const { vNF, vBC, vBCST, vICMS, vProd, vST } = nfe.nfeProc.NFe.infNFe.total.ICMSTot;
//       return { vNF, vBC, vBCST, vICMS, vProd, vST };
//    }
//    const { vNF, vBC, vBCST, vICMS, vProd, vST } = nfe.NFe.infNFe.total.ICMSTot;
//    return { vNF, vBC, vBCST, vICMS, vProd, vST };
// }
// export function validateXML(xml: string) {
//    const signedDocument = Parse(xml);
//    const xmlSignature = signedDocument.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature");
//    const signedXml = new SignedXml(signedDocument);
//    signedXml.LoadXml(xmlSignature[0]);
//    return signedXml.Verify()
//       .then(res => {
//          // console.log((res ? "Valid" : "Invalid") + " signature");
//          return res;
//       })
//       .catch(e => {
//          // console.error(e);
//          return false;
//       });

// }

// export function atualizaSumario(acc: SumarioFull, sumario: Sumario, docValido: boolean) {
//    acc.vBC += sumario.vBC;
//    acc.vBCST += sumario.vBCST;
//    acc.vICMS += sumario.vICMS;
//    acc.vNF += sumario.vNF;
//    acc.vProd += sumario.vNF;
//    acc.vProd += sumario.vProd;
//    acc.vST += sumario.vST;
//    docValido ? acc.validas++ : acc.invalidas++;
//    acc.totalNFs++;
// }

// export async function getInfoSummary(file: File): Promise<[Sumario, boolean]> {
//    const xml = await file.text();
//    const nfe: NFe | FullNFe = parser.parse(xml);
//    console.log('nfe', nfe);
//    const sumario = sumariza(nfe);
//    const docValido = await validateXML(xml);
//    return [sumario, docValido]
// }