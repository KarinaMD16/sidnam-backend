import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ResidentesService } from './residentes.service';
import { CreateExpedienteCompletoDto } from './dto/createExpedienteResidenteDto';
import { ExpedienteResidentePreviewDto } from './dto/getPreviewExpediente';
import { ActualizarExpediente } from './dto/actualizarExpediente';
import { CreatePatologiaDto } from './dto/createPatologia.Dto';
import { Tipo_MedicamentoDto } from './dto/createTipoMedicamento.Dto';
import { NotaEnfermeria } from './entities/NotaEnfermeria.entity';

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

   @Patch('expedientes/residente/:id')
   async updateExpediente(@Param('id', ParseIntPipe) id: number, @Body() actualizarExpediente: Partial<ActualizarExpediente>) {
       return this.residentesService.actualizarInformacionGeneralExpediente(id, actualizarExpediente);
   }

   @Post('patologias')
   async createPatologia(@Body() createPatologiaDto: CreatePatologiaDto) {
       return this.residentesService.createPatologia(createPatologiaDto);
   }    

   @Post('expedientes/:id/adjuntar-patologia/:id_patologia')
   async attachPatologiaToExpediente(@Param('id', ParseIntPipe) id: number, @Param('id_patologia', ParseIntPipe) id_patologia: number) {
       return this.residentesService.agregarPatologiaExpediente(id, id_patologia);
   }

   @Get('patologias')
   async getPatologias() {
       return this.residentesService.getPatologias();
   }

   @Post('tipos-medicamento')
   async createTipoMedicamento(@Body() createTipoMedicamentoDto: Tipo_MedicamentoDto) {
       return this.residentesService.crearTipoMedicamento(createTipoMedicamentoDto);
   }

   @Get('tipos-medicamento')
   async getTiposMedicamento() {
       return this.residentesService.getTiposMedicamento();
   }

   @Post('medicamentos/:idTipoMedicamento')
   async createMedicamento(@Param('idTipoMedicamento', ParseIntPipe) idTipoMedicamento: number, @Body('nombre') nombre: string) {
       return this.residentesService.asociarMedicamentoATipoMedicamento(idTipoMedicamento, nombre);
   }

   @Get('medicamentos')
   async getMedicamentos() {
       return this.residentesService.getMedicamentos();
   }

   @Get('turnos')
   async getTurnos() {
       return this.residentesService.getTurnos();
   }

   @Post('notas-enfermeria/:idExpediente')
   async crearNota(@Param('idExpediente', ParseIntPipe) idExpediente: number, @Body('textoCompleto') textoCompleto: string, @Body('titulo') titulo: string): Promise<NotaEnfermeria> {
       return this.residentesService.crearNotaEnfermeria(idExpediente, textoCompleto, titulo);
   }

   @Get('expediente/notas/:id')
   async obtenerNotasPorExpediente(@Param('id') expedienteId: number): Promise<{ id: number; nota: string }[]> {
       return this.residentesService.obtenerNotasPorExpediente(expedienteId);
   }

    @Get('expedientes/nota/:id')
    async obtenerNotaCompleta(@Param('id') idNotaPadre: number): Promise<{ id: number; nota: string }> {
        const nota = await this.residentesService.obtenerNotaCompleta(idNotaPadre);
        if (!nota) throw new NotFoundException('Nota no encontrada');
        return nota;
    }

    @Delete('expedientes/:id/adjuntar-patologia/:id_patologia')
    async eliminarPatologiadeExpediente(@Param('id', ParseIntPipe) id: number, @Param('id_patologia', ParseIntPipe) id_patologia: number) {
        return this.residentesService.eliminarPatologia(id, id_patologia);
    }

    @Get('expediente/enfermeria/:idExpediente')
    async getExpedienteEnfermeria(@Param('idExpediente', ParseIntPipe) idExpediente: number) {
        return this.residentesService.getExpedienteEnfermeria(idExpediente);
    }

    @Get('expediente/enfermeria/residente/:idExpediente')
    async getExpedienteEnfermeriaPorResidente(@Param('idExpediente', ParseIntPipe) idExpediente: number) {
        return this.residentesService.getExpedienteEnfermeria(idExpediente);
    }

}
