export const modalMap: Record<number, string> = {
   1: 'Rodoviário',
   2: 'Aéreo',
   3: 'Aquaviário',
   4: 'Ferroviário',
   5: 'Dutoviário',
   6: 'Multimodal',
};

export const tomadorMap: Record<number, string> = {
   0: 'Remetente',
   1: 'Expedidor',
   2: 'Recebedor',
   3: 'Destinatário',
   4: 'Outros'
};

export const tpCTeMap: Record<number, string> = {
   0: 'Normal',
   1: 'Complemento',
   2: 'Substituição', //manual não tem chave '2'
   3: 'Substituição',
};