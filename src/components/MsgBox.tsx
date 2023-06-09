import { type FC } from 'react'
import { useSnapshot } from 'valtio';
import { state } from '../store';

type Props = {}

export const MsgBox: FC<Props> = ({ }) => {

   const { msgs } = useSnapshot(state);

   return (
      <div className='min-h-[100px] px-3 py-2 w-full border border-gray-200 rounded-lg bg-white'>
         {msgs.map((msg, i) => <div className='text-sm' key={i}>{msg}</div>)}
      </div>
   )
}