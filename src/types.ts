
export type Msgs = {
   msgs: string[]
}

export type NfStatus = {
   emConting: boolean
   homolog: boolean
   semProtAut: boolean
}

export type NfStats = {
   numNfs: number
   emConting: number
   homolog: number
   semProtAut: number
}

type Det = {
   imposto: {
      ICMS:
      | { ICMS00: { origin: number, CST: number, vBC: number, pICMS: number, vICMS: number } }
      | { ICMS10: { origin: number, CST: number, vBC: number, pICMS: number, vICMS: number } }
      | { ICMS30: { origin: number, CST: number, vBCST: number, pICMSST: number, vICMSST: number } }
      | { ICMS40: { origin: number, CST: number, vICMS: number } }
      | { ICMS51: { origin: number, CST: number, vBC: number, pICMS: number, vICMS: number } }
      | { ICMS60: { origin: number, CST: number, vBCSTRet: number, vICMSSTRet: number } }
      | { ICMS70: { origin: number, CST: number, vBC: number, pICMS: number, vICMS: number, vBCST: number, pICMSST: number, vICMSST: number } }
      | { ICMS90: { origin: number, CST: number, vBC: number, pICMS: number, vICMS: number, vBCST: number, pICMSST: number, vICMSST: number } }
      | { ICMSPart: { origin: number, CST: number, vBC: number, pICMS: number, vICMS: number, vBCST: number, pICMSST: number, vICMSST: number } }
      | { ICMSST: { origin: number, CST: number, vBCSTRet: number, vBCSTDest: number, vICMSSTRet: number, vICMSSTDest: number } }
      | { ICMSSN101: { CSOSN: number } }
      | { ICMSSN102: { CSOSN: number } }
      | { ICMSSN201: { CSOSN: number } }
      | { ICMSSN202: { CSOSN: number } }
      | { ICMSSN500: { CSOSN: number } }
      | { ICMSSN900: { CSOSN: number } }
   }
   prod: {
      NCM: number
      CFOP: number
      // nItem: number
      cProd: string
      xProd: string
      qCom: number
      uCom: string
      vUnCom: number
      vProd: number
   }
}

export type FullNFe = {
   nfeProc: {
      NFe: NFe['NFe']
      protNFe: object
   }
}

export type NFe = {
   NFe: {
      infNFe: {
         emit: {
            CNPJ: string | undefined
            IE: string | undefined
            CRT: number
            xNome: string
            CNAE?: number
            cUF: number
            CPF: string
            enderEmit: { UF: string }
         }
         dest: {
            CNPJ: string | undefined
            IE: string | undefined
            indIEDest: number
            xNome: string
            CNAE?: number
            CPF: string
            enderDest: { UF: string }
         }
         det: Det[] | Det
         ide: {
            cDV: number
            cMunFG: number
            cNF: number
            cUF: number
            dhEmi: string
            dhSaiEnt: string
            finNFe: number
            idDest: number
            indFinal: number
            indPres: number
            mod: number
            nNF: number
            natOp: string
            procEmi: number
            serie: number
            tpAmb: number
            tpEmis: number
            tpNF: number
            tpImp: number
            verProc: string
         }
         infAdc: object
         infRespTec: object
         pag: object
         total: {
            ICMSTot: {
               vProd: number
               vNF: number
               vDesc: number
               vFrete: number
               vSeg: number
               vOutro: number
               vBC: number
               vICMS: number
               vBCST: number
               vST: number
               vICMSDeson: number
               vIPI: number
               // vProd: number
            }
         }
         transp: object
      }
   }
}

export type Reg = {
   dtEmissao: Date
   CNPJEmit: string | undefined
   IEEmit: string | undefined
   rsEmit: string | undefined
   CPFEmit: string | undefined
   ufEmit: string
   cnaeEmit: number | undefined
   descCnaeEmit: string
   // descCNAEEmit: string | undefined
   modelo: number
   chaveNF: string
   numNF: number
   vProdTot: number
   vDesc: number
   // // vNF: number
   vFrete: number
   vSeg: number
   vOutro: number
   vBC: number
   vICMS: number
   vBCST: number
   vST: number
   vICMSDeson: number
   vIPI: number
   CNPJDest: string | undefined
   IEDest: string | undefined
   rsDest: string | undefined
   CPFDest: string | undefined
   cnaeDest: number | undefined
   descCnaeDest: string
   natOp: string
   tpAmb: 'produção' | 'homologação'
   tpEmis: 'normal' | 'contingência'
   tpNF: 'entrada' | 'saída'
   // // dtCancel: string
   // items: Item[]
}

export type Item = {
   NCM: number
   descNCM: string
   CFOP: number
   descCFOP: string
   numSeqItem: number
   codProd: string
   descProd: string
   qCom: number
   uCom: string
   vUnCom: number
   vProd: number
}

export type RegFull = Reg & Item

export type Analitico = {
   cst: string
   cfop: string
   aliq: number
   valOper: number
   bc: number
   icms: number
   bcST: number
   sT: number
   redBc: number
}

export type AnaliticoFull = Analitico & { anoMes: Date }

export type InfoContrib = {
   nome: string
   IE: string
   iniPerApur: Date
   fimPerApur: Date
}

// NCM: number
// CFOP: number
// nItem: number
// cProd: string
// xProd: string
// qCom: number
// uCom: number
// vUnCom: number

// export type Sumario = {
//    // validadas: boolean
//    vNF: number
//    vProd: number
//    vICMS: number
//    vST: number
//    vBC: number
//    vBCST: number
// }

// export type SumarioFull = Sumario & {
//    validas: number
//    invalidas: number
//    totalNFs: number
// }