import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Expediente_Residente } from '../residentes/entities/expedientes.entity';
import { Patologias } from '../residentes/entities/patologias.entity';
import { Administraciones } from '../residentes/entities/administraciones.entity';
import { AdministracionesEspeciales } from '../residentes/entities/administracionEspecial.entity';

@Injectable()
export class ReporteExpedienteService {
  constructor(
    @InjectRepository(Expediente_Residente)
    private readonly expedienteRepository: Repository<Expediente_Residente>,

    @InjectRepository(Patologias)
    private readonly patologiasRepository: Repository<Patologias>,

    @InjectRepository(Administraciones)
    private readonly administracionRepository: Repository<Administraciones>,

    @InjectRepository(AdministracionesEspeciales)
    private readonly administracionEspecialRepository: Repository<AdministracionesEspeciales>,

    private readonly pdfHtmlService: PdfHtmlService,
  ) {}

  async generarPdfExpediente(expedienteId: number, res: ExpressResponse) {

    const expediente = await this.expedienteRepository.findOne({
      where: { id_expediente: expedienteId },
      relations: ['residente'],
    });

    if (!expediente) throw new NotFoundException('Expediente no encontrado');


    const patologias = await this.patologiasRepository
      .createQueryBuilder('p')
      .leftJoin('p.expedientes', 'e')
      .where('e.id_expediente = :id', { id: expedienteId })
      .orderBy('p.nombre', 'ASC')
      .getMany();

    const administraciones = await this.administracionRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.administracionMedicamentos', 'am')
      .leftJoinAndSelect('am.medicamento', 'm')
      .leftJoinAndSelect('am.unidad', 'u')
      .where('a.expediente = :id', { id: expedienteId })
      .orderBy('a.turno', 'ASC')
      .getMany();

 
    const administracionesEspeciales = await this.administracionEspecialRepository
      .createQueryBuilder('ae')
      .leftJoinAndSelect('ae.medicamento', 'm')
      .leftJoinAndSelect('ae.unidad', 'u')
      .where('ae.expediente = :id', { id: expedienteId })
      .orderBy('ae.hora', 'ASC')
      .getMany();


    const html = this.generarHtmlExpediente(
      expediente,
      patologias,
      administraciones,
      administracionesEspeciales,
    );

   
    await this.pdfHtmlService.generarDesdeHtml(html, res, {
      filename: `Expediente_${expediente.residente.nombre}.pdf`,
      disposition: 'attachment',
      ensureAssets: true,
      waitUntil: 'networkidle0',
    });
  }

  private generarHtmlExpediente(
    expediente: Expediente_Residente,
    patologias: Patologias[],
    administraciones: Administraciones[],
    administracionesEspeciales: AdministracionesEspeciales[],
  ): string {
    const residente = expediente.residente;
    const fechaHoy = new Date().toLocaleDateString('es-CR');

    return `
    <html>
      <head>
        <meta charset="UTF-8"/>
        <style>
          :root { --accent:#A7074D; --text:#111; --muted:#555; --border:#d5d5d5; --bg-alt:#f7f7f7; }
          body { font-family: Arial, Helvetica, sans-serif; color: var(--text); padding: 24px; font-size:12px; }
          h1,h2,h3 { margin:0; color: var(--accent); }
          h2 { margin-top:16px; font-size:16px; }
          table { width:100%; border-collapse: collapse; margin-top:8px; }
          th, td { border:1px solid var(--border); padding:6px 8px; }
          th { background: var(--accent); color:#fff; text-align:left; }
          tbody tr:nth-child(even){background:var(--bg-alt);}
          .section{margin-top:24px;}
          .logo{width:96px; height:96px; object-fit:cover; border-radius:50%;}
        </style>
      </head>
      <body>
        <div style="display:flex;align-items:center;margin-bottom:16px;">
          <img class="logo" src="https://i.ibb.co/HDfRP6fX/1749848069832.png" alt="logo"/>
          <div style="margin-left:16px;">
            <h1>Expediente del Residente</h1>
            <div style="color:var(--muted); font-size:14px;">Fecha de reporte: ${fechaHoy}</div>
          </div>
        </div>

        <div class="section">
          <h2>Información del Residente</h2>
          <table>
            <tr><th>Nombre completo</th><td>${residente.nombre} ${residente.apellido1} ${residente.apellido2 || ''}</td></tr>
            <tr><th>Cédula</th><td>${residente.cedula}</td></tr>
            <tr><th>Sexo</th><td>${residente.sexo}</td></tr>
            <tr><th>Edad</th><td>${residente.edad}</td></tr>
            <tr><th>Estado Civil</th><td>${residente.estado_civil}</td></tr>
            <tr><th>Dependencia</th><td>${residente.dependencia}</td></tr>
            <tr><th>Estado expediente</th><td>${expediente.estado}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Patologías</h2>
          <table>
            <thead><tr><th>#</th><th>Nombre</th></tr></thead>
            <tbody>
              ${patologias.map((p,i) => `<tr><td>${i+1}</td><td>${p.nombre}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Administraciones</h2>
          ${administraciones.map((adm,i) => `
            <h3>Turno: ${adm.turno}</h3>
            <table>
              <thead><tr><th>#</th><th>Medicamento</th><th>Cantidad</th><th>Unidad</th></tr></thead>
              <tbody>
                ${adm.administracionMedicamentos.map((m,j) => `
                  <tr>
                    <td>${j+1}</td>
                    <td>${m.medicamento.nombre}</td>
                    <td>${m.cantidad}</td>
                    <td>${m.unidad.abreviatura}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          `).join('')}
        </div>

        <div class="section">
          <h2>Administraciones Especiales</h2>
          <table>
            <thead><tr><th>#</th><th>Hora</th><th>Medicamento</th><th>Cantidad</th><th>Unidad</th></tr></thead>
            <tbody>
              ${administracionesEspeciales.map((ae,i) => `
                <tr>
                  <td>${i+1}</td>
                  <td>${ae.hora}</td>
                  <td>${ae.medicamento.nombre}</td>
                  <td>${ae.cantidad}</td>
                  <td>${ae.unidad.abreviatura}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </body>
    </html>
    `;
  }
}
