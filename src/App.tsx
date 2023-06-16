import { useRef, type FC, useState } from 'react';
import { BigButton } from './components/BigButton';
import { ProgressBar } from './components/ProgressBar';
import { NavBar } from './components/NavBar';
import { MsgBox } from './components/MsgBox';
import { Loader } from './components/Loader';
import { useSummary } from './hooks/useSummary';
import { createNfSheet, formatNfStats } from './helper/nf';
import { createEfdSheet, getEfdRegistries } from './helper/efd';
import { BigButton2 } from './components/BigButton2';


export const App: FC = () => {
  const [calculating, setCalculating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sumarioPronto, setSumarioPronto] = useState(false);
  const { perc, getNfRegistries } = useSummary();
  const linkRef = useRef<HTMLAnchorElement>(null);

  async function handleNFChange(fileList: FileList | null) {
    const link = linkRef.current;
    if (!fileList || !link) return;
    setCalculating(true);
    console.time("Time");
    const [regs, nfStats] = await getNfRegistries(fileList);
    console.timeEnd("Time");
    await createNfSheet(regs, link);
    setCalculating(false);
    setSumarioPronto(true);
    formatNfStats(nfStats);
  }

  async function handleEfdChange(fileList: FileList | null) {
    const link = linkRef.current;
    if (!fileList || !link) return;
    setLoading(true);
    console.time("Time");
    const [entradas, saidas, infoContrib, apOpPropria] = await getEfdRegistries(fileList)
    console.timeEnd("Time");
    console.log(JSON.stringify(apOpPropria))
    await createEfdSheet(entradas, saidas, infoContrib, link);
    setLoading(false);
    setSumarioPronto(true);
  }


  return (
    <div className='bg-gray-100'>
      <NavBar />
      <h1 className="flex justify-center text-gray-600 text-4xl mt-20 font-['BakbakOne']">Conversor para formato<span className='font-semibold text-green-900'>&nbsp;Excel</span></h1>
      <div className='h-screen flex flex-col items-center space-y-8'>
        <div className='grid grid-cols-3 gap-10 mt-24'>
          <BigButton2 title='NFe' iconFrom='xml.svg' iconTo='excel.png' onChange={e => handleNFChange(e.target.files)} />
          <BigButton2 title='CTe' iconFrom='xml.svg' iconTo='excel.png' onChange={e => handleNFChange(e.target.files)} />
          <BigButton2 title='EFD' subTitle='entrada/saída' iconFrom='txt4.png' iconTo='excel.png' onChange={e => handleEfdChange(e.target.files)} />
          <BigButton2 title='EFD' subTitle='apuração' iconFrom='txt4.png' iconTo='pdf.svg' onChange={e => handleEfdChange(e.target.files)} />
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
      </div>
      <ProgressBar perc={perc} loading={calculating} />
      <Loader loading={loading} />
    </div>
  );
};
