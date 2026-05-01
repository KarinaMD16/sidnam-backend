

export enum estado_civil {
   Casado = 'Casado',
   Soltero = 'Soltero',
   Viudo = 'Viudo',
}

export const EstadoCivilOptios = [
  { id: 1, value: estado_civil.Casado, nombre: 'Casado' },
  { id: 2, value: estado_civil.Soltero, nombre: 'Soltero' },
  { id: 3, value: estado_civil.Viudo, nombre: 'Viudo' },
];

export const getEstadoCivilById = (id: number): estado_civil | null => {
  const option = EstadoCivilOptios .find(opt => opt.id === id);
  return option ? option.value : null;
};