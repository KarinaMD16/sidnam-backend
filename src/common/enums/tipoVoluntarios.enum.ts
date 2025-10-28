export enum TipoVoluntario {
  Horas = 'Horas',
  Normal = 'Normal',
}

export const TipoVoluntariadoOpts = [
  { id: 1, value: TipoVoluntario.Horas, nombre: 'Horas' },
  { id: 2, value: TipoVoluntario.Normal, nombre: 'Normal' },
];

export const getTiposVoluntario = (id: number): TipoVoluntario | null => {
  const option = TipoVoluntariadoOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};