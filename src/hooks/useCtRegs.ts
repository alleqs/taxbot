import { useState } from 'react';
import type { CTeReg } from '../types';
import { xmlToCtRegs } from '../helper/ct';

export function useCtRegs() {

   const [perc, setPerc] = useState(0)
   const regs: CTeReg[] = [];

   async function getCtRegistries(fileList: FileList): Promise<CTeReg[]> {
      // const txtLen = fileList.length;
      // console.log('len', txtLen);
      // let accObjLength = 0;
      // const nfStats: NfStats = { emConting: 0, homolog: 0, semProtAut: 0, numNfs: 0 };
      // return new Promise<CTeReg[]>(async r => {
      for (const file of fileList) {
         // const file = fileList[i];
         // if (!file) continue;

         // nfStats.numNfs++;
         console.time("Time2");
         const monthRegs = await xmlToCtRegs(file);
         console.timeEnd("Time2");
         // accObjLength = newAccObjLength;
         // updateStats(nfStatus, nfStats);
         regs.push(...monthRegs);
         // setPerc(Math.round((i + 1) / len * 100));
      }
      return regs;
      // });
   }

   return { perc, getCtRegistries }
}

