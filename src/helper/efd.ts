import JSZip from "jszip";
import type { Analitico, AnaliticoFull, InfoContrib } from "../types";
import { groupBy, partition } from 'lodash';
import { getWb } from "../excel/efd";
import { min, max } from 'lodash'


export async function getEfdRegistries(fileList: FileList): Promise<[Analitico[], Analitico[], InfoContrib]> {
   const analiticoMap: Record<string, Analitico[]> = {};

   const zip = new JSZip();
   const len = fileList.length;
   let razaoSocial: string | undefined = undefined;
   let inscEst: string | undefined = undefined;
   let minDate: Date | undefined = undefined;
   let maxDate: Date | undefined = undefined;
   for (let i = 0; i < len; i++) {
      const file = fileList[i];
      if (file.type === 'text/plain') {
         console.log('file.name', file.name)
      } else if (file.type === 'application/x-zip-compressed') {
         const buffer = await file.arrayBuffer();
         const obj = await zip.loadAsync(buffer);
         const uint8Arr = await Object.values(obj.files).at(-1)?.async('uint8array');
         if (!uint8Arr) throw new Error("Efd não encontrada");
         const efd = [...uint8Arr].map(c => String.fromCharCode(c)).join('');
         const [{ iniPerApur, fimPerApur, nome, IE }, analitico] = getAnaliticoRegs(efd);
         razaoSocial ??= nome;
         inscEst ??= IE;
         minDate = min([minDate, iniPerApur]);
         maxDate = max([maxDate, fimPerApur]);
         const anoMes = `${iniPerApur.getFullYear()}-${iniPerApur.getMonth() + 1}`;
         analiticoMap[anoMes] = analitico;
      }
   }
   const agregadoMap = getAgregadoMap(analiticoMap);
   const [entradas, saidas] = partition(Object.values(agregadoMap).flat(), c => +c.cfop < 4000);
   if (!razaoSocial || !inscEst || !minDate || !maxDate) {
      throw new Error("Registros não encontrados");
   }
   const infoContrib: InfoContrib = {
      nome: razaoSocial,
      IE: inscEst,
      iniPerApur: minDate,
      fimPerApur: maxDate
   }
   return [sort(entradas), sort(saidas), infoContrib];
}

export async function createEfdSheet(entradas: Analitico[], saidas: Analitico[], infoContrib: InfoContrib, link: HTMLAnchorElement) {
   const wb = getWb(entradas, saidas, infoContrib);
   const buffer = await wb.xlsx.writeBuffer();
   const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   link.href = URL.createObjectURL(file);
   link.download = 'IO.xlsx';
}

function getAnaliticoRegs(efd: string): [InfoContrib, Analitico[]] {
   const lines = efd.split('\r\n');
   const cadastro = lines.find(line => line.substring(1, 5) === '0000');
   if (!cadastro) throw new Error("Cadastro não encontrado");
   const [, , , , dtIni, dtFim, nome, , , , IE] = cadastro?.split('|');
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
   const infoContrib = {
      nome,
      IE,
      iniPerApur: new Date(+dtIni.substring(4, 10), +dtIni.substring(2, 4) - 1),
      fimPerApur: new Date(+dtFim.substring(4, 10), +dtFim.substring(2, 4) - 1),
   };
   return [infoContrib, regs];
}

function getAgregadoMap(analiticoMap: Record<string, Analitico[]>): Record<string, AnaliticoFull[]> {
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

// export async function getEfdRegistries(fileList: FileList): Promise<[Analitico[], Analitico[]]> {
//    const analiticoMap: Record<string, Analitico[]> = {};
//    const zip = new JSZip();
//    const len = fileList.length;
//    for (let i = 0; i < len; i++) {
//       const file = fileList[i];
//       if (file.type === 'text/plain') {
//          console.log('file.name', file.name)
//       } else if (file.type === 'application/x-zip-compressed') {
//          const buffer = await file.arrayBuffer();
//          const obj = await zip.loadAsync(buffer);
//          const efd = await Object.values(obj.files).at(-1)?.async('string');
//          if (!efd) throw new Error("Efd não encontrada");
//          const [_ini, analitico] = getAnaliticoRegs(efd);
//          const [mes, ano] = [_ini.substring(2, 4), _ini.substring(4, 8)];
//          const mesAno = `${mes}-${ano}`;
//          analiticoMap[mesAno] = analitico;
//       }
//    }
//    const arr = getAnaliticoAgregado(analiticoMap['03-2023']);
//    const [entradas, saidas] = partition(arr, c => +c.cfop < 4000);
//    return [sort(entradas), sort(saidas)]
// }