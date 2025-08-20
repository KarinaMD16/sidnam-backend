
export enum EstadoExpediente {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

export const EstadoExpedienteOptions = [
  { id: 1, value: EstadoExpediente.Activo, nombre: 'Activo' },
  { id: 2, value: EstadoExpediente.Inactivo, nombre: 'Inactivo' },
];