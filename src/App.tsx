import React, { useRef, type FC, useState } from 'react';
// import { readNFes2, readNFes3 } from './helper';
// import { Loader } from './components/Loader';
import { BigButton } from './components/BigButton';
import { ProgressBar } from './components/ProgressBar';
import { useSummary } from './hooks/useSummary';
import { NavBar } from './components/NavBar';
import { getWb } from './excel';
import { MsgBox } from './components/MsgBox';
import type { NfStats } from './types';
import { state } from './store';
// import Excel from 'exceljs';



export const App: FC = () => {
  const [loading, setLoading] = useState(false);
  const [sumarioPronto, setSumarioPronto] = useState(false);
  const { perc, getRegistries } = useSummary();
  const linkRef = useRef<HTMLAnchorElement>(null);
  // console.log('sumarioPronto', sumarioPronto);

  async function handleChange(fileList: FileList | null) {
    const link = linkRef.current;
    if (!fileList || !link) return;
    // console.log('fileList', fileList)
    setLoading(true);
    console.time("Time");
    // const acc = await readNFes2(fileList);
    const [regs, nfStats] = await getRegistries(fileList);
    console.timeEnd("Time");
    // console.log('acc', acc);
    const wb = getWb(regs);
    const buffer = await wb.xlsx.writeBuffer();
    // const file = new Blob([JSON.stringify(acc)], { type: 'application/json' });
    const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    link.href = URL.createObjectURL(file);
    link.download = 'NFe-itens.xlsx';
    setLoading(false);
    setSumarioPronto(true);
    formatStats(nfStats);
    // state.msgs.push("opa");
    // state.msgs.push("blz?");
    // state.msgs.push("certo");
  }


  return (
    <div className='bg-gray-100'>
      <NavBar />
      <div className='h-screen flex flex-col justify-center items-center space-y-8'>
        <div className='flex space-x-10'>
          <BigButton image='nfe.png' onChange={e => handleChange(e.target.files)} />
          <BigButton image='cte.png' onChange={e => handleChange(e.target.files)} />
        </div>
        <div className='space-y-4'>
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

function formatStats({ numNfs, emConting, homolog, semProtAut }: NfStats) {
  const msgs = [
    `Total de notas fiscais: ${numNfs}`,
    `Notas fiscais emitidas em contingência: ${emConting}`,
    `Notas fiscais emitidas em ambiente de homologação: ${homolog}`,
    `Notas fiscais omitindo protocolo de autorização: ${semProtAut}`
  ];
  state.msgs = msgs;
}


