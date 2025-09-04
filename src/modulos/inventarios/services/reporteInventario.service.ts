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

  private pad2(n: number) { return String(n).padStart(2, '0'); }

  private esc(s: string) {
    return String(s)
      .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#39;');
  }

  private capitalize(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private buildHtmlTabla(params: {
    titulo: string;
    anio: number; mes: number;
    columnas: string[]; filas: string[][]; totalRegistros: number;
  }) {
    const { titulo, anio, mes, columnas, filas, totalRegistros } = params;

    const mesNombre = new Date(anio, mes - 1)
      .toLocaleString('es-CR', { month: 'long', year: 'numeric' });

    const head = columnas.map(c => `<th>${this.esc(c)}</th>`).join('');
    const body = filas.length
      ? filas.map(r => `<tr>${r.map(v => `<td>${this.esc(v)}</td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${columnas.length}" style="text-align:center;color:#777">Sin registros</td></tr>`;

    return `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  :root { --accent:#A7074D; --text:#111; --muted:#555; --border:#d5d5d5; --bg-alt:#f7f7f7; }
  body{font-family:Arial,Helvetica,sans-serif;font-size:12px;margin:24px;color:var(--text)}
  h1{margin:0 0 8px;font-size:28px}
  .heading{display:grid;grid-template-columns:96px 1fr;gap:16px;align-items:center;margin-bottom:6px}
  .logo{width:96px;height:96px;border-radius:50%;object-fit:cover;border:none;display:block}
  .meta{margin:0 0 12px;color:var(--muted)}
  table{width:100%;border-collapse:collapse;margin-top:10px}
  th,td{border:1px solid var(--border);padding:8px 10px;vertical-align:top}
  th{background:var(--accent);color:#fff;text-align:left}
  tbody tr:nth-child(even){background:var(--bg-alt)}
  @page { margin: 40px 30px; }
</style>
</head>
<body>
  <div class="heading">
    <img class="logo" src="https://i.ibb.co/HDfRP6fX/1749848069832.png" alt="logo"/>
    <div>
      <h1>${this.esc(titulo)}</h1>
      <div class="meta">Mes: <strong>${this.esc(this.capitalize(mesNombre))}</strong></div>
    </div>
  </div>

  <div style="margin:8px 0 14px 0;"><strong>Total registros:</strong> ${totalRegistros}</div>

  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table>
</body>
</html>`.trim();
  }
}
