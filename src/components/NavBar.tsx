import React, { FC } from 'react'

type Props = {}

export const NavBar: FC<Props> = ({ }) => {
   return (
      <ul className="flex justify-between px-2 py-1">
         <a href="https://flowbite.com/" className="flex items-center">
            <img src="logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-slate-800">TaxBot</span>
         </a>
         {/* <li className="mr-6">
            <a className="text-blue-500 hover:text-blue-800" href="#">TaxBot</a>
         </li> */}
         {/* <li className="mr-6">
            <a className="text-blue-500 hover:text-blue-800" href="#">Link</a>
         </li> */}
         <li className="mr-6">
            <a className="text-blue-500 hover:text-blue-800" href="#">Documentação</a>
         </li>
         {/* <li className="mr-6">
            <a className="text-gray-400 cursor-not-allowed" href="#">Disabled</a>
         </li> */}
      </ul>
   );
};