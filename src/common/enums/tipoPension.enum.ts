
export enum tipo_pension {
  IVM = 'IVM',
  REGIMEN = 'REGIMEN',
}

export const TipoPensionDescripcion: Record<tipo_pension, string> = {
  [tipo_pension.IVM]: 'Invalidez, Vejez y Muerte',
  [tipo_pension.REGIMEN]: 'Régimen no contributivo',
};