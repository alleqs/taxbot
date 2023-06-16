import React, { type FC } from 'react';

type Props = {
   image: string
   onChange: React.ChangeEventHandler<HTMLInputElement>
}

export const BigButton: FC<Props> = ({ image, onChange }) => {

   return (
      <label htmlFor={image} className="flex flex-col items-center justify-center px-6 h-36 border-2 border-gray-200 rounded-lg 
      cursor-pointer bg-white dark:hover:bg-bray-800 hover:bg-gray-50">
         <div className="flex flex-col items-center justify-center pt-5 pb-1">
            <img className='mb-3' width={100} height={100} src={image} alt='ícone NFe' />
            {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Clique</span> ou arraste</p> */}
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">apenas XML</p> */}
         </div>
         <input id={image} directory="" webkitdirectory="" type="file" className="hidden" multiple onChange={onChange} />
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