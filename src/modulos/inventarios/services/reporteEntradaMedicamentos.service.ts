
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { EntradaMedicamento } from '../entities/entradaMedicamento.entity';
import { buildStandardPdfHtml, capitalizePdfText, escapePdfHtml } from 'src/common/utils/pdfReportTemplate';

@Injectable()
export class ReporteEntradaMedicamentoService {
  constructor(
    @InjectRepository(EntradaMedicamento)

    private readonly entradaMedRepo: Repository<EntradaMedicamento>,
    private readonly pdfHtml: PdfHtmlService,

  ) {}

  async generarReporteEntradasMedicamentos(anio: number, mes: number, res: ExpressResponse) {
    if (!anio || !mes) {
      throw new BadRequestException('Debe especificar año y mes.');
    }
    if (mes < 1 || mes > 12) {
      throw new BadRequestException('Mes inválido (1-12).');
    }

    const inicio = new Date(anio, mes - 1, 1, 0, 0, 0);
    const fin    = new Date(anio, mes, 1, 0, 0, 0);

    const rows = await this.entradaMedRepo
      .createQueryBuilder('em')
      .innerJoin('em.medicamento', 'm')
      .innerJoin('em.unidad_medida', 'um')
      .where('em.fechaEntrada >= :inicio AND em.fechaEntrada < :fin', { inicio, fin })
      .select('em.id', 'entrada_id')
      .addSelect("DATE_FORMAT(em.fechaEntrada, '%Y-%m-%d %H:%i')", 'fecha')
      .addSelect('em.cantidad', 'cantidad')
      .addSelect('m.nombre', 'medicamento_nombre')
      .addSelect('um.nombre', 'unidad_nombre')
      .addSelect('um.abreviatura', 'unidad_abreviatura')
      .orderBy('em.fechaEntrada', 'DESC')
      .addOrderBy('em.id', 'DESC')
      .getRawMany<{
        entrada_id: number;
        fecha: string;
        cantidad: number;
        medicamento_nombre: string;
        unidad_nombre: string;
        unidad_abreviatura: string;
      }>();

    if (!rows.length) {
      throw new NotFoundException('No hay entradas de medicamentos en ese período.');
    }

    const html = this.buildHtmlTabla({
      titulo: 'Reporte de Entradas de Medicamentos',
      anio,
      mes,
      columnas: ['Fecha', 'Nombre Medicamento', 'Unidad', 'Cantidad'],
      filas: rows.map(r => [
        r.fecha,
        r.medicamento_nombre,
        `${r.unidad_nombre} (${r.unidad_abreviatura})`,
        String(r.cantidad),
      ]),
      totalRegistros: rows.length,
    });

    const mesTexto = new Date(anio, mes - 1).toLocaleString('es-CR', { month: 'long' });
    const filename = `Reporte_Entradas_Medicamentos_${this.capitalize(mesTexto)}_${anio}.pdf`;

    await this.pdfHtml.generarDesdeHtml(html, res, {
      filename,
      waitUntil: 'networkidle0',
      ensureAssets: true,
      disposition: 'attachment',
    });
  }

  // helpers
  private capitalize(s: string) {
    return capitalizePdfText(s);
  }
  private buildHtmlTabla(params: {
    titulo: string; anio: number; mes: number;
    columnas: string[]; filas: string[][]; totalRegistros: number;
  }) {
    const { titulo, anio, mes, columnas, filas, totalRegistros } = params;
    const mesNombre = new Date(anio, mes - 1).toLocaleString('es-CR', { month: 'long', year: 'numeric' });

    const head = columnas.map(c => `<th>${escapePdfHtml(c)}</th>`).join('');
    const body = filas.map(r => `<tr>${r.map(v => `<td>${escapePdfHtml(v)}</td>`).join('')}</tr>`).join('');

    return buildStandardPdfHtml({
      title: titulo,
      metaLines: [
        `Mes: <strong>${escapePdfHtml(this.capitalize(mesNombre))}</strong>`,
        `Total registros: <strong>${totalRegistros}</strong>`,
      ],
      bodyHtml: `
        <table>
          <thead><tr>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      `,
    });
  }
}
