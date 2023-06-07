
export function formatDate(date: Date) {
   return `${String(1 + date.getMonth()).padStart(2, '0')}/${date.getFullYear()}`;
}

export function formatIE(_IE: string | number | undefined) {
   if (!_IE) return '';
   if (isNumeric(_IE)) {
      const IE = `${String(_IE).padStart(9, '0')}`;
      return `${IE.substring(0, 2)}.${IE.substring(2, 5)}.${IE.substring(5, 8)}-${IE.substring(8, 9)}`;
   }
   return _IE;
}
export function formatCNPJ(_cnpj: string | number | undefined) {
   if (!_cnpj) return '';
   const cnpj = `${String(_cnpj).padStart(14, '0')}`
   return `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12, 14)}`;
}

export function formatCPF(_cpf: string | number | undefined) {
   if (!_cpf) return '';
   const cpf = `${String(_cpf).padStart(11, '0')}`
   return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
}

export function uint8ArrayToString(uint8Arr: Uint8Array) {
   return [...uint8Arr].map(c => String.fromCharCode(c)).join('');
}

function isNumeric(num: any) {
   return (typeof (num) === 'number' || typeof (num) === "string" && num.trim() !== '') && !isNaN(num as number);
};

