

export enum tipo_unidad_medida {
  PRODUCTOS = 'PRODUCTOS',
  MEDICAMENTOS = 'MEDICAMENTOS',
  DOSIS = "DOSIS"
}

export const TipoUnidadMedidaOptions = [
  { id: 1, value: tipo_unidad_medida.PRODUCTOS, nombre: 'Productos' },
  { id: 2, value: tipo_unidad_medida.MEDICAMENTOS, nombre: 'Medicamentos' },
  { id: 3, value: tipo_unidad_medida.DOSIS, nombre: 'Dosis' },
];

export const getTipoUnidadMedidaById = (id: number): tipo_unidad_medida | null => {
  const option = TipoUnidadMedidaOptions.find(opt => opt.id === id);
  return option ? option.value : null;
};