import { Controller, Get } from '@nestjs/common';
import { UnidadesMedidaService } from './unidades-medida.service';

@Controller('unidades-medida')
export class UnidadesMedidaController {
  constructor(
    private readonly unidadesMedidaService: UnidadesMedidaService,
  ) {}

  @Get()
  async getTipoUnidadesMedida() {
    return this.unidadesMedidaService.getTipoUnidadesMedida();
  }
}
