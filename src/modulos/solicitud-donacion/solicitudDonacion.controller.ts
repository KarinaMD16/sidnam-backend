import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UseGuards, } from "@nestjs/common";
import { SolicitudDonacionService } from "./solicitudDonacion.service";
import { CrearSolicitudPendienteDto } from "./dto/crearSolicitudPendienteDto";
import { CreateSolicitudDonacionUseCase } from "./use-cases/solicitud/create-solicitudDonacion.use-case";
import { GetSolicitudesDonacionUseCase } from "./use-cases/solicitud/get-solicitudDonacion.use-case";
import { CreateRegistroDonacionUseCase } from "./use-cases/registro/create-RegistroDonacion.use-case";
import { GetRegistrosDonacionUseCase } from "./use-cases/registro/get-RegistroDonacion.use-case";
import { UpdateRegistroDonacionUseCase } from "./use-cases/registro/update-RegistroDonacion.use-case";
import { CrearRegistroDto } from "./dto/crearRegistroDto";
import { ActualizarRegistroDto } from "./dto/actualizarRegistroDto";
import { ReporteDonacionesService } from "./reporteDonacion.service";
import { ApiOkResponse, ApiOperation, ApiProduces, ApiQuery } from "@nestjs/swagger";
import { ReporteDonacionesMensualDto } from "./dto/reporteDonacionMensualDto";
import { Response as ExpressResponse } from 'express';
import { AuthGuard } from "../autenticacion/guard/auth.guard";
import { FiltrarDonacionesDto } from "./dto/filter-donacion.dto";


@Controller('donacion')
export class SolicitudDonacionController {

    constructor(
        private readonly solicitudDonacionService: SolicitudDonacionService,
        private readonly createSolicitudDonacionUseCase: CreateSolicitudDonacionUseCase,
        private readonly getSolicitudesDonacionUseCase: GetSolicitudesDonacionUseCase,
        private readonly createRegistroDonacionUseCase: CreateRegistroDonacionUseCase,
        private readonly getRegistrosUseCase: GetRegistrosDonacionUseCase,
        private readonly updateRegistros: UpdateRegistroDonacionUseCase,
        private readonly reportes: ReporteDonacionesService
    ) { }

    @Post('crearSolicitudDonacionPendiente')
    crearSolicitudDonacionPendiente(@Body() solicitudPendiente: CrearSolicitudPendienteDto) {
        return this.createSolicitudDonacionUseCase.crearSolicitudDonacionPendiente(solicitudPendiente);
    }


    @UseGuards(AuthGuard)
    @Get('getPreviewSolicitudesDonacion')
    getPreviewSolicitudes(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        if (page && limit) {
            return this.getSolicitudesDonacionUseCase.findAllPreviews(page, limit);
        }
        return this.getSolicitudesDonacionUseCase.findAllPreviews();
    }
    @UseGuards(AuthGuard)
    @Get('getSolicitudById/:id')
    getSolicitudesById(@Param('id') id: number) {
        return this.getSolicitudesDonacionUseCase.findSolicitudById(id);
    }

    @UseGuards(AuthGuard)
    @Get('getEstadoSolicitudDonacion')
    getEstadosSolicitudDonacion() {
        return this.solicitudDonacionService.getEstadosSolicitudDonacion()
    }

    @UseGuards(AuthGuard)
    @Get('getFiltroSolicitudesDonacion/:id')
    getFiltro(
        @Param('id', ParseIntPipe) id: number,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        if (page && limit) {
            return this.getSolicitudesDonacionUseCase.getFiltrosEstados(id, page, limit)
        }
        return this.getSolicitudesDonacionUseCase.getFiltrosEstados(id)
    }

    @UseGuards(AuthGuard)
    @Patch('updateEstado/:idEstado/:idSoli/:idUsuario')
    updateEstado(@Param('idEstado', ParseIntPipe) idEstado: number, @Param('idSoli', ParseIntPipe) idSoli: number, @Param('idUsuario', ParseIntPipe) idUsuario: number) {
        return this.createRegistroDonacionUseCase.updateEstadoSolicitudes(idEstado, idSoli, idUsuario)
    }

    @UseGuards(AuthGuard)
    @Get('getPreviewRegistros')
    getPreviewRegistros(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        if (page && limit) {
            return this.getRegistrosUseCase.findAllPreviewsRegistros(page, limit);
        }
        return this.getRegistrosUseCase.findAllPreviewsRegistros();
    }

    @UseGuards(AuthGuard)
    @Get('getRegistroById/:idRegistro')
    getRegistroById(@Param('idRegistro') idRegistro: number) {
        return this.getRegistrosUseCase.getRegistroById(idRegistro);
    }

    @UseGuards(AuthGuard)
    @Patch('updateEstadoARecibido/:idRegistro/:idUsuario')
    updateEstadoRegistro(@Param('idRegistro', ParseIntPipe) idRegistro: number, @Param('idUsuario', ParseIntPipe) idUsuario: number) {
        return this.updateRegistros.updateEstadoARecibido(idRegistro, idUsuario);
    }

    @UseGuards(AuthGuard)
    @Post('crearRegistro/:idUsuario')
    crearRegistro(@Body() crearReg: CrearRegistroDto, @Param('idUsuario', ParseIntPipe) idUsuario: number) {
        return this.createRegistroDonacionUseCase.crearRegistro(crearReg, idUsuario)
    }

    @UseGuards(AuthGuard)
    @Patch('updateRegistro/:idRegistro')
    async updateRegistro(@Body() actualizar: ActualizarRegistroDto, @Param('idRegistro', new ParseIntPipe) idRegistro: number) {
        return this.updateRegistros.updateRegistro(idRegistro, actualizar);
    }


    @UseGuards(AuthGuard)
    @Get('reportes/mensual/pdf')
    @ApiOperation({ summary: 'Descargar PDF mensual de donaciones' })
    @ApiProduces('application/pdf')
    @ApiOkResponse({
        description: 'Archivo PDF',
        content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
    })
    @ApiQuery({ name: 'year', required: true, type: Number })
    @ApiQuery({ name: 'month', required: true, type: Number, description: '1-12' })
    async pdfMensual(
        @Query() q: ReporteDonacionesMensualDto,
        @Res() res: ExpressResponse
    ) {
        await this.reportes.generarReporteMensual(q, res);
    }

    @Get('filtrar')
    @ApiQuery({ name: 'origen', required: true, enum: ['solicitud', 'registro'] })
    @ApiQuery({ name: 'estado', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'recibida', required: false })
    @ApiQuery({ name: 'fechaInicio', required: false })
    @ApiQuery({ name: 'fechaFin', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async filtrarDonaciones(@Query() filtros: FiltrarDonacionesDto) {

        if (filtros.origen === 'solicitud') {
            return this.getSolicitudesDonacionUseCase.getFiltrado(filtros);
        }

        if (filtros.origen === 'registro') {
            return this.getRegistrosUseCase.getFiltrado(filtros);
        }

        throw new BadRequestException('Origen inválido');
    }

}

