import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
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

   @Get('expedientes/preview')
       getPreviewExpedientes(
           @Query('page', new ParseIntPipe({ optional: true })) page?: number,
           @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
       ){
           if (page && limit) {
               return this.residentesService.findAllPreviewsExpedientes(page, limit);
           }
           return this.residentesService.findAllPreviewsExpedientes();
   }

   @Get('expedientes/:id')
   async getExpedienteById(@Param('id', ParseIntPipe) id: number) {
        return this.residentesService.findExpedienteById(id);
   }

   @Get('expedientes/residente/:cedula')
   async getExpedienteByCedula(@Param('cedula') cedula: string) {
        return this.residentesService.findPreviewExpedienteByCedula(cedula);
   }



}
