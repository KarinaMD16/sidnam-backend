import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ResidentesService } from './residentes.service';
import { CreateExpedienteCompletoDto } from './dto/createExpedienteResidenteDto';
import { ExpedienteResidentePreviewDto } from './dto/getPreviewExpediente';
import { ActualizarExpediente } from './dto/actualizarExpediente';

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

   @Get('expedientes/buscar-nombre')
async findPreviewsByNombre(
  @Query('nombre') nombre: string,
): Promise<ExpedienteResidentePreviewDto[]> {
  if (!nombre) {
    throw new BadRequestException('Debe proporcionar un nombre válido (string)');
  }

  return this.residentesService.findPreviewsExpedientesByNombre(nombre);
}

   @Get('expedientes/:id')
   async getExpedienteById(@Param('id', ParseIntPipe) id: number) {
        return this.residentesService.findExpedienteById(id);
   }

   @Get('expedientes/residente/:cedula')
   async getExpedienteByCedula(@Param('cedula') cedula: string) {
        return this.residentesService.findPreviewExpedienteByCedula(cedula);
   }

   @Patch('expedientes/residente/:id')
   async updateExpediente(@Param('id', ParseIntPipe) id: number, @Body() actualizarExpediente: Partial<ActualizarExpediente>) {
       return this.residentesService.actualizarInformacionGeneralExpediente(id, actualizarExpediente);
   }

}
