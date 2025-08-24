

export enum tipo_pension {
  IVM = 'IVM',
  REGIMEN = 'REGIMEN',
}

export const TipoPensionOptions = [
  { id: 1, value: tipo_pension.IVM, nombre: 'IVM' },
  { id: 2, value: tipo_pension.REGIMEN, nombre: 'RNC' },
];

export const getTipoPensionById = (id: number): tipo_pension | null => {
  const option = TipoPensionOptions.find(opt => opt.id === id);
  return option ? option.value : null;
};