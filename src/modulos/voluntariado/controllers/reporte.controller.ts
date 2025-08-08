// src/modulos/voluntariado/controllers/reporte.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReporteService } from '../services/reporte.service';

@Controller('reporte')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get(':id/pdf')
    async generarPdf(@Param('id') id: string, @Res() res: Response) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
        res.status(400).send('ID inválido');
        return;
    }
    await this.reporteService.generarReporteActividades(idNum, res);
 }
}
