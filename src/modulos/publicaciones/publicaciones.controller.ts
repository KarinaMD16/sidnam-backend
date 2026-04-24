import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Query, Patch, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { ProyectoDto } from './dto/createProyectosDto';
import { updateProyectoDto } from './dto/updateProyectoDto';
import { DonacionDto } from './dto/createDonacionDto';
import { updateDonacionDto } from './dto/updateDonacionDto';
import { Proyectos } from './entities/proyectos.entity';
import { Donacion } from './entities/donacion.entity';
import { updateEventosDto } from './dto/updateEventosDto';
import { Eventos } from './entities/eventos.entity';
import { EventoDto } from './dto/createEventosDto';
import { HandleEstadoEventoDto } from './dto/handleEstadoEventoDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '../autenticacion/guard/auth.guard';
import { assertValidImageUpload } from 'src/common/utils/imageUploadValidation';


@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // ------ Proyectos ------

  @Get('getProyectos')
  findAllProyectos(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<{ data: Proyectos[]; total: number }> {
    return this.publicacionesService.findAllProyectos(page, limit);
  }

  
  @Get('getProyectosInactivos')
  findAllProyectosInactivos(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<{ data: Partial<Proyectos>[]; total: number }> {
    return this.publicacionesService.findAllProyectosInactivos(page, limit);
  }

  @UseGuards(AuthGuard)
  @Post('createProyecto')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      Titulo: { type: 'string', example: 'Proyecto de reciclaje comunitario' },
      Descripcion: { type: 'string', example: 'Recolección de plástico en el barrio.' },
      fecha: { type: 'string', example: '2025-10-10' },
      imagen: { type: 'string', format: 'binary' },
    },
  },
  })
  async createProyecto(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: ProyectoDto,
   ) {
    assertValidImageUpload(file);
    return this.publicacionesService.createProyecto(dto, file);
  }

  @UseGuards(AuthGuard)
  @Patch('updateProyecto/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      Titulo: { type: 'string', example: 'Ampliación de la granja' },
      Descripcion: { type: 'string', example: 'Crecimiento de las zonas verdes.' },
      fecha: { type: 'string', example: '2025-10-25' },
      imagen: { type: 'string', format: 'binary' },
    },
  },
})
 async updateProyecto(@Param('id', ParseIntPipe) id: number, 
 @Body() updateProyectoDto: updateProyectoDto,
  @UploadedFile() file?: Express.Multer.File,
) {
    assertValidImageUpload(file, { required: false });
    return this.publicacionesService.updateProyecto(id, updateProyectoDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete('removeProyecto/:id')
  removeProyecto(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    return this.publicacionesService.removeProyecto(id);
  }

  
  @Patch('handleProyecto/:id')
  async handleProyecto(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.publicacionesService.handleEstadoProyecto(id);
  }

  @Get('getProyecto/:id')
  getProyectoById(@Param('id') id: number) {
    return this.publicacionesService.getProyectoById(id); 
  }

  // ------ Donaciones ------

  @Get('getDonaciones')
  findAllDonacion(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<{ data: Donacion[]; total: number }> {
    return this.publicacionesService.findAllDonacion(page, limit);
  }


  @Get('getDonacionesInactivas')
  findAllDonacionesInactivas(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<{ data: Partial<Donacion>[]; total: number }> {
    return this.publicacionesService.findAllDonacionInactivas(page, limit);
  }

@UseGuards(AuthGuard)
  @Post('createDonacion')
@UseInterceptors(FileInterceptor('imagen'))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      Titulo: { type: 'string', example: 'Campaña de alimentos 2025' },
      Descripcion: { type: 'string', example: 'Recolección de víveres para familias vulnerables.' },
      fecha: { type: 'string', example: '2025-09-30' },
      imagen: { type: 'string', format: 'binary' },
    },
  },
})
async createDonacion(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: DonacionDto,
) {
  assertValidImageUpload(file);
  return this.publicacionesService.createDonacion(dto, file);
}

  @UseGuards(AuthGuard)
  @Patch('updateDonacion/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      Titulo: { type: 'string', example: 'Nueva campaña solidaria' },
      Descripcion: { type: 'string', example: 'Recolecta de víveres para familias necesitadas.' },
      fecha: { type: 'string', example: '2025-10-25' },
      imagen: { type: 'string', format: 'binary' },
    },
  },
})
async updateDonacion(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateDonacionDto: updateDonacionDto,
  @UploadedFile() file?: Express.Multer.File,
  ){
    assertValidImageUpload(file, { required: false });
    return this.publicacionesService.updateDonacion(id, updateDonacionDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete('removeDonacion/:id')
  removeDonacion(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    return this.publicacionesService.removeDonacion(id);
  }

  
  @Patch('handleDonacion/:id')
  async handleDonacion(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.publicacionesService.handleEstadoDonacion(id);
  }

 
  @Get('getDonacion/:id')
  getDonacionById(@Param('id') id: number) {
    return this.publicacionesService.getDonacionById(id); 
  }

   // ------ Eventos ------

   @Get('getEventos')
  findAllEventos(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<{ data: Eventos[]; total: number }> {
    return this.publicacionesService.findAllEventos(page, limit);
  }

 
  @Get('getEventosInactivos')
  findAllEventosInactivos(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<{ data: Partial<Eventos>[]; total: number }> {
    return this.publicacionesService.findAllEventosInactivos(page, limit);
  }

  @UseGuards(AuthGuard)
  @Post('createEvento')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      Titulo: { type: 'string', example: 'Festival del Voluntariado' },
      Descripcion: { type: 'string', example: 'Celebración anual con participación comunitaria.' },
      fecha: { type: 'string', example: '2025-12-01' },
      imagen: { type: 'string', format: 'binary' },
    },
  },
  })
  async createEvento(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: EventoDto,
  ) {
   assertValidImageUpload(file);
   return this.publicacionesService.createEvento(dto, file);
  }

 
  @UseGuards(AuthGuard)
  @Patch('updateEvento/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      Titulo: { type: 'string', example: 'Gran Cena Navideña' },
      Descripcion: { type: 'string', example: 'Acompañanos en esta gran noche.' },
      fecha: { type: 'string', example: '2025-10-25' },
      imagen: { type: 'string', format: 'binary' },
    },
  },
})
async updateEventos(
  @Param('id', ParseIntPipe) id: number, 
  @Body() updateEventos: updateEventosDto,
  @UploadedFile() file?: Express.Multer.File,
) {
    assertValidImageUpload(file, { required: false });
    return this.publicacionesService.updateEventos(id, updateEventos, file);
  }

  @UseGuards(AuthGuard)
  @Delete('removeEvento/:id')
  removeEventos(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    return this.publicacionesService.removeEventos(id);
  }


  @Patch('handleEvento/:id')
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fecha: {
          type: 'string',
          example: '2026-04-10',
          description: 'Requerida para reactivar un evento inactivo.',
        },
      },
    },
  })
   async handleEvento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: HandleEstadoEventoDto,
  ): Promise<{ message: string }> {
    return this.publicacionesService.handleEstadoEvento(id, dto);
  }

  
  @Get('getEvento/:id')
  getEventoById(@Param('id') id: number) {
    return this.publicacionesService.getEventoById(id);
  }

}

 
