
export enum tipo_pension {
  IVM = 'IVM',
  REGIMEN = 'REGIMEN',
}

export const TipoPensionOptions = [
  { id: 1, value: tipo_pension.IVM, nombre: 'Invalidez, Vejez y Muerte' },
  { id: 2, value: tipo_pension.REGIMEN, nombre: 'Régimen no contributivo' },
];