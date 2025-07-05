import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { ProyectoDto } from './dto/createProyectosDto';
import { updateProyectoDto } from './dto/updateProyectoDto';
import { DonacionDto } from './dto/createDonacionDto';
import { updateDonacionDto } from './dto/updateDonacionDto';
import { Proyectos } from './entities/proyectos.entity';
import { Donacion } from './entities/donacion.entity';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // ------ Proyectos ------

  @Get('getProyectos')
  findAllProyectos(): Promise<Proyectos[]> {
    return this.publicacionesService.findAllProyectos();
  }

  @Post('createProyectos')
  createProyecto(@Body() proyectoDto: ProyectoDto): Promise<Proyectos> {
    return this.publicacionesService.createProyecto(proyectoDto);
  }

  @Put('updateProyectos/:id')
  updateProyecto(@Param() id: number, @Body() updateProyectoDto: updateProyectoDto,): Promise<Proyectos> {
    return this.publicacionesService.updateProyecto(id, updateProyectoDto);
  }

  @Delete('removeProyectos/:id')
  removeProyecto(@Param() id: number): Promise<void> {
    return this.publicacionesService.removeProyecto(id);
  }

  // ------ Donaciones ------

  @Get('getDonaciones')
  findAllDonacion(): Promise<Donacion[]> {
    return this.publicacionesService.findAllDonacion();
  }

  @Post('createDonaciones')
  createDonaciones(@Body() donacionDto: DonacionDto): Promise<Donacion> {
    return this.publicacionesService.createDoanciones(donacionDto);
  }

  @Put('updateDonaciones/:id')
  updateDonacion(@Param() id: number, @Body() updateDonacionDto: updateDonacionDto,
  ): Promise<Donacion> {
    return this.publicacionesService.updateDonacion(id, updateDonacionDto);
  }

  @Delete('removeDonaciones/:id')
  removeDonacion(@Param() id: number): Promise<void> {
    return this.publicacionesService.removeDonacion(id);
  }
}
