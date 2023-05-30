import { type FC } from 'react'
import { useSnapshot } from 'valtio';
import { state } from '../store';

type Props = {}

export const MsgBox: FC<Props> = ({ }) => {

   const { msgs } = useSnapshot(state);

   return (
      <div className='h-40 px-2 py-2 w-[32rem] border border-gray-300 rounded-lg bg-white'>
         {msgs.map((msg, i) => <div className='text-sm' key={i}>{msg}</div>)}
      </div>
   )
}