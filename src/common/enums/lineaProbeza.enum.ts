
export enum linea_pobreza {
  pobreza_extrema = 'pobreza_extrema',
  pobreza_basica = 'pobreza_basica',
  vulnerables = 'vulnerables',
  no_pobreza = 'no_pobreza',
  sin_registro = 'sin_registro'
}

export const LineaPobrezaOPs = [
  { id: 1, value: linea_pobreza.pobreza_extrema, nombre: 'Pobreza extrema' },
  { id: 2, value: linea_pobreza.pobreza_basica, nombre: 'Pobreza básica' },
  { id: 3, value: linea_pobreza.vulnerables, nombre: 'Vulnerables' },
  { id: 4, value: linea_pobreza.no_pobreza, nombre: 'No pobreza' },
  { id: 5, value: linea_pobreza.sin_registro, nombre: 'Sin registro' },
];

export const getLineaPobreza = (id: number): linea_pobreza | null => {
  const option = LineaPobrezaOPs.find(opt => opt.id === id);
  return option ? option.value : null;
};