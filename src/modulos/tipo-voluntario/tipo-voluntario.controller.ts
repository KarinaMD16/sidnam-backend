import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { TipoVoluntarioService } from './tipo-voluntario.service';
import { CreateTipoVoluntarioDto } from './dto/create-tipo-voluntario.dto';
import { UpdateTipoVoluntarioDto } from './dto/update-tipo-voluntario.dto';


@Controller('tipo-voluntario')
export class TipoVoluntarioController {
  constructor(private readonly tipoVoluntarioService: TipoVoluntarioService) {}

  @Post()
  create(@Body() createTipoVoluntarioDto: CreateTipoVoluntarioDto) {
    return this.tipoVoluntarioService.create(createTipoVoluntarioDto);
  }


  @Get()
  findAll() {
    return this.tipoVoluntarioService.findAll();
  }


  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTipoVoluntarioDto: UpdateTipoVoluntarioDto) {
    return this.tipoVoluntarioService.update(id, updateTipoVoluntarioDto);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoVoluntarioService.remove(id);
  }

}