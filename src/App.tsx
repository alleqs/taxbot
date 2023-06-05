import { useRef, type FC, useState } from 'react';
import { BigButton } from './components/BigButton';
import { ProgressBar } from './components/ProgressBar';
import { useSummary } from './hooks/useSummary';
import { NavBar } from './components/NavBar';
import { MsgBox } from './components/MsgBox';
import { createNfSheet, formatNfStats } from './helper';
import JSZip from "jszip";
import { Analitico } from './types';
import { groupBy } from 'lodash';

export const App: FC = () => {
  const [loading, setLoading] = useState(false);
  const [sumarioPronto, setSumarioPronto] = useState(false);
  const { perc, getNfRegistries } = useSummary();
  const linkRef = useRef<HTMLAnchorElement>(null);
  // console.log('sumarioPronto', sumarioPronto);

  async function handleChange(fileList: FileList | null) {
    const link = linkRef.current;
    if (!fileList || !link) return;
    setLoading(true);
    console.time("Time");
    const [regs, nfStats] = await getNfRegistries(fileList);
    console.timeEnd("Time");
    await createNfSheet(regs, link)
    setLoading(false);
    setSumarioPronto(true);
    formatNfStats(nfStats);
  }

  async function handleChange2(fileList: FileList | null) {
    // console.log('opa')
    if (!fileList) return;
    const analiticoMap: Record<string, Analitico[]> = {};
    const zip = new JSZip();
    const len = fileList.length;
    for (let i = 0; i < len; i++) {
      const file = fileList[i];
      if (file.type === 'text/plain') {
        console.log('file.name', file.name)
      } else if (file.type === 'application/x-zip-compressed') {
        const buffer = await file.arrayBuffer();
        const obj = await zip.loadAsync(buffer);
        const efd = await Object.values(obj.files).at(-1)?.async('string');
        if (!efd) return;
        const [_ini, analitico] = getAnaliticoRegs(efd);
        const ini = `${_ini.substring(0, 2)}-${_ini.substring(2, 4)}-${_ini.substring(4, 8)}`
        analiticoMap[ini] = analitico;
      }
    }
    const a = getAnaliticoArr(analiticoMap['01-03-2023'])
    console.log('analiticoMap', a)
  }


  return (
    <div className='bg-gray-100'>
      <NavBar />
      <div className='h-screen flex flex-col justify-center items-center space-y-8'>
        <div className='flex space-x-10'>
          <BigButton image='nfe.png' onChange={e => handleChange(e.target.files)} />
          <BigButton image='cte.png' onChange={e => handleChange(e.target.files)} />
          <BigButton image='sped.png' onChange={e => handleChange2(e.target.files)} />
        </div>
        <div className='space-y-4 '>
          {/* <div className='h-40 w-96 border border-gray-300 rounded-lg bg-white'>
          </div> */}
          <MsgBox />
          <a ref={linkRef} href="" onClick={() => setSumarioPronto(false)} className={`w-40 ${sumarioPronto ? 'visible animate-fade' : 'invisible'} flex text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 focus:outline-none`}>
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span className='pl-2'>Baixar planilha</span>
          </a>
        </div>
        {/* <Loader loading={loading} /> */}
        <ProgressBar perc={perc} loading={loading} />
      </div>
    </div>
  );
};

function getAnaliticoRegs(efd: string): [string, Analitico[]] {
  const lines = efd.split('\r\n');
  const ini = lines.find(line => line.substring(1, 5) === '0000')?.substring(12, 20);
  if (!ini) {
    throw new Error('código 0000 não encontrado')
  }
  const arr: Analitico[] = [];
  for (const line of lines) {
    const cod = line.substring(1, 5);
    if (cod === 'C190') {
      const [, , cst, cfop, _aliq, _valOper, _bc, _icms, _bcIcmsST, _icmsST, _redBc, ,] = line.split('|');
      const analitico: Analitico = {
        cst, cfop, aliq: +_aliq.replaceAll(',', '.'), valOper: +_valOper.replaceAll(',', '.'), bc: +_bc.replaceAll(',', '.'), icms: +_icms.replaceAll(',', '.'),
        bcST: +_bcIcmsST.replaceAll(',', '.'), sT: +_icmsST.replaceAll(',', '.'), redBc: +_redBc.replaceAll(',', '.')
      };
      arr.push(analitico);
    }
  }
  return [ini, arr];
}

function getAnaliticoArr(analiticoRegs: Analitico[]): Analitico[] {
  const obj = groupBy(analiticoRegs, ({ cst, cfop, aliq }) => `${cst}-${cfop}-${aliq}`);
  let bcAcc = 0, icmsAcc = 0, bcSTAcc = 0, stAcc = 0, redBcAcc = 0, valOperAcc = 0;
  return Object.entries(obj).map(([key, analiticoArr]) => {
    analiticoArr.forEach(({ bc, icms, bcST, sT, redBc, valOper }) => {
      bcAcc += bc;
      icmsAcc += icms;
      bcAcc += bc;
      bcSTAcc += bcST;
      stAcc += sT;
      redBcAcc += redBc;
      valOperAcc += valOper;
    });
    const [cst, cfop, _aliq] = key.split('-');
    const analitico: Analitico = { cst, cfop, aliq: +_aliq, bc: bcAcc, bcST: bcSTAcc, icms: icmsAcc, sT: stAcc, redBc: redBcAcc, valOper: valOperAcc };
    return analitico;
  });
}
