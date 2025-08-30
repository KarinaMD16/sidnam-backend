import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UnidadesMedidaService } from './unidades-medida.service';
import { CreateUnidadMedidaDto } from '../residentes/dto/createUnidadMedidaDto';

@Controller('unidades-medida')
export class UnidadesMedidaController {
  constructor(
    private readonly unidadesMedidaService: UnidadesMedidaService,
  ) {}

  @Get()
  async getTipoUnidadesMedida() {
    return this.unidadesMedidaService.getTipoUnidadesMedida();
  }

  @Post('tipo-unidad-medida/unidad-medida/:idTipoUnidad')
    async createTipoUnidadMedida(@Param('idTipoUnidad', ParseIntPipe) idTipoUnidad: number,@Body() createUnidadMedidaDto: CreateUnidadMedidaDto,) {
    return this.unidadesMedidaService.asociarUnidadATipo(idTipoUnidad, createUnidadMedidaDto);
  }

}
