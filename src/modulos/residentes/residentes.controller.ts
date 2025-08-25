import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ResidentesService } from './residentes.service';
import { CreateExpedienteCompletoDto } from './dto/createExpedienteResidenteDto';
import { ExpedienteResidentePreviewDto } from './dto/getPreviewExpediente';
import { ActualizarExpediente } from './dto/actualizarExpediente';
import { CreatePatologiaDto } from './dto/createPatologia.Dto';
import { Tipo_MedicamentoDto } from './dto/createTipoMedicamento.Dto';
import { NotaEnfermeria } from './entities/NotaEnfermeria.entity';
import { CreateCuracionDto } from './dto/createCuracionDto';
import { createConsultaEbaisDto } from './dto/createConsultaEabisDto';
import { createTipoConsultaDto } from './dto/createTipoConsultaDto';
import { CreateConsultaEspecialista } from './dto/createConsultaEspecialistaDto';

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

   @Post('expedientes/notas-enfermeria/:idExpediente')
   async crearNota(@Param('idExpediente', ParseIntPipe) idExpediente: number, @Body('textoCompleto') textoCompleto: string, @Body('titulo') titulo: string): Promise<NotaEnfermeria> {
       return this.residentesService.crearNotaEnfermeria(idExpediente, textoCompleto, titulo);
   }

   @Get('expedientes/notas-enfermeria/:id')
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

    @Get('expediente/enfermeria/:idExpediente')
    async getExpedienteEnfermeriaPorResidente(@Param('idExpediente', ParseIntPipe) idExpediente: number) {
        return this.residentesService.getExpedienteEnfermeria(idExpediente);
    }

    @Post('expedientes/curaciones/:idExpediente')
    async createCuracion(@Param('idExpediente', ParseIntPipe) idExpediente: number, @Body() createCuracionDto: CreateCuracionDto) {
        return this.residentesService.createCuracion(createCuracionDto, idExpediente);
    }

    @Post('expedientes/consultas_ebais/:idExpediente')
    async createConsultaEbais(@Param('idExpediente', ParseIntPipe) idExpediente: number, @Body() createConsulta: createConsultaEbaisDto) {
        return this.residentesService.createConsultaEbais(createConsulta, idExpediente);
    }

    @Post('tipo-consulta')
    async createTipoConsulta(@Body() createTipoConsulta: createTipoConsultaDto) {
        return this.residentesService.createTipoConsulta(createTipoConsulta);
    }

    @Post('expedientes/consultas_especialistas/:id_tipo_consulta/:idExpediente')
    async createConsultaEspecialista(@Param('id_tipo_consulta', ParseIntPipe) idTipoConsulta: number, @Param('idExpediente', ParseIntPipe) idExpediente: number, @Body() createConsulta: CreateConsultaEspecialista) {
        return this.residentesService.asociarTipoConusltaAConsulta(idTipoConsulta, idExpediente, createConsulta);
    }

    @Get('expedientes/enfermeria/bitacoras')
    async getBitacoras() {
        return this.residentesService.getBitacoras();
    }

    @Get('expedientes/enfermeria/consultasEspecialistas/:idTipoConsulta/:idExpediente')
    async getConsultasEspecialistas(@Param('idTipoConsulta', ParseIntPipe) idTipoConsulta: number, @Param('idExpediente', ParseIntPipe) idExpediente: number) {
        return this.residentesService.getConsultasEspecialistas(idTipoConsulta, idExpediente);
    }

    @Get('tipos-consulta')
    async getTiposConsulta() {
        return this.residentesService.getTipoConsultas();
    }

    @Get('expedientes/enfermeria/curaciones/:idExpediente')
    async getCuraciones(@Param('idExpediente', ParseIntPipe) idExpediente: number) {
        return this.residentesService.getCuraciones(idExpediente);
    }

    @Get('expedientes/enfermeria/consultasEbais/:idExpediente')
    async getConsultasEbais(@Param('idExpediente', ParseIntPipe) idExpediente: number) {
        return this.residentesService.getConsultaEbais(idExpediente);
    }

}
