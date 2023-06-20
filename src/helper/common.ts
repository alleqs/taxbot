import JSZip from "jszip";
import { InfoContrib } from "../types";
import { XMLParser } from 'fast-xml-parser';

export const parser = new XMLParser();
const zip = new JSZip();

export function formatDate(date: Date) {
   return date.toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', });
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
   return (typeof num === 'number' || typeof num === "string" && num.trim() !== '') && !isNaN(num as number);
};

export function readFile(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
         const { result } = fr;
         if (typeof result === 'string') {
            resolve(result)
         }
         reject("não foi possível ler o arquivo")
      };
      fr.readAsText(file);
   })
}

export function formatNumber(n: number) {
   return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export async function getFileContent(file: File): Promise<string> {
   if (file.type === 'text/plain') {
      return readFile(file);
   } else if (file.type === 'application/x-zip-compressed') {
      const buffer = await file.arrayBuffer();
      const obj = await zip.loadAsync(buffer);
      const uint8Arr = await Object.values(obj.files).at(-1)?.async('uint8array');
      if (!uint8Arr) throw new Error("Efd não encontrada");
      const efd = uint8ArrayToString(uint8Arr);
      return efd;
   }
   throw new Error("formato de arquivo não reconhecido");
}

export function getInfoContrib(lines: string[]): InfoContrib {
   const cadastro = lines.find(line => line.substring(1, 5) === '0000');
   if (!cadastro) throw new Error("Cadastro não encontrado");
   const [, , , , dtIni, dtFim, nome, cnpj, , , IE] = cadastro?.split('|');
   return {
      nome,
      cnpj,
      IE,
      iniEscrit: new Date(+dtIni.substring(4, 10), +dtIni.substring(2, 4) - 1),
      fimEscrit: new Date(+dtFim.substring(4, 10), +dtFim.substring(2, 4) - 1),
   };
}

export function getValidatedInfoContrib(razaoSocial: string | undefined, inscEst: string | undefined, minDate: Date | undefined, maxDate: Date | undefined, cnpj: string | undefined): InfoContrib {
   if (!razaoSocial || !inscEst || !minDate || !maxDate || !cnpj) {
      throw new Error("Registros não encontrados");
   }
   return {
      nome: razaoSocial,
      cnpj,
      IE: inscEst,
      iniEscrit: minDate,
      fimEscrit: maxDate
   };

}

