
export enum CategoriasPrincipalesProductos {
  ALIMENTOS = "Alimentos",
  LIMPIEZA = "Limpieza",
  MEDICAMENTOS = "Medicamentos",
}

export const CategoriasOptions = [
  { id: 1, value: CategoriasPrincipalesProductos.ALIMENTOS, nombre: 'Alimentos' },
  { id: 2, value: CategoriasPrincipalesProductos.LIMPIEZA, nombre: 'Limpieza' },
  { id: 3, value: CategoriasPrincipalesProductos.MEDICAMENTOS, nombre: 'Medicamentos' },
];

export const getCategoriasId = (id: number): CategoriasPrincipalesProductos | null => {
  const option = CategoriasOptions.find(opt => opt.id === id);
  return option ? option.value : null;
};
