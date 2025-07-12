import { Controller, Post, Body } from '@nestjs/common';
import { ReporteDonacionService } from './reporte-donacion.service';
import { CreateReporteDonacionDto } from './dto/create-reporte-donacion.dto';
import { ResponseReporteDonacionDto } from './dto/response-reporte-donacion.dto';

@Controller('reporte-donacion')
export class ReporteDonacionController {
  constructor(private readonly reporteDonacionService: ReporteDonacionService) {}

  @Post()
  async create(
    @Body() createReporteDonacionDto: CreateReporteDonacionDto
  ): Promise<ResponseReporteDonacionDto> {
    return this.reporteDonacionService.create(createReporteDonacionDto);
  }
}