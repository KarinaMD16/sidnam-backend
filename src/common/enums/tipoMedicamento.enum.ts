
export enum tipo_medicamento {
  ANTIBIOTICO = 'ANTIBIOTICO',
  NOANTIBIOTICO = 'NOANTIBIOTICO',
}

export const TipoMedicamentoOpts = [
  { id: 1, value: tipo_medicamento.ANTIBIOTICO, nombre: 'Antibiótico' },
  { id: 2, value: tipo_medicamento.NOANTIBIOTICO, nombre: 'No Antibiótico' },
];

export const getTiposMedicamentos = (id: number): tipo_medicamento | null => {
  const option = TipoMedicamentoOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};