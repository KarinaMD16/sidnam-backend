export enum Dependencia {
   Dependiente = 'Dependiente',
   Independiente = 'Independiente',
}

export const DependenciaOpts = [
  { id: 1, value: Dependencia.Dependiente, nombre: 'Dependiente' },
  { id: 2, value: Dependencia.Independiente, nombre: 'Independiente' },
];

export const getDependenciaById = (id: number): Dependencia | null => {
  const option = DependenciaOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};