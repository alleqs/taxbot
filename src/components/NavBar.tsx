import React, { FC } from 'react'

type Props = {}

export const NavBar: FC<Props> = ({ }) => {
   return (
      <div className='flex justify-center w-full'>
         <div className=' w-[720px] flex justify-between px-2 py-2'>
            {/* <ul className="flex justify-between px-2 py-1"> */}
            <a href="#" className="flex items-center">
               <img src="bot.png" className="h-8 mr-3" alt="Flowbite Logo" />
               <span className="self-center text-2xl font-semibold whitespace-nowrap text-slate-800">TaxBot</span>
            </a>
            {/* <li className="mr-6">
                  <a className="text-blue-500 hover:text-blue-800" href="#">TaxBot</a>
               </li> */}
            {/* <li className="mr-6">
                  <a className="text-blue-500 hover:text-blue-800" href="#">Link</a>
               </li> */}
            <div className="mr-6">
               <a className="text-gray-700 hover:text-blue-800" href="#">Documentação</a>
            </div>
            {/* <li className="mr-6">
                  <a className="text-gray-400 cursor-not-allowed" href="#">Disabled</a>
               </li> */}
            {/* </ul> */}
         </div>
      </div>
   );
};