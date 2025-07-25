
export class ResponseReporteVoluntarioDto { 

    
    nombre: string;

 
    apellido: string;

    
    segundoApellido?: string;
     
    
    cedula: string;


    sexo: string;


    ocupacion: string;


    telefono: string;
    
    
    correo: string;


    direccion: string;


    descripcion: string;

    dia: string;

    horaInicio: string;

    horaFin: string;

    contactoEmergencia?: string;


    experiencia?: string;


    observaciones: string;

    estadoVoluntario?: string;

    tipoVoluntario?: {
        idTipoVoluntario: number;
        tipoVoluntario: string;
    };

}

