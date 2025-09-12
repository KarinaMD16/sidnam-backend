export enum Estado_Proveedor{
    activo = 'activo',
    inactivo = 'inactivo'
}

export const EstadoProveedorOpts = [
    {id: 1, value: Estado_Proveedor.activo, nombre: 'Activo'},
    {id: 2, value: Estado_Proveedor.inactivo, nombre: 'Inactivo'}
]

export const getEstadoProveedor = (id: number): Estado_Proveedor | null => {
  const option = EstadoProveedorOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};  