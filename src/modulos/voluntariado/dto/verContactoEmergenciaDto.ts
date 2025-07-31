
import { Expose } from 'class-transformer';

export class ContactoEmergenciaDto {

  @Expose()
  id: number
  
  @Expose()
  nombre: string;

  @Expose()
  telefono: string;

}
