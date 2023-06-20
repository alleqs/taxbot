import { useState } from 'react';
import type { NfStats, NfStatus, NfFullReg } from '../types';
import { xmlToNfRegs } from '../helper/nf';

export function useNfRegs() {

   const [perc, setPerc] = useState(0)
   const fullRegs: NfFullReg[] = [];

   async function getNfRegistries(fileList: FileList): Promise<[NfFullReg[], NfStats]> {
      const len = fileList.length;
      const nfStats: NfStats = { emConting: 0, homolog: 0, semProtAut: 0, numNfs: 0 };
      for (let i = 0; i < len; i++) {
         const file = fileList[i];
         if (file.type !== 'text/xml') {
            continue;
         }
         nfStats.numNfs++;
         const [regs, nfStatus] = await xmlToNfRegs(file);
         updateStats(nfStatus, nfStats);
         fullRegs.push(...regs)
         setPerc(Math.round((i + 1) / len * 100));
      }
      return [fullRegs, nfStats]
      // return new Promise<[NfFullReg[], NfStats]>(async r => {
      //    for (let i = 0; i < len; i++) {
      //       const file = fileList[i];
      //       if (file.type !== 'text/xml') {
      //          continue;
      //       }
      //       nfStats.numNfs++;
      //       const [regs, nfStatus] = await xmlToNfRegs(file);
      //       updateStats(nfStatus, nfStats);
      //       fullRegs.push(...regs)
      //       setPerc(Math.round((i + 1) / len * 100));
      //    }
      //    r([fullRegs, nfStats]);
      // });
   }

   return { perc, getNfRegistries }
}

function updateStats({ emConting, homolog, semProtAut }: NfStatus, stats: NfStats) {
   if (emConting) stats.emConting++;
   if (homolog) stats.homolog++;
   if (semProtAut) stats.semProtAut++;
}
