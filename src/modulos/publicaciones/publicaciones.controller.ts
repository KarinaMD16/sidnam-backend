import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
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
  findAllProyectos(): Promise<Proyectos[]> {
    return this.publicacionesService.findAllProyectos();
  }

  @Post('createProyecto')
  createProyecto(@Body() proyectoDto: ProyectoDto): Promise<Proyectos> {
    return this.publicacionesService.createProyecto(proyectoDto);
  }

  @Put('updateProyecto/:id')
  updateProyecto(@Param() id: number, @Body() updateProyectoDto: updateProyectoDto,): Promise<Proyectos> {
    return this.publicacionesService.updateProyecto(id, updateProyectoDto);
  }

  @Delete('removeProyecto/:id')
  removeProyecto(@Param() id: number): Promise<void> {
    return this.publicacionesService.removeProyecto(id);
  }

  // ------ Donaciones ------

  @Get('getDonaciones')
  findAllDonacion(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Donacion[]> {

    if (page && limit) {
      return this.publicacionesService.findAllDonacion(page, limit);
    }
    return this.publicacionesService.findAllDonacion();
  }

  @Post('createDonacion')
  createDonaciones(@Body() donacionDto: DonacionDto): Promise<Donacion> {
    return this.publicacionesService.createDoanciones(donacionDto);
  }

  @Put('updateDonacion/:id')
  updateDonacion(@Param() id: number, @Body() updateDonacionDto: updateDonacionDto,
  ): Promise<Donacion> {
    return this.publicacionesService.updateDonacion(id, updateDonacionDto);
  }

  @Delete('removeDonacion/:id')
  removeDonacion(@Param() id: number): Promise<void> {
    return this.publicacionesService.removeDonacion(id);
  }

   // ------ Eventos ------

   @Get('getEventos')
  findAllEventos(): Promise<Eventos[]> {
    return this.publicacionesService.findAllEventos();
  }

  @Post('createEvento')
  createEventos(@Body() createEvento: EventoDto): Promise<Eventos> {
    return this.publicacionesService.createEventos(createEvento);
  }

  @Put('updateEvento/:id')
  updateEventos(@Param() id: number, @Body() updateEventos: updateEventosDto,): Promise<Eventos> {
    return this.publicacionesService.updateEventos(id, updateEventos);
  }

  @Delete('removeEvento/:id')
  removeEventos(@Param() id: number): Promise<void> {
    return this.publicacionesService.removeEventos(id);
  }

}

 
