import { cfopMap } from './constants/cfopMap';
import { cnaeMap } from './constants/cnaeMap';
import { ncmMap } from './constants/ncmMap';
import { ufsMap } from './constants/ufMap';
import type { FullNFe, Item, NFe, NfStatus, RegFull } from './types'
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

function isFullNFe(obj: NFe | FullNFe): obj is FullNFe {
   return !!(obj as FullNFe).nfeProc;
}

export async function nfeToItems(file: File): Promise<[RegFull[], NfStatus]> {
   const xml = await file.text();
   const _nfe: NFe | FullNFe = parser.parse(xml);
   const fullNF = isFullNFe(_nfe);
   const nfe = fullNF ? _nfe.nfeProc.NFe.infNFe : _nfe.NFe.infNFe;
   const { ide: { dhEmi, mod, nNF: _nNF, natOp, cDV, cNF: _cNF, cUF, serie: _serie, tpAmb, tpEmis, tpNF }, det: _det, emit, dest,
      total: { ICMSTot: { vProd, vDesc, vSeg, vFrete, vOutro, vBC, vICMS, vBCST, vST, vICMSDeson, vIPI } },
   } = nfe;
   const { CNPJ: _CNPJEmit, IE: IEEmit, xNome: xNomeEmit, CNAE: cnaeEmit, CPF: CPFEmit } = tpNF === 1 ? emit : dest;
   const { CNPJ: CNPJDest, IE: IEDest, xNome: xNomeDest, CNAE: cnaeDest, CPF: CPFDest } = tpNF === 1 ? dest : emit;
   const [anoEmissao, mesEmissao,] = dhEmi.split('-');
   const det = Array.isArray(_det) ? _det : [_det];
   const items: Item[] =
      det.map(({ prod: { NCM, CFOP, nItem, cProd, qCom, uCom, vUnCom, xProd } }) =>
      ({
         NCM, CFOP, numSeqItem: nItem, codProd: cProd, descProd: xProd, qCom, uCom, vUnCom, descCFOP:
            cfopMap[CFOP] ?? '', descNCM: ncmMap[NCM] ?? ''
      }));
   const AAMM = `${anoEmissao.slice(-2)}${mesEmissao}`;
   const CNPJEmit = _CNPJEmit && String(_CNPJEmit).padStart(14, '0');
   const nNF = String(_nNF).padStart(9, '0')
   const serie = String(_serie).padStart(3, '0');
   const cNF = String(_cNF).padStart(8, '0');
   const chaveNF = `${cUF}${AAMM}${String(emit.CNPJ).padStart(14, '0')}${mod}${serie}${nNF}${tpEmis}${cNF}${cDV}`;
   const nfStatus: NfStatus = {
      emConting: tpEmis !== 1,
      homolog: tpAmb === 2,
      semProtAut: !fullNF
   }

   const regs = items.map(item => ({
      anoEmissao: +anoEmissao,
      mesEmissao: +mesEmissao,
      dtEmissao: dhEmi.substring(0, 10),
      CNPJEmit,
      IEEmit: IEEmit && String(IEEmit),
      rsEmit: xNomeEmit,
      CPFEmit: CPFEmit && String(CPFEmit).padStart(11, '0'),
      ufEmit: ufsMap[cUF],
      cnaeEmit: cnaeEmit,
      descCnaeEmit: cnaeEmit ? cnaeMap[cnaeEmit] : '',
      modelo: mod,
      numNF: _nNF,
      vProd,
      vDesc,
      vFrete,
      vSeg,
      vOutro,
      vBC,
      vICMS,
      vBCST,
      vST,
      vICMSDeson,
      vIPI,
      CNPJDest: String(CNPJDest).padStart(14, '0'),
      IEDest: IEDest && String(IEDest),
      rsDest: xNomeDest,
      CPFDest: CPFDest && String(CPFDest).padStart(11, '0'),
      cnaeDest,
      descCnaeDest: cnaeDest ? cnaeMap[cnaeDest] : '',
      natOp,
      tpAmb: tpAmb === 1 ? 'produção' : 'homologação',
      tpEmis: tpEmis === 1 ? 'normal' : 'contingência',
      tpNF: tpNF === 1 ? 'saída' : 'entrada',
      chaveNF: String(chaveNF),
      ...item
   } as RegFull));
   return [regs, nfStatus]
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