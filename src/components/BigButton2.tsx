import React, { type FC } from 'react';

type Props = {
   title: string
   subTitle?: string
   iconFrom: string
   iconTo: string
   onChange: React.ChangeEventHandler<HTMLInputElement>
}

export const BigButton2: FC<Props> = ({ title, subTitle, iconFrom, iconTo, onChange }) => {

   return (
      <label htmlFor={title} className="flex flex-col justify-between h-48 items-center px-6  bg-gray-50 fancy-border 
      cursor-pointer dark:hover:bg-bray-800 hover:bg-gray-100">
         <p className="text-6xl pt-5 font-['BakbakOne'] text-gray-500 dark:text-gray-400">{title}</p>
         {subTitle && <p className="text-lg -mt-6 text-gray-500 dark:text-gray-400">{subTitle}</p>}
         {/* <p>opa</p> */}
         <div className='flex space-x-3 pb-5'>
            {/* <img className='' width={48} height={48} src={'xml-icon-10.jpg'} alt='ícone NFe' /> */}
            <img className='' width={40} height={40} src={iconFrom} alt='ícone NFe' />
            <span className='text-4xl text-gray-500'>{'»'}</span>
            <img className='' width={48} height={48} src={iconTo} alt='ícone NFe' />
         </div>

         <input id={title} directory="" webkitdirectory="" type="file" className="hidden" multiple onChange={onChange} />
      </label>
   );
};

declare module 'react' {
   interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      // extends React's HTMLAttributes
      directory?: string;
      webkitdirectory?: string;
   }
}