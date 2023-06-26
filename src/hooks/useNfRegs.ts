import { useState } from 'react';
import type { NfStats, NfStatus, NfFullReg } from '../types';
import { xmlToNfRegs } from '../helper/nf';
import { max } from 'lodash';

export function useNfRegs() {

   const [perc, setPerc] = useState(0);
   const fullRegs: NfFullReg[] = [];

   async function getNfRegistries(fileList: FileList): Promise<[NfFullReg[], NfStats]> {
      const txtLen = fileList.length;
      console.log('len', txtLen);
      const nfStats: NfStats = { emConting: 0, homolog: 0, semProtAut: 0, numNfs: 0 };
      let accObjLength = 0;
      // for (let i = 0; i < len; i++) {
      //    const file = fileList[i];
      //    if (!file) continue;
      //    const [regs, nfStats] = await xmlToNfRegs(file);
      //    // nfStats.numNfs++;
      //    // updateStats(nfStatus, nfStats);
      //    fullRegs.push(...regs)
      //    setPerc(Math.round((i + 1) / len * 100));
      // }
      // return [fullRegs, nfStats]
      return new Promise<[NfFullReg[], NfStats]>(async r => {
         // let acc = 0;
         // const filesLength = fileList.length;
         let i = 0;
         for (const file of fileList) {
            console.log('i', i++)
            // const file = fileList[i];
            // if (!file) continue;
            // for await (const [regs, nfStats, zippedLen] of xmlToNfRegs(file)) {
            //    fullRegs.push(...regs)
            //    const len = max([1, zippedLen]) ?? 1;
            //    setPerc(Math.round(acc + ++i / (len * filesLength) * 100));
            // }
            console.time("Time2");

            const [regs, newAccObjLength] = await xmlToNfRegs(file, accObjLength);
            console.timeEnd("Time2");
            accObjLength = newAccObjLength;
            nfStats.numNfs++;
            // updateStats(nfStatus, nfStats);
            fullRegs.push(...regs)
            // setPerc(Math.round((i + 1) / len * 100));
            // acc += 100 / filesLength;
         }
         r([fullRegs, nfStats]);
      });
   }
   return { perc, getNfRegistries };
}