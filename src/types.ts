
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

export type ICMS =
   | { ICMS00: { orig: number, CST: number, vBC: number, pICMS: number, vICMS: number } }
   | { ICMS10: { orig: number, CST: number, vBC: number, pICMS: number, vICMS: number, vBCST: number, pICMSST: number, vICMSST: number } }
   | { ICMS20: { orig: number, CST: number, vBC: number, pICMS: number, vICMS: number } }
   | { ICMS30: { orig: number, CST: number, vBCST: number, pICMSST: number, vICMSST: number } }
   | { ICMS40: { orig: number, CST: number, vICMS: number } }
   | { ICMS51: { orig: number, CST: number, vBC: number, pICMS: number, vICMS: number } }
   | { ICMS60: { orig: number, CST: number, vBCSTRet: number, vICMSSTRet: number } }
   | { ICMS70: { orig: number, CST: number, vBC: number, pICMS: number, vICMS: number, vBCST: number, pICMSST: number, vICMSST: number } }
   | { ICMS90: { orig: number, CST: number, vBC: number, pICMS: number, vICMS: number, vBCST: number, pICMSST: number, vICMSST: number } }
   | { ICMSPart: { orig: number, CST: number, vBC: number, pICMS: number, vICMS: number, vBCST: number, pICMSST: number, vICMSST: number } }
   | { ICMSST: { orig: number, CST: number, vBCSTRet: number, vBCSTDest: number, vICMSSTRet: number, vICMSSTDest: number } }
   | { ICMSSN101: { CSOSN: number } }
   | { ICMSSN102: { CSOSN: number } }
   | { ICMSSN201: { CSOSN: number } }
   | { ICMSSN202: { CSOSN: number } }
   | { ICMSSN500: { CSOSN: number } }
   | { ICMSSN900: { CSOSN: number } }


type Det = {
   prod: {
      NCM: number
      CFOP: number
      cProd: string
      xProd: string
      qCom: number
      uCom: string
      vUnCom: number
      vProd: number
   }
   imposto: {
      ICMS: ICMS
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
            CNPJ: string | number | undefined
            IE: string | number | undefined
            CRT: number
            xNome: string
            CNAE?: number
            CPF: string | number | undefined
            enderEmit: { UF: string }
         }
         dest: {
            CNPJ: string | number | undefined
            IE: string | number | undefined
            indIEDest: number
            xNome: string
            CNAE?: number
            CPF: string | number | undefined
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
            }
         }
         transp: object
      }
   }
}

export type Reg = {
   dtEmissao: Date
   CNPJEmit: string | number | undefined
   IEEmit: string | number | undefined
   rsEmit: string | undefined
   CPFEmit: string | number | undefined
   ufEmit: string
   cnaeEmit: number | undefined
   descCnaeEmit: string
   // descCNAEEmit: string | undefined
   modelo: number
   chaveNF: string
   numNF: number
   vProdTot: number
   vDesc: number
   // vNF: number
   vFrete: number
   vSeg: number
   vOutro: number
   vBC: number
   vICMS: number
   vBCST: number
   vST: number
   vICMSDeson: number
   vIPI: number
   CNPJDest: string | number | undefined
   IEDest: string | number | undefined
   rsDest: string | undefined
   CPFDest: string | number | undefined
   ufDest: string
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
} & Partial<ICMSItem>

export type ICMSItem = {
   orig: number
   CST: string
   vBCItem?: number
   pICMS?: number
   vICMS?: number
   vBCSTItem?: number
   pICMSST?: number
   vICMSST?: number
   vBCSTRet?: number
   vBCSTDest?: number
   vICMSSTRet?: number
   vICMSSTDest?: number
}

export type MiniReg = Omit<Reg, 'vProdTot' | 'vDesc' | 'vFrete' | 'vSeg' | 'vOutro' | 'vBC' | 'vICMS' | 'vBCST' | 'vST' | 'vICMSDeson' | 'vIPI'>
export type RegFull = Reg & Item

//********************* EFD ***************************
//Bloco C
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
   cnpj: string
   IE: string
   iniEscrit: Date
   fimEscrit: Date
}

//Bloco E
export type ApOpPropria = {
   iniPerApur: Date
   fimPerApur: Date
   saídas: number
   ajDocFiscal: number
   aj: number
   estCred: number
   credAq: number
   ajCredDocFiscal: number
   ajCred: number
   estDeb: number
   saldoAcc: number
   saldoDev: number
   deducoes: number
   icmsARec: number
   saldoCredorProxPer: number
   recExtraAp: number
}

export type AjDetalhe = {
   cod: string
   descr: string
   val: number
}

export type Summary = {
   cfopAliq: `${number}-${number}`
   valOper: number
   bc: number
   icms: number
}

export type ResumoAnalitico = {
   entrTribInt: Summary[]
   entrTribNaoInt: Summary[]
   entrNaoTribInt: Summary[]
   entrNaoTribNaoInt: Summary[]
   sdTribInt: Summary[]
   sdTribNaoInt: Summary[]
   sdNaoTribInt: Summary[]
   sdNaoTribNaoInt: Summary[]
}