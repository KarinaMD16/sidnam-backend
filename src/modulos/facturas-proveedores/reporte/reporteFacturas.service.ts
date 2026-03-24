import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Factura } from '../entities/factura.entity';
import { Estado_Factura } from 'src/common/enums/estadoFactura.enum';
import { buildStandardPdfHtml, capitalizePdfText, escapePdfHtml } from 'src/common/utils/pdfReportTemplate';

@Injectable()
export class ReporteFacturaService {
  constructor(
    @InjectRepository(Factura)

    private readonly facturaRepo: Repository<Factura>,
    private readonly pdfHtml: PdfHtmlService,
    
  ) {}

  async generarReporteFacturas(anio: number, mes: number, estado: number, res: ExpressResponse) {
  if (!anio || !mes) {
    throw new BadRequestException('Debe especificar año y mes.');
  }
  if (mes < 1 || mes > 12) {
    throw new BadRequestException('Mes inválido (1-12).');
  }

  const inicio = new Date(anio, mes - 1, 1, 0, 0, 0);
  const fin    = new Date(anio, mes, 1, 0, 0, 0);

  // base query
  let qb = this.facturaRepo
    .createQueryBuilder('f')
    .innerJoin('f.proveedor', 'p')
    .where('f.fecha_emitida >= :inicio AND f.fecha_emitida < :fin', { inicio, fin });

  // filtro por estado
  if (estado === 1) {
    qb = qb.andWhere('f.estado = :estado', { estado: Estado_Factura.pagada });
  } else if (estado === 2) {
    qb = qb.andWhere('f.estado = :estado', { estado: Estado_Factura.pendiente });
  }
  // si es 0 → no aplica filtro, quedan todas

  const rows = await qb
    .select('f.id_factura', 'factura_id')
    .addSelect('f.numero_factura', 'numero_factura')
    .addSelect("DATE_FORMAT(f.fecha_emitida, '%Y-%m-%d')", 'fecha_emision')
    .addSelect("DATE_FORMAT(f.fecha_pago, '%Y-%m-%d')", 'fecha_pago')
    .addSelect('f.monto', 'monto')
    .addSelect('f.estado', 'estado')
    .addSelect('p.nombre', 'proveedor_nombre')
    .orderBy('f.fecha_emitida', 'DESC')
    .addOrderBy('f.id_factura', 'DESC')
    .getRawMany<{
      factura_id: number;
      numero_factura: number;
      fecha_emision: string;
      fecha_pago: string;
      monto: number;
      estado: string;
      proveedor_nombre: string;
    }>();

  if (!rows.length) {
    throw new NotFoundException('No hay facturas en ese período.');
  }

  // 🔹 Para el encabezado dinámico
  let titulo = 'Reporte de Facturas';
  if (estado === 1) titulo = 'Reporte de Facturas Pagadas';
  else if (estado === 2) titulo = 'Reporte de Facturas Pendientes';

  const html = this.buildHtmlTabla({
    titulo,
    anio,
    mes,
    columnas: ['Número Factura', 'Proveedor', 'Fecha Emisión', 'Fecha Pago', 'Monto', 'Estado'],
    filas: rows.map(r => [
      String(r.numero_factura),
      r.proveedor_nombre,
      r.fecha_emision,
      r.fecha_pago,
      `₡ ${r.monto.toLocaleString()}`,
      r.estado,
    ]),
    totalRegistros: rows.length,
  });

  const mesTexto = new Date(anio, mes - 1).toLocaleString('es-CR', { month: 'long' });
  const filename = `Reporte_Facturas_${this.capitalize(mesTexto)}_${anio}.pdf`;

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
