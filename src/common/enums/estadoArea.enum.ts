export enum Estado_Area{
    activo = 'activo',
    inactivo = 'inactivo'
}

export const EstadoAreaOpts = [
    {id: 1, value: Estado_Area.activo, nombre: 'Activo'},
    {id: 2, value: Estado_Area.inactivo, nombre: 'Inactivo'}
]

export const getEstadoArea = (id: number): Estado_Area | null => {
  const option = EstadoAreaOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};  