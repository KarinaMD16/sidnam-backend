export enum Turno {
   AM='AM', PM='PM', MD='MD', MN='MN'
}

export const TurnoOpts = [
  { id: 1, value: Turno.AM, nombre: 'AM' },
  { id: 2, value: Turno.PM, nombre: 'PM' },
  { id: 3, value: Turno.MD, nombre: 'MD' },
  { id: 4, value: Turno.MN, nombre: 'MN' },
];

export const getTurnoById = (id: number): Turno | null => {
  const option = TurnoOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};