import { useState } from 'react';
import type { CTeReg } from '../types';
import { xmlToCtRegs } from '../helper/ct';

export function useCtRegs() {

   const [perc, setPerc] = useState(0)
   const regs: CTeReg[] = [];

   async function getCtRegistries(fileList: FileList): Promise<CTeReg[]> {
      const len = fileList.length;
      // const nfStats: NfStats = { emConting: 0, homolog: 0, semProtAut: 0, numNfs: 0 };
      return new Promise<CTeReg[]>(async r => {
         for (let i = 0; i < len; i++) {
            const file = fileList[i];
            if (!file || file.type !== 'text/xml') {
               continue;
            }
            // nfStats.numNfs++;
            const reg = await xmlToCtRegs(file);
            // updateStats(nfStatus, nfStats);
            regs.push(reg);
            setPerc(Math.round((i + 1) / len * 100));
         }
         r(regs);
      });
   }

   return { perc, getCtRegistries }
}

