import type { AjDetalhe, ApOpPropria, InfoContrib } from "../types";
import { min, max, groupBy } from 'lodash'
import { getFileContent, getInfoContrib, getValidatedInfoContrib } from "./common";
import { pdf } from "@react-pdf/renderer";
import { Apuracao } from "../components/PDF/Apuracao";


export async function getEfdDetalheApuracao(fileList: FileList): Promise<[ApOpPropria, Record<number, AjDetalhe[]>, InfoContrib]> {
   const apOpProprias: ApOpPropria[] = [];
   const ajDetalhes: AjDetalhe[] = [];

   let razaoSocial: string | undefined = undefined;
   let inscEst: string | undefined = undefined;
   let cnpj: string | undefined = undefined;
   let minDate: Date | undefined = undefined;
   let maxDate: Date | undefined = undefined;

   for (const file of fileList) {
      // const file = fileList[i];
      const efds = await getFileContent(file);
      for (const efd of efds) {
         // const efd = await getFileContent(file);
         const lines = efd.split('\r\n');
         const { iniEscrit, fimEscrit, nome, IE, cnpj: _cnpj } = getInfoContrib(lines);
         razaoSocial ??= nome;
         inscEst ??= IE;
         cnpj ??= _cnpj;
         minDate = min([minDate, iniEscrit]);
         maxDate = max([maxDate, fimEscrit]);
         const [apOpPropria, ajDetalhes] = getApOpProprias(lines);
         apOpProprias.push(apOpPropria);
         ajDetalhes.push(...ajDetalhes);
      }
   }

   const infoContrib = getValidatedInfoContrib(razaoSocial, inscEst, minDate, maxDate, cnpj);
   const apOpPropriaAgregado = getApAgregado(apOpProprias)
   const tpAjMap = groupBy(ajDetalhes, ({ cod }) => cod.charAt(3));
   return [apOpPropriaAgregado, tpAjMap, infoContrib];
}

export async function getApPDF(infoContrib: InfoContrib, apuracao: ApOpPropria, tpAjMap: Record<number, AjDetalhe[]>, link: HTMLAnchorElement) {
   const blob = await pdf(Apuracao(infoContrib, apuracao, tpAjMap)).toBlob();
   link.href = URL.createObjectURL(blob);
   link.download = 'apuracao.pdf';
}

function getApOpProprias(lines: string[]): [ApOpPropria, AjDetalhe[]] {
   let apOpPropria: ApOpPropria | undefined = undefined;
   let iniPerApur: Date | undefined = undefined;
   let fimPerApur: Date | undefined = undefined;
   const ajDetalhes: AjDetalhe[] = [];

   for (const [index, line] of lines.entries()) {
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
      } else if (cod === 'E111') {
         for (let i = index; ; i++) {
            const line = lines[i];
            if (line.substring(1, 5) !== 'E111') break;
            const [, , cod, descr, val] = line.split('|');
            ajDetalhes.push({
               cod,
               descr,
               val: +val.replaceAll(',', '.')
            });
         }
         break;
      }
   }
   if (!apOpPropria) throw new Error("Campo E110 não informado");
   return [apOpPropria, ajDetalhes];
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
      iniPerApur: new Date(8640000000000000),
      fimPerApur: new Date(-8640000000000000),
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