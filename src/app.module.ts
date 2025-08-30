import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './modulos/publicaciones/publicaciones.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donacion } from './modulos/publicaciones/entities/donacion.entity';
import { Eventos } from './modulos/publicaciones/entities/eventos.entity';
import { Proyectos } from './modulos/publicaciones/entities/proyectos.entity';
import { GaleriaModule } from './modulos/galeria/galeria.module';
import { Galeria } from './modulos/galeria/entities/galeria.entity';
import { Categoria } from './modulos/galeria/entities/categoria.entity';
import { GestionUsuarioModule } from './modulos/gestion-usuario/gestion-usuario.module';
import { Usuario } from './modulos/gestion-usuario/entities/usuario.entity';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';
import { ConfigModule } from '@nestjs/config';
import { VoluntariadoModule } from './modulos/voluntariado/voluntariado.module';
import { Contacto_emergencia } from './modulos/voluntariado/entities/contactoEmergencia.entity';
import { Horario } from './modulos/voluntariado/entities/horario.entity';
import { SolicitudAprobada } from './modulos/voluntariado/entities/solicitudAprobada.entity';
import { SolicitudPendiente } from "./modulos/voluntariado/entities/solicitudPendiente.entity";
import { ContactoEmergenciaPendiente } from "./modulos/voluntariado/entities/contactoEmergenciaPendiente";
import { HorarioPendiente } from "./modulos/voluntariado/entities/horarioPendiente.entity";
import { Voluntario } from './modulos/voluntariado/entities/voluntariado.entity';
import { Tipo_voluntariado } from './modulos/voluntariado/entities/tipoVoluntariado.entity';
import { Actividades } from './modulos/voluntariado/entities/actividades.entity';
import { SolicitudDonacionModule } from './modulos/solicitud-donacion/solicitudDonacion.module';
import { Donador } from './modulos/solicitud-donacion/entities/donador.entity';
import { RegistroDonacion } from './modulos/solicitud-donacion/entities/registroDonacion.entity';
import { Solicitud_donacion_pendiente } from './modulos/solicitud-donacion/entities/solicitudDonacionPendiente.entity';
import { ResidentesModule } from './modulos/residentes/residentes.module';
import * as dotenv from "dotenv";
import { Expediente_Residente } from './modulos/residentes/entities/expedientes.entity';
import { Residente } from './modulos/residentes/entities/residente.entity';
import { Encargado } from './modulos/residentes/entities/encargado.entity';
import { InventarioModule } from './modulos/inventarios/inventario.module';
import { Categoria_Producto } from './modulos/inventarios/entities/categoriaProducto.entity';
import { Producto } from './modulos/inventarios/entities/producto.entity';
import { Inventario } from './modulos/inventarios/entities/inventario.entity';
import { Entrada } from './modulos/inventarios/entities/entrada.entity';
import { Salida } from './modulos/inventarios/entities/salida.entity';
import { Patologias } from './modulos/residentes/entities/patologias.entity';
import { Administraciones } from './modulos/residentes/entities/administraciones.entity';
import { Medicamentos } from './modulos/residentes/entities/medicamento.entity';
import { Tipo_medicamento } from './modulos/residentes/entities/tipo_medicamento.entity';
import { AdministracionesEspeciales } from './modulos/residentes/entities/administracionEspecial.entity';
import { NotaEnfermeria } from './modulos/residentes/entities/NotaEnfermeria.entity';
import { Curaciones } from './modulos/residentes/entities/curaciones.entity';
import { Consulta_Ebais } from './modulos/residentes/entities/consultaEbais.entity';
import { Consulta_Especialista } from './modulos/residentes/entities/consultaEspecialista.entity';
import { Tipo_Consulta } from './modulos/residentes/entities/tipoConsulta.entity';
import { Unidad_Medida } from './modulos/residentes/entities/unidadMedida.entity';
import { UnidadesMedidaModule } from './modulos/unidades-medida/unidades-medida.module';
import { AdministracionMedicamento } from './modulos/residentes/entities/administracioneMedicamento';




dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PublicacionesModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        Donacion,
        Eventos,
        Proyectos,
        Galeria,
        Categoria,
        Usuario,
        Contacto_emergencia,
        ContactoEmergenciaPendiente,
        Horario,
        HorarioPendiente,
        SolicitudAprobada,
        SolicitudPendiente,
        Voluntario,
        Tipo_voluntariado,
        Actividades,
        Donador,
        RegistroDonacion, 
        Solicitud_donacion_pendiente,
        Residente, 
        Expediente_Residente, 
        Encargado,
        Categoria_Producto,
        Producto,
        Inventario,
        Entrada,
        Salida,
        Patologias,
        Administraciones,
        Medicamentos,
        Tipo_medicamento,
        AdministracionesEspeciales,
        NotaEnfermeria,
        Curaciones,
        Consulta_Ebais,
        Consulta_Especialista,
        Tipo_Consulta,
        Unidad_Medida,
        AdministracionMedicamento
      ],
      synchronize: true,
      dropSchema: false,
    }),
    GaleriaModule,
    GestionUsuarioModule,
    AutenticacionModule,
    VoluntariadoModule,
    SolicitudDonacionModule,
    ResidentesModule,
    InventarioModule,
    UnidadesMedidaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
