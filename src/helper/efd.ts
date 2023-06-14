import JSZip from "jszip";
import type { Analitico, AnaliticoFull, ApOpPropria, InfoContrib } from "../types";
import { groupBy, partition } from 'lodash';
import { getWb } from "../excel/efd";
import { min, max } from 'lodash'
import { readFile, uint8ArrayToString } from "./common";

const zip = new JSZip();

export async function getEfdRegistries(fileList: FileList): Promise<[Analitico[], Analitico[], InfoContrib, ApOpPropria]> {
   const analiticoMap: Record<string, Analitico[]> = {};
   const apOpProprias: ApOpPropria[] = [];

   const len = fileList.length;
   let razaoSocial: string | undefined = undefined;
   let inscEst: string | undefined = undefined;
   let minDate: Date | undefined = undefined;
   let maxDate: Date | undefined = undefined;
   for (let i = 0; i < len; i++) {
      const file = fileList[i];
      const efd = await getFileContent(file);
      const lines = efd.split('\r\n');
      const { iniPerApur, fimPerApur, nome, IE } = getInfoContrib(lines)
      const analitico = getAnaliticoRegs(lines);
      apOpProprias.push(getApOpProprias(lines));
      razaoSocial ??= nome;
      inscEst ??= IE;
      minDate = min([minDate, iniPerApur]);
      maxDate = max([maxDate, fimPerApur]);
      const anoMes = `${iniPerApur.getFullYear()}-${iniPerApur.getMonth() + 1}`;
      analiticoMap[anoMes] = analitico;
   }

   const ioAgregadoMap = getIOAgregadoMap(analiticoMap);
   const [entradas, saidas] = partition(Object.values(ioAgregadoMap).flat(), c => +c.cfop < 4000);
   if (!razaoSocial || !inscEst || !minDate || !maxDate) {
      throw new Error("Registros não encontrados");
   }
   const infoContrib: InfoContrib = {
      nome: razaoSocial,
      IE: inscEst,
      iniPerApur: minDate,
      fimPerApur: maxDate
   }
   const apOpPropriaAgregado = getApAgregado(apOpProprias)

   return [sort(entradas), sort(saidas), infoContrib, apOpPropriaAgregado];
}

async function getFileContent(file: File): Promise<string> {
   if (file.type === 'text/plain') {
      return readFile(file);
   } else if (file.type === 'application/x-zip-compressed') {
      const buffer = await file.arrayBuffer();
      const obj = await zip.loadAsync(buffer);
      const uint8Arr = await Object.values(obj.files).at(-1)?.async('uint8array');
      if (!uint8Arr) throw new Error("Efd não encontrada");
      const efd = uint8ArrayToString(uint8Arr);
      return efd;
   }
   throw new Error("formato de arquivo não reconhecido");
}

export async function createEfdSheet(entradas: Analitico[], saidas: Analitico[], infoContrib: InfoContrib, link: HTMLAnchorElement) {
   const wb = getWb(entradas, saidas, infoContrib);
   const buffer = await wb.xlsx.writeBuffer();
   const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   link.href = URL.createObjectURL(file);
   link.download = 'IO.xlsx';
}

function getInfoContrib(lines: string[]): InfoContrib {
   const cadastro = lines.find(line => line.substring(1, 5) === '0000');
   if (!cadastro) throw new Error("Cadastro não encontrado");
   const [, , , , dtIni, dtFim, nome, , , , IE] = cadastro?.split('|');
   return {
      nome,
      IE,
      iniPerApur: new Date(+dtIni.substring(4, 10), +dtIni.substring(2, 4) - 1),
      fimPerApur: new Date(+dtFim.substring(4, 10), +dtFim.substring(2, 4) - 1),
   };
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

function getApOpProprias(lines: string[]): ApOpPropria {
   let apOpPropria: ApOpPropria | undefined = undefined;
   let iniPerApur: Date | undefined = undefined;
   let fimPerApur: Date | undefined = undefined;

   for (const line of lines) {
      const cod = line.substring(1, 5);
      if (cod === 'E100') {
         const [, , dtIni, dtFim] = line.split('|');
         iniPerApur = new Date(+dtIni.substring(4, 10), +dtIni.substring(2, 4) - 1, +dtIni.substring(0, 2));
         fimPerApur = new Date(+dtFim.substring(4, 10), +dtFim.substring(2, 4) - 1, +dtFim.substring(0, 2));
      } else if (cod === 'E110') {
         if (!iniPerApur || !fimPerApur) throw new Error("Campo E100 não informado");
         const [, , saídas, ajDocFiscal, aj, estCred, credAq, ajCredDocFiscal, ajCred, estDeb,
            saldoAcc, saldoDev, deducoes, icmsARec, saldoCredorProxPer, recExtraAp] = line.split('|');
         apOpPropria = {
            iniPerApur, fimPerApur,
            saídas: +saídas.replaceAll(',', '.'), ajDocFiscal: +ajDocFiscal.replaceAll(',', '.'), aj: +aj.replaceAll(',', '.'), estCred: +estCred.replaceAll(',', '.'),
            credAq: +credAq.replaceAll(',', '.'), ajCredDocFiscal: +ajCredDocFiscal.replaceAll(',', '.'), ajCred: +ajCred.replaceAll(',', '.'), estDeb: +estDeb.replaceAll(',', '.'),
            saldoAcc: +saldoAcc.replaceAll(',', '.'), saldoDev: +saldoDev.replaceAll(',', '.'), deducoes: +deducoes.replaceAll(',', '.'), icmsARec: +icmsARec.replaceAll(',', '.'),
            saldoCredorProxPer: +saldoCredorProxPer.replaceAll(',', '.'), recExtraAp: +recExtraAp.replaceAll(',', '.')
         };
      }
   }
   if (!apOpPropria) throw new Error("Campo E110 não informado");
   return apOpPropria;
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

function getApAgregado(arr: ApOpPropria[]): ApOpPropria {
   return arr.reduce((acc, prox) => ({
      iniPerApur: prox.iniPerApur < acc.iniPerApur ? prox.iniPerApur : acc.iniPerApur,
      fimPerApur: prox.fimPerApur > acc.fimPerApur ? prox.fimPerApur : acc.fimPerApur,
      saídas: acc.saídas + prox.saídas,
      ajDocFiscal: acc.ajDocFiscal + prox.ajDocFiscal,
      aj: acc.aj + prox.aj,
      estCred: acc.estCred + prox.estCred,
      credAq: acc.credAq + prox.credAq,
      ajCredDocFiscal: acc.ajCredDocFiscal + prox.ajCredDocFiscal,
      ajCred: acc.ajCred + prox.ajCred,
      estDeb: acc.estDeb + prox.estDeb,
      saldoAcc: acc.saldoAcc + prox.saldoAcc,
      saldoDev: acc.saldoDev + prox.saldoDev,
      deducoes: acc.deducoes + prox.deducoes,
      icmsARec: acc.icmsARec + prox.icmsARec,
      saldoCredorProxPer: acc.saldoCredorProxPer + prox.saldoCredorProxPer,
      recExtraAp: acc.recExtraAp + prox.recExtraAp,
   }), {
      iniPerApur: new Date(9999),
      fimPerApur: new Date(-9999),
      saídas: 0,
      ajDocFiscal: 0,
      aj: 0,
      estCred: 0,
      credAq: 0,
      ajCredDocFiscal: 0,
      ajCred: 0,
      estDeb: 0,
      saldoAcc: 0,
      saldoDev: 0,
      deducoes: 0,
      icmsARec: 0,
      saldoCredorProxPer: 0,
      recExtraAp: 0,
   });
}
