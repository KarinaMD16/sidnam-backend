
export enum EstadoExpediente {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

export const EstadoExpedienteOptions = [
  { id: 1, value: EstadoExpediente.Activo, nombre: 'Activo' },
  { id: 2, value: EstadoExpediente.Inactivo, nombre: 'Inactivo' },
];

export const getEstadoExpedientesById = (id: number): EstadoExpediente | null => {
  const option = EstadoExpedienteOptions.find(opt => opt.id === id);
  return option ? option.value : null;
};