import { partition, groupBy, sumBy, sortBy } from "lodash";
import type { Analitico, InfoContrib, ResumoAnalitico, Summary } from "../types";
import { pdf } from "@react-pdf/renderer";
import { Resumo } from "../components/PDF/Resumo";

const cstTrib = ['00', '10', '20', '70'];
const cfopInternas = ['1', '5'];
const cfopInterestaduais = ['2', '6'];

export function getGroupedOp(entradas: Analitico[], saidas: Analitico[]): ResumoAnalitico {
   const [entrTrib, entrNaoTrib] = partTrib(entradas);
   const [entrTribInt, entrTribNaoInt] = partInt(entrTrib);
   const [entrNaoTribInt, entrNaoTribNaoInt] = partInt(entrNaoTrib);
   const [sdTrib, sdNaoTrib] = partTrib(saidas);
   const [sdTribInt, sdTribNaoInt] = partInt(sdTrib);
   const [sdNaoTribInt, sdNaoTribNaoInt] = partInt(sdNaoTrib);

   return {
      entrTribInt,
      entrTribNaoInt,
      entrNaoTribInt,
      entrNaoTribNaoInt,
      sdTribInt,
      sdTribNaoInt,
      sdNaoTribInt,
      sdNaoTribNaoInt
   };
}

export async function getSummaryPDF(infoContrib: InfoContrib, resumo: ResumoAnalitico, link: HTMLAnchorElement) {
   const blob = await pdf(Resumo(infoContrib, resumo)).toBlob();
   link.href = URL.createObjectURL(blob);
   link.download = 'resumo.pdf';
}

function partTrib(arr: Analitico[]): [Analitico[], Analitico[]] {
   const [tributaveis, naoTrib] = partition(arr, ({ cst, aliq }) => {
      const cstB = cst.substring(1);
      return aliq !== 0 && cstTrib.includes(cstB);
   });
   return [tributaveis, naoTrib];
}

function partInt(arr: Analitico[]): [Summary[], Summary[]] {
   const map = groupBy(arr, ({ cfop, aliq }) => `${cfop}-${aliq}`);
   const summaryArr: Summary[] = Object.entries(map).map(([cfopAliq, arr]) => ({
      cfopAliq: cfopAliq as `${number}-${number}`,
      valOper: sumBy(arr, b => b.valOper),
      bc: sumBy(arr, b => b.bc),
      icms: sumBy(arr, b => b.icms)
   }))
   const [internas, naoInternas] = partition(summaryArr, ({ cfopAliq }) => {
      const cod = cfopAliq.charAt(0);
      return cfopInternas.includes(cod);
   });
   const interestaduais = naoInternas.filter(({ cfopAliq }) => {
      const cod = cfopAliq.charAt(0);
      return cfopInterestaduais.includes(cod);
   })
   return [sortBy(internas, ({ cfopAliq }) => cfopAliq), sortBy(interestaduais, ({ cfopAliq }) => cfopAliq)];
}