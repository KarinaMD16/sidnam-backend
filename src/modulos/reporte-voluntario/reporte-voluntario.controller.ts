import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ReporteVoluntarioService } from "./reporte-voluntario.service";
import { CreateReporteVoluntarioDto } from "./dto/create-reporte-voluntario.dto";
import { ResponseReporteVoluntarioDto } from "./dto/response-reporte-voluntario.dto";


@Controller('reporte-voluntario')
export class ReporteVoluntarioController {
  constructor(private readonly reporteVoluntarioService: ReporteVoluntarioService) {}

  @Post()
  async create(
    @Body() createReporteVoluntarioDto: CreateReporteVoluntarioDto
  ): Promise<ResponseReporteVoluntarioDto> {
    return this.reporteVoluntarioService.create(createReporteVoluntarioDto);
  }


  @Get()
async findAll(): Promise<ResponseReporteVoluntarioDto[]> {
  return this.reporteVoluntarioService.findAll();
}

 @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateVoluntarioDto: CreateReporteVoluntarioDto) {
      return this.reporteVoluntarioService.update(id, updateVoluntarioDto);
    }

}

