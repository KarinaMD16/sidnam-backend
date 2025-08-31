import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
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
import { CrearNotaDto } from './dto/CrearNotaDto';
import { CreateUnidadMedidaDto } from './dto/createUnidadMedidaDto';
import { CreateAdministracionDto } from './dto/registrarMedicamentoDto';
import { CreateMedicamentoDto } from './dto/createMedicamentoDto';
import { CreateAdministracionEspecialDto } from './dto/createAdministracionEspecialDto';
import { Libro_Campo } from './entities/libroCampo.entity';
import { CrearLibroCampoDto } from './dto/createLibroCampoDto';
import { AtualizarLibroCampoDto } from './dto/actualizarLibroCampoDto';

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

   @Post('medicamentos/:idTipoMedicamento')
   async createMedicamento(@Param('idTipoMedicamento', ParseIntPipe) idTipoMedicamento: number, @Body() createMedicamento: CreateMedicamentoDto) {
       return this.residentesService.asociarMedicamentoATipoMedicamento(idTipoMedicamento, createMedicamento);
   }

   @Get('tipos-medicamentos')
   async getTiposMedicamentos() {
       return this.residentesService.getTipos_Medicamentos();
   }

   @Get('medicamentos')
   async getMedicamentos() {
       return this.residentesService.getMedicamentos();
   }

   @Get('medicamentos/tipo/:id_tipoMedicamento')
   async getMedicamentosPorTipo(@Param('id_tipoMedicamento', ParseIntPipe) idTipoMedicamento: number) {
       return this.residentesService.getMedicamentosPorTipo(idTipoMedicamento);
   }

   @Get('turnos')
   async getTurnos() {
       return this.residentesService.getTurnos();
   }

    @Post('expedientes/notas-enfermeria/:idExpediente')
    async crearNota(@Param('idExpediente', ParseIntPipe) idExpediente: number, @Body() crearNotaDto: CrearNotaDto): Promise<NotaEnfermeria> {
       const { titulo, textoCompleto } = crearNotaDto;
       return this.residentesService.crearNotaEnfermeria(idExpediente, textoCompleto, titulo);
    }

    @Post('expedientes/libro-campo/:idExpediente')
    async crearNotaLibroCampo(@Param('idExpediente', ParseIntPipe) idExpediente: number,@Body() crearLibroCampoDto: CrearLibroCampoDto,): Promise<Libro_Campo> {
        const { descripcionCompleta, problematica, fecha_actividad, acuerdo_alcanzado } = crearLibroCampoDto;

        return this.residentesService.crearNotaLibroCampo(
            idExpediente,
            descripcionCompleta,
            problematica,
            fecha_actividad,
            acuerdo_alcanzado,
        );
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

    @Get('expedientes/libro-campo/:idExpediente')
        async obtenerNotasLibroPorExpediente(@Param('idExpediente', ParseIntPipe) idExpediente: number): Promise<{id: number;descripcion: string;problematica?: string;acuerdoAlcanzado?: string;fechaActividad?: string;fecha: string;}[]> {
        const notas = await this.residentesService.obtenerNotasLibroPorExpediente(idExpediente);

        if (!notas || notas.length === 0) {
            throw new NotFoundException('No se encontraron notas del libro de campo para este expediente');
        }

        return notas;
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

    @Post('expedientes/enfermeria/unidades-medida')
    async createUnidadMedida(@Body() createUnidadMedidaDto: CreateUnidadMedidaDto) {
        return this.residentesService.createUnidadMedida(createUnidadMedidaDto);
    }

    @Post('expedientes/enfermeria/medicamentos/:id_expediente')
    async agregarMedicamentoAExpediente(@Param('id_expediente', ParseIntPipe) idExpediente: number, @Body() agregarRegistro: CreateAdministracionDto) {
        return this.residentesService.agregarMedicamentoExpediente(idExpediente, agregarRegistro);
    }

    @Post('expedientes/enfermeria/medicamentosEspeciales/:id_expediente')
    async agregarMedicamentoEspecialesAExpediente(@Param('id_expediente', ParseIntPipe) idExpediente: number, @Body() createRegistroEspecial: CreateAdministracionEspecialDto) {
        return this.residentesService.agregarTratamientosEspeciales(idExpediente, createRegistroEspecial);
    }

    @Get('estados-expedientes')
    async getEstadosExpedientes() {
        return this.residentesService.getEstados();
    }

    @Patch('expedientes/trabajo-social/estado/:id_expediente/:id_estado/:id_usuario')
    async cambiarEstadoExpediente(@Param('id_expediente', ParseIntPipe) idExpediente: number, @Param('id_estado', ParseIntPipe) idEstado: number, @Param('id_usuario', ParseIntPipe) id_usuario: number) {
        return this.residentesService.cambiarEstado(idEstado, idExpediente, id_usuario);
    }

    @Patch('expedientes/trabajo-social/nota-libro/:idNotaPadre')
    async actualizarNota(@Param('idNotaPadre', ParseIntPipe) idNotaPadre: number, @Body() actualizarNota: AtualizarLibroCampoDto){
        return this.residentesService.updateNotasLibro(idNotaPadre, actualizarNota)
    }

}
    