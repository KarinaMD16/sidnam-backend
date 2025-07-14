import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { TipoDonacionService } from './tipo-donacion.service';
import { CreateTipoDonacionDto } from './dto/create-tipo-donacion.dto';
import { UpdateTipoDonacionDto } from './dto/update-tipo-donacion.dto';


@Controller('tipo-donacion')
export class TipoDonacionController {
  constructor(private readonly tipoDonacionService: TipoDonacionService) {}

  @Post()
  create(@Body() createTipoDonacionDto: CreateTipoDonacionDto) {
    return this.tipoDonacionService.create(createTipoDonacionDto);
  }


  @Get()
  findAll() {
    return this.tipoDonacionService.findAll();
  }


  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTipoDonacionDto: UpdateTipoDonacionDto) {
    return this.tipoDonacionService.update(id, updateTipoDonacionDto);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoDonacionService.remove(id);
  }

}