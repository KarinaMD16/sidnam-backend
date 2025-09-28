import { Exclude } from "class-transformer";

export enum Acciones {
  VER = 'VER',
  CREAR = 'CREAR',
  ACTUALIZAR = 'ACTUALIZAR',
  ELIMINAR = 'ELIMINAR',
}

export const PermisosOpts = [
  { id: 1, value: Acciones.VER, accion: 'Ver' },
  { id: 2, value: Acciones.CREAR, accion: 'Crear' },
  { id: 3, value: Acciones.ACTUALIZAR, accion: 'Actualizar' },
  { id: 4, value: Acciones.ELIMINAR, accion: 'Eliminar' },
];

export enum Modulos{
  RESIDENTES = 'RESIDENTES',
  VOLUNTARIADO = 'VOLUNTARIADO',
  PROVEDURIAGENERAL = 'PROVEDURIAGENERAL',
  PROVEDURIAFACTURAS = 'PROVEDURIAFACTURAS',
  DONACIONES = 'DONACIONES',
  INFORMATIVA = 'INFORMATIVA',
  INVENTARIADO = 'INVENTARIADO',
}


export enum Secciones{

  GENERALEXPEDIENTES = 'GENERALEXPEDIENTES',
  ENFERMERIA = 'ENFERMERIA',
  TRABAJOSOCIAL = 'TRABAJOSOCIAL',
  ALIMENTOS = 'ALIMENTOS',
  MEDICAMENTOS = 'MEDICAMENTOS',
  LIMPIEZA = 'LIMPIEZA',  
  SOLICITUDDONACIONES = 'SOLICITUDDONACIONES',
  GESTIONDONACIONES = 'GESTIONDONACIONES',
  SOLICITUDESVOLUNARIADO = 'SOLICITUDESVOLUNTARIADO',
  GESTIONVOLUNTARIADO = 'GESTIONVOLUNTARIADO',
  PROVEDURIAGENERAL = 'PROVEDURIAGENERAL',
  PROVEDURIAFACTURAS = 'PROVEDURIAFACTURAS',
  PROYECTOS = 'PROYECTOS',
  EVENTOS = 'EVENTOS',
  GALERIA = 'GALERIA',
}

export const ModulosOpts = [
  { id: 1, value: Modulos.RESIDENTES, modulo: 'Residencia', value2: Secciones.GENERALEXPEDIENTES, seccion: 'General Expedientes' },
  { id: 2, value: Modulos.RESIDENTES, modulo: 'Residencia', value2: Secciones.TRABAJOSOCIAL, seccion: 'Trabajo Social' },
  { id: 3, value: Modulos.RESIDENTES, modulo: 'Residencia', value2: Secciones.ENFERMERIA, seccion: 'Enfermería' },
  { id: 4, value: Modulos.PROVEDURIAGENERAL, modulo: 'Proveduría', value2: Secciones.PROVEDURIAGENERAL, seccion: 'General Proveduría' },
  { id: 5, value: Modulos.PROVEDURIAFACTURAS, modulo: 'Proveduría', value2: Secciones.PROVEDURIAFACTURAS, seccion: 'Facturas Proveduría' },
  { id: 6, value: Modulos.INVENTARIADO, modulo: 'Inventariado', value2: Secciones.ALIMENTOS, seccion: 'Alimentos' },
  { id: 7, value: Modulos.INVENTARIADO, modulo: 'Inventariado', value2: Secciones.MEDICAMENTOS, seccion: 'Medicamentos' },
  { id: 8, value: Modulos.INVENTARIADO, modulo: 'Inventariado', value2: Secciones.LIMPIEZA, seccion: 'Limpieza' },
  { id: 9, value: Modulos.DONACIONES, modulo: 'Donaciones', value2: Secciones.GESTIONDONACIONES, seccion: 'Gestión Donaciones' },
  { id: 10, value: Modulos.DONACIONES, modulo: 'Donaciones', value2: Secciones.SOLICITUDDONACIONES, seccion: 'Solicitud Donaciones' },
  { id: 11, value: Modulos.VOLUNTARIADO, modulo: 'Voluntariado', value2: Secciones.GESTIONVOLUNTARIADO, seccion: 'Gestión Voluntariado' },
  { id: 12, value: Modulos.VOLUNTARIADO, modulo: 'Voluntariado', value2: Secciones.SOLICITUDESVOLUNARIADO, seccion: 'Solicitudes Voluntariado'},
  { id: 13, value: Modulos.INFORMATIVA, modulo: 'Informativa', value2: Secciones.EVENTOS, seccion: 'Eventos'},
  { id: 14, value: Modulos.INFORMATIVA, modulo: 'Informativa', value2: Secciones.GALERIA, seccion: 'Galeria'},
  { id: 15, value: Modulos.INFORMATIVA, modulo: 'Informativa', value2: Secciones.PROYECTOS, seccion: 'Proyectos'},
];


export const SeccionesOpts = [
  { id: 1, value: Secciones.GENERALEXPEDIENTES, modulo: 'General Expedientes' },
  { id: 2, value: Secciones.ENFERMERIA, modulo: 'Enfermería' },
  { id: 3, value: Secciones.TRABAJOSOCIAL, modulo: 'Trabajo Social' },
  { id: 4, value: Secciones.ALIMENTOS, modulo: 'Alimentos' },
  { id: 5, value: Secciones.MEDICAMENTOS, modulo: 'Medicamentos' },
  { id: 6, value: Secciones.LIMPIEZA, modulo: 'Limpieza' },
  { id: 7, value: Secciones.SOLICITUDDONACIONES, modulo: 'Solicitud Donaciones' },
  { id: 8, value: Secciones.GESTIONDONACIONES, modulo: 'Gestión Donaciones' },
  { id: 9, value: Secciones.SOLICITUDESVOLUNARIADO, modulo: 'Solicitudes Voluntariado' },
  { id: 10, value: Secciones.GESTIONVOLUNTARIADO, modulo: 'Gestión Voluntariado' },
  { id: 11, value: Secciones.EVENTOS, modulo: 'Informativa' },
  { id: 11, value: Secciones.GALERIA, modulo: 'Informativa' },
];





export enum Sexo {
    M = 'M',
    F = 'F',
}
