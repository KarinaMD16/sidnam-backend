import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Query, Patch, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

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
    if (!file) throw new BadRequestException('Debes subir una imagen en el campo "imagen"');
    return this.publicacionesService.createProyecto(dto, file);
  }

  @Patch('updateProyecto/:id')
  updateProyecto(@Param() id: number, @Body() updateProyectoDto: updateProyectoDto,): Promise<Proyectos> {
    return this.publicacionesService.updateProyecto(id, updateProyectoDto);
  }

  @Delete('removeProyecto/:id')
  removeProyecto(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    return this.publicacionesService.removeProyecto(id);
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
  if (!file) throw new BadRequestException('Debes subir una imagen en el campo "imagen"');
  return this.publicacionesService.createDonacion(dto, file);
}

  @Patch('updateDonacion/:id')
  updateDonacion(@Param() id: number, @Body() updateDonacionDto: updateDonacionDto,
  ): Promise<Donacion> {
    return this.publicacionesService.updateDonacion(id, updateDonacionDto);
  }

  @Delete('removeDonacion/:id')
  removeDonacion(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    return this.publicacionesService.removeDonacion(id);
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
   if (!file) throw new BadRequestException('Debes subir una imagen en el campo "imagen"');
   return this.publicacionesService.createEvento(dto, file);
  }

  @Patch('updateEvento/:id')
  updateEventos(@Param() id: number, @Body() updateEventos: updateEventosDto,): Promise<Eventos> {
    return this.publicacionesService.updateEventos(id, updateEventos);
  }

  @Delete('removeEvento/:id')
  removeEventos(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    return this.publicacionesService.removeEventos(id);
  }

  @Get('getEvento/:id')
  getEventoById(@Param('id') id: number) {
    return this.publicacionesService.getEventoById(id);
  }

}

 
