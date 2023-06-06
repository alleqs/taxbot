import { useState } from 'react';
import type { NfStats, NfStatus, RegFull } from '../types';
import { nfeToItems } from '../helper/nf';

export function useSummary() {

   const [, setNumReads] = useState(0);
   const [perc, setPerc] = useState(0)
   const fullRegs: RegFull[] = [];

   async function getNfRegistries(fileList: FileList): Promise<[RegFull[], NfStats]> {
      const len = fileList.length;
      const nfStats: NfStats = { emConting: 0, homolog: 0, semProtAut: 0, numNfs: 0 };
      return new Promise<[RegFull[], NfStats]>(async r => {
         for (let i = 0; i < len; i++) {
            const file = fileList[i];
            if (file.type !== 'text/xml') {
               continue;
            }
            nfStats.numNfs++;
            const [regs, nfStatus] = await nfeToItems(file);
            updateStats(nfStatus, nfStats);
            fullRegs.push(...regs)
            setNumReads(i => i + 1);
            setPerc(Math.round((i + 1) / len * 100));
         }
         r([fullRegs, nfStats]);
      });
   }

   return { perc, getNfRegistries }
}

function updateStats({ emConting, homolog, semProtAut }: NfStatus, acc: NfStats) {
   if (emConting) acc.emConting++;
   if (homolog) acc.homolog++;
   if (semProtAut) acc.semProtAut++;
}
