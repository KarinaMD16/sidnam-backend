import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { VoluntariadoService } from '../services/voluntariado.service';
import { CrearSolicitudPendienteDto } from '../dto/crearSolicitudPendienteDto';
import { TipoVoluntarioDto } from '../dto/crearTipoVoluntarioDto';
import { CrearExpediente } from '../dto/crearExpedienteDto';
import { CrearACtividadesDto } from '../dto/crearActividadesDto';
import { ActualizarExpedienteDto } from '../dto/actulizarExpedienteDto';
import { CreateExpedienteUseCase } from '../use-cases/expediente/create-expediente.use-case';
import { UpdateExpedienteUseCase } from '../use-cases/expediente/update-expediente.use-case';
import { CreateSolicitudUseCase } from '../use-cases/solicitud/create-solicitud.use-case';
import { GetExpedientesUseCase } from '../use-cases/expediente/get-expedientes.use-case';
import { GetSolicitudesUseCase } from '../use-cases/solicitud/get-solicitud.use-case';
import { ReporteService } from '../services/reporte.service';
import { Response } from 'express';
import { DeleteExpediente } from '../use-cases/expediente/delete-horarioExpediente.use-case';


@Controller('voluntariado')
export class VoluntariadoController {


    constructor(
        private readonly voluntariadoService: VoluntariadoService, 
        private readonly updateExpedientes: UpdateExpedienteUseCase,
        private readonly createExpediente: CreateExpedienteUseCase,
        private readonly createSolicitud: CreateSolicitudUseCase,
        private readonly getExpedientesUseCase: GetExpedientesUseCase,
        private readonly getSolicitudesUseCase: GetSolicitudesUseCase,
        private readonly reporteService: ReporteService,
        private readonly deleteHorarios: DeleteExpediente
    ){}


    @Post('crearSolicitudPendiente')
    crearSolicitudPendiente(@Body() SolicitudPendiente: CrearSolicitudPendienteDto){
        return this.createSolicitud.crearSolicitudPendiente(SolicitudPendiente)
    }

    @Post('crearExpediente/:idUsuario')
    crearExpediente(@Body() crearExp: CrearExpediente, @Param('idUsuario', ParseIntPipe) idUsuario: number){
        return this.createExpediente.crearExpediente(crearExp, idUsuario)
    }

    @Post('tipo-Voluntariado')
    crearTipoVoluntario(@Body() crearTipoVoluntario: TipoVoluntarioDto){
        return this.voluntariadoService.crearTipoVoluntario(crearTipoVoluntario);
    }

    @Get('getTipoVoluntario')
    getAllTipoVoluntario(){
        return this.voluntariadoService.getAllTipoVoluntario()
    }

    @Get('getPreviewSolicitudes')
    getPreviewSolicitudes(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ){
        if (page && limit) {
            return this.getSolicitudesUseCase.findAllPreviews(page, limit);
        }
        return this.getSolicitudesUseCase.findAllPreviews();
    }

    @Get('getSolicitudById/:id')
    getSolicitudesById(@Param('id') id: number){
        return this.getSolicitudesUseCase.findSolicitudById(id);
    }   

    @Get('getEstadoSolicitud')
    getEstadosSolicitd(){
        return this.voluntariadoService.getEstadosSolicitud()
    }

    @Get('getFiltroSolicitudes/:id')
    getFiltro(
        @Param('id', ParseIntPipe) id: number,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number, 
    ){
         if (page && limit) {
             return this.getSolicitudesUseCase.getFiltosEstados(id, page, limit)
        }
         return this.getSolicitudesUseCase.getFiltosEstados(id)
    }

    @Patch('updateEstado/:idEstado/:idSoli/:idUsuario')
    updateEstado( @Param('idEstado', ParseIntPipe)  idEstado: number, @Param('idSoli', ParseIntPipe) idSoli: number, @Param('idUsuario', ParseIntPipe) idUsuario: number){
        return this.createExpediente.updateEstadoSolicitudes(idEstado, idSoli, idUsuario)
    }

    @Get('getPreviewExpedientes')
    getPreviewExpedientes(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ){
        if (page && limit) {
            return this.getExpedientesUseCase.findAllPreviewsExpedientes(page, limit);
        }
        return this.getExpedientesUseCase.findAllPreviewsExpedientes();
    }

    @Post('crearActividad/:idSolicitud')
    createActividad(@Body() crearActividad: CrearACtividadesDto, @Param('idSolicitud') idSolicitud: number){
        return this.voluntariadoService.createActividades(crearActividad, idSolicitud);
    }

    @Get('getExpedienteById/:idExpediente')
    getExpedienteById(@Param('idExpediente') idExpediente: number){
        return this.getExpedientesUseCase.getByIdExpediente(idExpediente);
    }

    @Get('getExpedientesActivosByCedula/:cedula')
    getExpedientesByCedula(@Param('cedula') cedula: string ){
        return this.getExpedientesUseCase.getExpedienteActivoByCedula(cedula);
    }

    @Patch('updateEstadoAInactivo/:idSolicitud')
    updateEstadoExpediente(@Param('idSolicitud', ParseIntPipe) idSolicitud: number){
        return this.updateExpedientes.updateEstadoAInactivo(idSolicitud);
    }

    @Get('getExpedientesActivos')
    getExpedientesActivos( @Query('page', new ParseIntPipe({ optional: true })) page?: number, @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,){
        return this.getExpedientesUseCase.getExpedientesActivos(page, limit)
    }

    @Get('getAllExpedientesByCedula/:cedula')
    getAllExpedientesByCedula( @Param('cedula') cedula: string, @Query('page', new ParseIntPipe({ optional: true })) page?: number, @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,){
        return this.getExpedientesUseCase.getAllExpedientesByCedula(cedula, page, limit)
    }

    @Get('getAllActividades/:idExpediente')
    getAllActividades( @Param('idExpediente', new ParseIntPipe) idExpediente: number, @Query('page', new ParseIntPipe({ optional: true })) page?: number, @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,){
        return this.voluntariadoService.getActividades(idExpediente, page, limit)
    }

    @Patch('updateExpediente/:idExpediente')
    async updateExpediente(@Body() actualizar: ActualizarExpedienteDto, @Param('idExpediente', new ParseIntPipe) idExpediente: number){
        return this.updateExpedientes.updateExpediente(idExpediente, actualizar);
    }

    @Get(':id/pdf')
        async generarPdf(@Param('id') id: string, @Res() res: Response) {
        const idNum = Number(id);
        if (isNaN(idNum)) {
            res.status(400).send('ID inválido');
            return;
        }
        await this.reporteService.generarReporteActividades(idNum, res);
    }

    @Delete('horario/:id')
    async removeHorario(@Param('id', new ParseIntPipe) id: number){
        await this.deleteHorarios.deleteHorario(id);
    }
}
