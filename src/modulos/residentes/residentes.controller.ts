import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResidentesService } from './residentes.service';
import { CreateExpedienteCompletoDto } from './dto/createExpedienteResidenteDto';

@Controller('residentes')
export class ResidentesController {

    constructor( private readonly residentesService: ResidentesService){}


   @Post('expediente')
   async createExpediente(@Body() createExpediente: CreateExpedienteCompletoDto) {
       return this.residentesService.createExpediente(createExpediente);
   }

   @Get('tipos-pension')
   async getTiposPension() {
       return this.residentesService.getTiposPension();
   }

   @Get('dependencia')
   async getDependencia() {
       return this.residentesService.getDependencia();
   }

   @Get('estado-civil')
   async getEstadoCivil() {
       return this.residentesService.getEstadoCivil();
   }

}
