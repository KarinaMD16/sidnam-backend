// src/modulos/inventarios/services/reporteInventario.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Entrada } from '../entities/entrada.entity';
import { Salida } from '../entities/salida.entity';
import { ReporteMovimientosDto } from '../dto/reporteMovimientosDto';
import { getCategoriasId } from 'src/common/enums/categoriasPrincipalesProductos.enum';
import { buildStandardPdfHtml, capitalizePdfText, escapePdfHtml } from 'src/common/utils/pdfReportTemplate';

@Injectable()
export class ReportesInventarioService {
  constructor(
    @InjectRepository(Entrada) private readonly entradaRepo: Repository<Entrada>,
    @InjectRepository(Salida)  private readonly salidaRepo:  Repository<Salida>,
    private readonly pdfHtml: PdfHtmlService,
  ) {}

  async generarReporteEntradas(q: ReporteMovimientosDto, res: ExpressResponse) {
    this.validar(q);

    const { anio, mes, categoriaId } = q;
    const inicio = new Date(anio, mes - 1, 1);
    const fin    = new Date(anio, mes, 1);

    const categoriaTipo = getCategoriasId(Number(categoriaId));
    if (!categoriaTipo) throw new BadRequestException(`Categoría inválida: ${categoriaId}`);

    const rows = await this.entradaRepo
      .createQueryBuilder('e')
      .innerJoin('e.inventario', 'inv')
      .innerJoin('inv.producto', 'p')
      .leftJoin('inv.unidad_medida', 'um')
      .where('e.fechaEntrada >= :inicio AND e.fechaEntrada < :fin', { inicio, fin })
      .andWhere('p.categoriaTipo = :categoriaTipo', { categoriaTipo })
      .select('e.id', 'entrada_id')
      .addSelect("DATE_FORMAT(e.fechaEntrada, '%Y-%m-%d %H:%i')", 'fecha')
      .addSelect('e.cantidad', 'cantidad')
      .addSelect('p.codigo', 'codigo_producto')
      .addSelect('p.nombre', 'nombre')
      .addSelect('um.nombre', 'unidad_nombre')
      .addSelect('um.abreviatura', 'unidad_abreviatura')
      .orderBy('e.fechaEntrada', 'DESC')
      .addOrderBy('e.id', 'DESC')
      .getRawMany<{
        entrada_id: number;
        fecha: string;
        cantidad: number;
        codigo_producto: string;
        nombre: string;
        unidad_nombre: string | null;
        unidad_abreviatura: string | null;
      }>();

    if (!rows.length) {
      throw new NotFoundException('No hay entradas para el criterio indicado.');
    }

    const html = this.buildHtmlTabla({
      titulo: 'Reporte de Entradas',
      anio, mes, 
      columnas: ['Fecha', 'Código', 'Nombre', 'Unidad', 'Cantidad'],
      filas: rows.map(r => [
        r.fecha,
        r.codigo_producto,
        r.nombre,
        (r.unidad_nombre || r.unidad_abreviatura)
          ? `${r.unidad_nombre ?? ''} (${r.unidad_abreviatura ?? ''})`
          : '—',
        String(r.cantidad),
      ]),
      totalRegistros: rows.length,
    });

    
    const mesTexto = new Date(anio, mes - 1).toLocaleString('es-CR', { month: 'long' });
    const filename = `Reporte_Entradas_${this.capitalize(mesTexto)}_${anio}.pdf`;

    await this.pdfHtml.generarDesdeHtml(html, res, {
      filename,
      waitUntil: 'networkidle0',
      ensureAssets: true,
      disposition: 'attachment',
    });
  }


  async generarReporteSalidas(q: ReporteMovimientosDto, res: ExpressResponse) {
    this.validar(q);

    const { anio, mes, categoriaId } = q;
    const inicio = new Date(anio, mes - 1, 1);
    const fin    = new Date(anio, mes, 1);

    const categoriaTipo = getCategoriasId(Number(categoriaId));
    if (!categoriaTipo) throw new BadRequestException(`Categoría inválida: ${categoriaId}`);

    const rows = await this.salidaRepo
      .createQueryBuilder('s')
      .innerJoin('s.inventario', 'inv')
      .innerJoin('inv.producto', 'p')
      .leftJoin('inv.unidad_medida', 'um')
      .where('s.fechaSalida >= :inicio AND s.fechaSalida < :fin', { inicio, fin })
      .andWhere('p.categoriaTipo = :categoriaTipo', { categoriaTipo })
      .select('s.id', 'salida_id')
      .addSelect("DATE_FORMAT(s.fechaSalida, '%Y-%m-%d %H:%i')", 'fecha')
      .addSelect('s.cantidad', 'cantidad')
      .addSelect('p.codigo', 'codigo_producto')
      .addSelect('p.nombre', 'nombre')
      .addSelect('um.nombre', 'unidad_nombre')
      .addSelect('um.abreviatura', 'unidad_abreviatura')
      .orderBy('s.fechaSalida', 'DESC')
      .addOrderBy('s.id', 'DESC')
      .getRawMany<{
        salida_id: number;
        fecha: string;
        cantidad: number;
        codigo_producto: string;
        nombre: string;
        unidad_nombre: string | null;
        unidad_abreviatura: string | null;
      }>();

    if (!rows.length) {
      throw new NotFoundException('No hay salidas para el criterio indicado.');
    }

    const html = this.buildHtmlTabla({
      titulo: 'Reporte de Salidas',
      anio, mes,
      columnas: ['Fecha', 'Código', 'Nombre', 'Unidad', 'Cantidad'],
      filas: rows.map(r => [
        r.fecha,
        r.codigo_producto,
        r.nombre,
        (r.unidad_nombre || r.unidad_abreviatura)
          ? `${r.unidad_nombre ?? ''} (${r.unidad_abreviatura ?? ''})`
          : '—',
        String(r.cantidad),
      ]),
      totalRegistros: rows.length,
    });

    const mesTexto = new Date(anio, mes - 1).toLocaleString('es-CR', { month: 'long' });
    const filename = `Reporte_Salidas_${this.capitalize(mesTexto)}_${anio}.pdf`;

    await this.pdfHtml.generarDesdeHtml(html, res, {
      filename,
      waitUntil: 'networkidle0',
      ensureAssets: true,
      disposition: 'attachment',
    });
  }

  //Helpers 

  private validar(q: ReporteMovimientosDto) {
    const { anio, mes, categoriaId } = q;
    if (!categoriaId) throw new BadRequestException('categoriaId es requerido');
    if (mes < 1 || mes > 12) throw new BadRequestException('Mes inválido (1-12)');
    if (anio < 2000 || anio > 2100) throw new BadRequestException('Año inválido');
  }

  private capitalize(s: string) {
    return capitalizePdfText(s);
  }

  private buildHtmlTabla(params: {
    titulo: string;
    anio: number; mes: number;
    columnas: string[]; filas: string[][]; totalRegistros: number;
  }) {
    const { titulo, anio, mes, columnas, filas, totalRegistros } = params;

    const mesNombre = new Date(anio, mes - 1)
      .toLocaleString('es-CR', { month: 'long', year: 'numeric' });

    const head = columnas.map(c => `<th>${escapePdfHtml(c)}</th>`).join('');
    const body = filas.length
      ? filas.map(r => `<tr>${r.map(v => `<td>${escapePdfHtml(v)}</td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${columnas.length}" style="text-align:center;color:#777">Sin registros</td></tr>`;

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
