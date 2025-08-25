export enum Bitacoras {
    Consulta_Especialista = 'Consulta_Especialista',
    Consulta_Ebais = 'Consulta_Ebais',
    Curacion = 'Curacion',
    Notas_Enfermeria = 'Notas_Enfermeria'
}

export const BitacorasOpts = [
  { id: 1, value: Bitacoras.Consulta_Especialista, nombre: 'Consultas Especialista' },
  { id: 2, value: Bitacoras.Consulta_Ebais, nombre: 'Consultas Ebais' },
  { id: 3, value: Bitacoras.Curacion, nombre: 'Curaciones' },
  { id: 4, value: Bitacoras.Notas_Enfermeria, nombre: 'Notas de Enfermería' }
];

export const getBitacoraById = (id: number): Bitacoras | null => {
  const option = BitacorasOpts.find(opt => opt.id === id);
  return option ? option.value : null;
};