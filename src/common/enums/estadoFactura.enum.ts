export enum Estado_Factura {
    pagada = 'pagada',
    pendiente = 'pendiente',
}

export const FacturaOpts = [
  { id: 1, value: Estado_Factura.pagada, nombre: 'Pagada' },
  { id: 2, value: Estado_Factura.pendiente, nombre: 'Pendiente' },
];

export const getEstadoFactura = (id: number): Estado_Factura | null => {
  const option = FacturaOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};