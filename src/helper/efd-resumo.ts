import { groupBy, partition, sortBy, sumBy } from "lodash";
import type { Analitico, InfoContrib, ResumoAnalitico, Summary } from "../types";
import { pdf } from "@react-pdf/renderer";
import { Resumo } from "../components/PDF/Resumo";

// const cstTrib = ['00', '10', '20', '70'];

export function getGroupedOp(entradas: Analitico[], _saidas: Analitico[]): ResumoAnalitico {
   const {
      opTribInternas: entrTribInternas,
      opTribInterest: entrTribInterest,
      opNaoTribInternas: entrNaoTribInternas,
      opNaoTribInterest: entrNaoTribInterest
   } = getOpSummary(entradas, '3');

   const {
      opTribInternas: sdTribInternas,
      opTribInterest: sdTribInterest,
      opNaoTribInternas: sdNaoTribInternas,
      opNaoTribInterest: sdNaoTribInterest
   } = getOpSummary(entradas, '7');

   return {
      entrNaoTribInternas,
      entrTribInterest,
      entrTribInternas,
      entrNaoTribInterest,
      sdTribInternas,
      sdTribInterest,
      sdNaoTribInternas,
      sdNaoTribInterest
   };
}

export async function getSummaryPDF(infoContrib: InfoContrib, resumo: ResumoAnalitico, link: HTMLAnchorElement) {
   const blob = await pdf(Resumo(infoContrib, resumo)).toBlob();
   link.href = URL.createObjectURL(blob);
   link.download = 'resumo.pdf';
}


function getOpSummary(_arrOp: Analitico[], digOpInvalida: string) {
   const arrOp = _arrOp.filter(({ cfop }) => !cfop.startsWith(digOpInvalida));
   const arrOpAgr = groupBy(arrOp, ({ cfop, aliq }) => `${cfop}-${String(+aliq).padStart(2, '0')}`);
   const arrOpSummary: Summary[] = Object.entries(arrOpAgr).map(([cfopAliq, arr]) => ({
      cfopAliq: cfopAliq as `${number}-${number}`,
      valOper: sumBy(arr, b => b.valOper),
      bc: sumBy(arr, b => b.bc),
      icms: sumBy(arr, b => b.icms)
   }));
   const [opTrib, opNaoTrib] = partition(arrOpSummary, ({ icms }) => icms > 0);
   const [opTribInternas, opTribInterest] = partition(opTrib, ({ cfopAliq }) => cfopAliq.startsWith('1'));
   const [opNaoTribInternas, opNaoTribInterest] = partition(opNaoTrib, ({ cfopAliq }) => cfopAliq.startsWith('1'));
   return {
      opTribInternas: sortBy(opTribInternas, ({ cfopAliq }) => cfopAliq),
      opTribInterest: sortBy(opTribInterest, ({ cfopAliq }) => cfopAliq),
      opNaoTribInternas: sortBy(opNaoTribInternas, ({ cfopAliq }) => cfopAliq),
      opNaoTribInterest: sortBy(opNaoTribInterest, ({ cfopAliq }) => cfopAliq),
   };
}