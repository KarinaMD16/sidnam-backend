
export enum Estado_Usuario {
   activo = 'activo',
   inactivo = 'inactivo',
}

export const EstadoUsuarioOpts = [
  { id: 1, value: Estado_Usuario.activo, nombre: 'Activo' },
  { id: 2, value: Estado_Usuario.inactivo, nombre: 'Inactivo' },
];

export const getEstadoUsuarioById = (id: number): Estado_Usuario | null => {
  const option = EstadoUsuarioOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};