import { Module } from '@nestjs/common';
import { FacturasProveedoresController } from './facturas-proveedores.controller';
import { FacturasProveedoresService } from './facturas-proveedores.service';
import { Type } from 'class-transformer';
import { Area } from './entities/area.entity';
import { Proveedor } from './entities/proveedor.entity';
import { Factura } from './entities/factura.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteFacturaService } from './reporte/reporteFacturas.service';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Proveedor, Area])],
  controllers: [FacturasProveedoresController],
  providers: [FacturasProveedoresService, ReporteFacturaService, PdfHtmlService]
})
export class FacturasProveedoresModule {}
