import { useRef, type FC, useState } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { NavBar } from './components/NavBar';
import { MsgBox } from './components/MsgBox';
import { Loader } from './components/Loader';
import { useSummary } from './hooks/useSummary';
import { createNfSheet, formatNfStats } from './helper/nf';
import { createEfdSheet, getEfdRegistries } from './helper/efd-io';
import { BigButton2 } from './components/BigButton2';
import { getApPDF, getEfdDetalheApuracao } from './helper/efd-apuracao';


export const App: FC = () => {

  const [calculating, setCalculating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState<'planilha' | 'PDF' | undefined>(undefined);
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
    setFileType('planilha');
    formatNfStats(nfStats);
  }

  async function handleEfdIOChange(fileList: FileList | null) {
    const link = linkRef.current;
    if (!fileList || !link) return;
    setLoading(true);
    console.time("Time");
    const [entradas, saidas, infoContrib] = await getEfdRegistries(fileList)
    console.timeEnd("Time");
    // console.log(JSON.stringify(apOpPropria))
    await createEfdSheet(entradas, saidas, infoContrib, link);
    setLoading(false);
    setFileType('planilha');
  }

  async function handleEfdApChange(fileList: FileList | null) {
    const link = linkRef.current;
    if (!fileList || !link) return;
    setLoading(true);
    console.time("Time");
    const [apOpPropriaAgregado, tpAjMap, infoContrib] = await getEfdDetalheApuracao(fileList);
    console.timeEnd("Time");
    await getApPDF(infoContrib, apOpPropriaAgregado, tpAjMap, link);
    // console.log(JSON.stringify(apOpPropria))
    // await createEfdSheet(entradas, saidas, infoContrib, link);
    setLoading(false);
    setFileType('PDF');
  }

  return (
    <div className='bg-gray-100'>
      <NavBar />
      <h1 className="flex justify-center text-gray-600 text-4xl mt-20 font-['BakbakOne']">Conversor para formato<span className='font-semibold text-green-900'>&nbsp;Excel</span></h1>
      <div className='h-screen flex flex-col items-center space-y-8'>
        <div className='grid grid-cols-3 gap-10 mt-24'>
          <BigButton2 _key='NFe' title='NFe' iconFrom='xml.svg' iconTo='excel.png' onChange={e => handleNFChange(e.target.files)} />
          <BigButton2 _key='CTe' title='CTe' iconFrom='xml.svg' iconTo='excel.png' onChange={e => handleNFChange(e.target.files)} />
          <BigButton2 _key='EFD-io' title='EFD' subTitle='entrada/saída' iconFrom='txt4.png' iconTo='excel.png' onChange={e => handleEfdIOChange(e.target.files)} />
          <BigButton2 _key='EFD-ap' title='EFD' subTitle='apuração' iconFrom='txt4.png' iconTo='pdf.svg' onChange={e => handleEfdApChange(e.target.files)} />
        </div>
        <div className='space-y-4 '>
          {/* <div className='h-40 w-96 border border-gray-300 rounded-lg bg-white'>
          </div> */}
          <MsgBox />
          <a ref={linkRef} href="#" onClick={() => setFileType(undefined)}
            className={`w-40 ${fileType ? 'visible animate-fade' : 'invisible'} flex text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 focus:ring-4 
            font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 focus:outline-none`}>
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span className='pl-2'>{`Baixar ${fileType}`}</span>
          </a>
        </div>
      </div>
      <ProgressBar perc={perc} loading={calculating} />
      <Loader loading={loading} />
    </div>
  );
};
