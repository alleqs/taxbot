
export type Msgs = {
   msgs: string[]
}

//************NFs**************************** */

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

export type NfReg = {
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

export type NfMiniReg = Omit<NfReg, 'vProdTot' | 'vDesc' | 'vFrete' | 'vSeg' | 'vOutro' | 'vBC' | 'vICMS' | 'vBCST' | 'vST' | 'vICMSDeson' | 'vIPI'>
export type NfFullReg = NfReg & Item

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
   cfopAliq: `${string}-${string}`
   valOper: number
   bc: number
   icms: number
}

export type ResumoAnalitico = {
   entrTribInternas: Summary[]
   entrTribInterest: Summary[]
   entrNaoTribInternas: Summary[]
   entrNaoTribInterest: Summary[]
   sdTribInternas: Summary[]
   sdTribInterest: Summary[]
   sdNaoTribInternas: Summary[]
   sdNaoTribInterest: Summary[]
}

/**************CTe********************* */

type CTeContrib = {
   CNPJ: string
   CPF: string
   IE: string
   xNome: string
}

export type FullCTe = {
   cteProc: {
      CTe: CTe['CTe']
      protCTe: object
   }
}

export type CTe = {
   CTe: {
      infCte: {
         ide: {
            cUF: string
            cCT: string
            CFOP: string
            natOp: string
            mod: string
            serie: string
            nCT: string
            dhEmi: string
            tpImp: string
            tpEmis: string
            cDV: string
            tpAmb: string
            tpCTe: string
            procEmi: string
            verProc: string
            indGlobalizado: string
            modal: string
            tpServ: string
            // cMunEnv: string
            // xMunEnv: string
            // UFEnv: string
            // cMunIni: string
            // xMunIni: string
            // UFIni: string
            // cMunFim: string
            // xMunFim: string
            // UFFim: string
         }
         compl: object
         emit: CTeContrib & { enderEmit: { UF: string } }
         rem: CTeContrib & { enderReme: { UF: string } }
         exped: CTeContrib & { enderExped: { UF: string } }
         receb: CTeContrib & { enderReceb: { UF: string } }
         dest: CTeContrib & { enderDest: { UF: string } }
         vPrest: { vTPrest: number }
         imp: {
            ICMS:
            | { ICMS00: { CST: number, vBC: number, pICMS: number, vICMS: number } }
            | { ICMS20: { CST: number, pRedBC: number, vBC: number, pICMS: number, vICMS: number } }
            | { ICMS45: { CST: number } }
            | { ICMS60: { CST: number, vBCSTRet: number, vICMSSTRet: number, pICMSSTRet: number, vCred: number } }
            | { ICMS90: { CST: number, pRedBC: number, vBC: number, pICMS: number, vICMS: number, vCred: number } }
            | { ICMSOutraUF: { CST: number, pRedBCOutraUF: number, vBCOutraUF: number, pICMSOutraUF: number, vICMSOutraUF: number } }
            | { ICMSSN: { CST: number, vTotTrib: number } }
            ICMSUFFim: {
               vBCUFFim: number
               pFCPUFFim: number
               pICMSUFFim: number
               pICMSInter: number
               vFCPUFFim: number
               vICMSUFFim: number
               vICMSUFIni: number
            }
         }
         infCTeNorm: {
            infDoc: { infNFe: { chave: string } }
            infModal: Record<'rodo' | 'aereo' | 'ferrov' | 'aquav' | 'duto' | 'multimodal', unknown>
         }
      }
      infCTeSupl: object
      Signature: object
   }
}

export type CTeReg = {
   dtEmissao: Date
   nCT: string
   chaveCT: string
   modelo: string
   natOp: string
   modal: string

   CNPJEmit: string | number | undefined
   IEEmit: string | number | undefined
   rsEmit: string | undefined
   CPFEmit: string | number | undefined
   ufEmit: string

   CNPJDest: string | number | undefined
   IEDest: string | number | undefined
   rsDest: string | undefined
   CPFDest: string | number | undefined
   ufDest: string

   vPrest: number
   chaveNFe: string
}