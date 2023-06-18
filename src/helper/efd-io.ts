import type { Analitico, AnaliticoFull, InfoContrib } from "../types";
import { groupBy, partition } from 'lodash';
import { getWb } from "../excel/efd";
import { min, max } from 'lodash'
import { getFileContent, getInfoContrib, getValidatedInfoContrib } from "./common";


export async function getEfdRegistries(fileList: FileList): Promise<[Analitico[], Analitico[], InfoContrib]> {
   const analiticoMap: Record<string, Analitico[]> = {};
   const len = fileList.length;
   let razaoSocial: string | undefined = undefined;
   let inscEst: string | undefined = undefined;
   let cnpj: string | undefined = undefined;
   let minDate: Date | undefined = undefined;
   let maxDate: Date | undefined = undefined;
   for (let i = 0; i < len; i++) {
      const file = fileList[i];
      const efd = await getFileContent(file);
      const lines = efd.split('\r\n');
      const { iniEscrit, fimEscrit, nome, IE, cnpj: _cnpj } = getInfoContrib(lines);
      const analitico = getAnaliticoRegs(lines);
      razaoSocial ??= nome;
      inscEst ??= IE;
      cnpj ??= _cnpj;
      minDate = min([minDate, iniEscrit]);
      maxDate = max([maxDate, fimEscrit]);
      const anoMes = `${iniEscrit.getFullYear()}-${iniEscrit.getMonth() + 1}`;
      analiticoMap[anoMes] = analitico;
   }

   const ioAgregadoMap = getIOAgregadoMap(analiticoMap);
   const [entradas, saidas] = partition(Object.values(ioAgregadoMap).flat(), c => +c.cfop < 4000);
   const infoContrib = getValidatedInfoContrib(razaoSocial, inscEst, minDate, maxDate, cnpj);

   return [sort(entradas), sort(saidas), infoContrib];
}

export async function createEfdSheet(entradas: Analitico[], saidas: Analitico[], infoContrib: InfoContrib, link: HTMLAnchorElement) {
   const wb = getWb(entradas, saidas, infoContrib);
   const buffer = await wb.xlsx.writeBuffer();
   const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   link.href = URL.createObjectURL(file);
   link.download = 'IO.xlsx';
}

function getAnaliticoRegs(lines: string[]): Analitico[] {
   const regs: Analitico[] = [];

   for (const line of lines) {
      const cod = line.substring(1, 5);
      if (cod === 'C190') {
         const [, , cst, cfop, _aliq, _valOper, _bc, _icms, _bcIcmsST, _icmsST, _redBc, ,] = line.split('|');
         const analitico: Analitico = {
            cst, cfop, aliq: +_aliq.replaceAll(',', '.'), valOper: +_valOper.replaceAll(',', '.'), bc: +_bc.replaceAll(',', '.'), icms: +_icms.replaceAll(',', '.'),
            bcST: +_bcIcmsST.replaceAll(',', '.'), sT: +_icmsST.replaceAll(',', '.'), redBc: +_redBc.replaceAll(',', '.')
         };
         regs.push(analitico);
      } else if (cod === 'D190') {
         const [, , cst, cfop, _aliq, _valOper, _bc, _icms, _redBc,] = line.split('|');
         const analitico: Analitico = {
            cst, cfop, aliq: +_aliq.replaceAll(',', '.'), valOper: +_valOper.replaceAll(',', '.'), bc: +_bc.replaceAll(',', '.'), icms: +_icms.replaceAll(',', '.'),
            bcST: 0, sT: 0, redBc: +_redBc.replaceAll(',', '.')
         };
         regs.push(analitico);
      }
   }
   return regs;
}

function getIOAgregadoMap(analiticoMap: Record<string, Analitico[]>): Record<string, AnaliticoFull[]> {
   const agregadoMap: Record<string, AnaliticoFull[]> = {};
   Object.entries(analiticoMap).forEach(([anoMes, analiticoRegs]) => {
      const obj = groupBy(analiticoRegs, ({ cst, cfop, aliq }) => `${cst}-${cfop}-${aliq}`);
      const agregado = Object.entries(obj).map(([key, analiticoArr]) => {
         let bcAcc = 0, icmsAcc = 0, bcSTAcc = 0, stAcc = 0, redBcAcc = 0, valOperAcc = 0;
         analiticoArr.forEach(({ bc, icms, bcST, sT, redBc, valOper }) => {
            icmsAcc += icms;
            bcAcc += bc;
            bcSTAcc += bcST;
            stAcc += sT;
            redBcAcc += redBc;
            valOperAcc += valOper;
         });
         const [cst, cfop, _aliq] = key.split('-');
         const analitico: AnaliticoFull = {
            cst, cfop, aliq: +_aliq, bc: +bcAcc.toFixed(2), bcST: +bcSTAcc.toFixed(2), icms: +icmsAcc.toFixed(2),
            sT: +stAcc.toFixed(2), redBc: +redBcAcc.toFixed(2), valOper: +valOperAcc.toFixed(2), anoMes: new Date(+anoMes.substring(0, 4), +anoMes.substring(5, 7) - 1)
         };
         return analitico;
      });
      agregadoMap[anoMes] = agregado;
   });
   return agregadoMap;
}

function sort(arr: Analitico[]) {
   arr.sort((a, b) => {
      if (a.cst > b.cst) {
         return 1;
      } else if (a.cst < b.cst) {
         return -1;
      }
      if (a.cfop > b.cfop) {
         return 1;
      } else if (a.cfop < b.cfop) {
         return -1;
      }
      if (a.aliq > b.aliq) {
         return 1
      } else if (a.aliq < b.aliq) {
         return -1;
      }
      return 0;
   });
   return arr;
}


