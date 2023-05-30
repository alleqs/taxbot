import { type FC } from 'react'

type Props = { perc: number, loading: boolean }

export const ProgressBar: FC<Props> = ({ perc, loading }) => {

   if (!loading) return null;

   return (
      <div className='z-10 fixed left-0 top-0 w-full h-screen overflow-auto bg-opacity-20 bg-black flex flex-col justify-center'>
         <div className="w-1/6 mx-auto bg-gray-200 rounded-full dark:bg-gray-700">
            {/* <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${perc}%` }}></div> */}
            <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${perc}%` }}>
               <span className={`${perc > 14 ? 'visible' : 'invisible'}`}>{`${perc}%`}</span>
            </div>
         </div>
      </div>
   );
};