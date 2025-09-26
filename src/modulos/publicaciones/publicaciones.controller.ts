import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query, Patch } from '@nestjs/common';
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
  createProyecto(@Body() proyectoDto: ProyectoDto): Promise<Proyectos> {
    return this.publicacionesService.createProyecto(proyectoDto);
  }

  @Patch('updateProyecto/:id')
  updateProyecto(@Param() id: number, @Body() updateProyectoDto: updateProyectoDto,): Promise<Proyectos> {
    return this.publicacionesService.updateProyecto(id, updateProyectoDto);
  }

  @Delete('removeProyecto/:id')
  removeProyecto(@Param() id: number): Promise<void> {
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
  createDonaciones(@Body() donacionDto: DonacionDto): Promise<Donacion> {
    return this.publicacionesService.createDoanciones(donacionDto);
  }

  @Patch('updateDonacion/:id')
  updateDonacion(@Param() id: number, @Body() updateDonacionDto: updateDonacionDto,
  ): Promise<Donacion> {
    return this.publicacionesService.updateDonacion(id, updateDonacionDto);
  }

  @Delete('removeDonacion/:id')
  removeDonacion(@Param() id: number): Promise<void> {
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
  createEventos(@Body() createEvento: EventoDto): Promise<Eventos> {
    return this.publicacionesService.createEventos(createEvento);
  }

  @Patch('updateEvento/:id')
  updateEventos(@Param() id: number, @Body() updateEventos: updateEventosDto,): Promise<Eventos> {
    return this.publicacionesService.updateEventos(id, updateEventos);
  }

  @Delete('removeEvento/:id')
  removeEventos(@Param() id: number): Promise<void> {
    return this.publicacionesService.removeEventos(id);
  }

  @Get('getEvento/:id')
  getEventoById(@Param('id') id: number) {
    return this.publicacionesService.getEventoById(id);
  }

}

 
