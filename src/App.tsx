import { useRef, type FC, useState } from 'react';
import { BigButton } from './components/BigButton';
import { ProgressBar } from './components/ProgressBar';
import { useSummary } from './hooks/useSummary';
import { NavBar } from './components/NavBar';
import { MsgBox } from './components/MsgBox';
import { createNfSheet, formatNfStats } from './helper';


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
    console.log('opa')
    if (!fileList) return;
    const len = fileList.length;
    for (let i = 0; i < len; i++) {
      const file = fileList[i];
      if (file.type === 'text/plain') {

      } else if (file.type === 'application/x-zip-compressed') {

      }
    }
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


