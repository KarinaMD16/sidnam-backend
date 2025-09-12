import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './services/inventario.service';
import { InventarioController } from './controllers/inventario.controller';
import { Producto } from './entities/producto.entity';
import { CreateProductoUseCase } from './use-cases/producto/create-producto.use-case';
import { GetProductosUseCase } from './use-cases/producto/get-producto.use-case';
import { UpdateProductoUseCase } from './use-cases/producto/update-producto.use-case';
import { GetInventarioUseCase } from './use-cases/inventario/get-inventario.use-case';
import { Inventario } from './entities/inventario.entity';
import { Entrada } from './entities/entrada.entity';
import { Salida } from './entities/salida.entity';
import { CreateEntradaUseCase } from './use-cases/entrada/create-entrada.use-case';
import { Unidad_Medida } from '../unidades-medida/entities/unidadMedida.entity';
import { GetEntradaUseCase } from './use-cases/entrada/get-entrada.use-case';
import { CreateSalidaUseCase } from './use-cases/salida/create-salida.use-case';
import { GetSalidaUseCase } from './use-cases/salida/get-salida.use-case';
import { ReportesInventarioService } from './services/reporteInventario.service';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Subcategoria_Producto } from './entities/subCategoriaProducto.entity';
import { SubcategoriaUseCase } from './use-cases/subCategoria/subCategoria.use-case';
import { EntradaMedicamento } from './entities/entradaMedicamento.entity';
import { CreateEntradaMedicamentoUseCase } from './use-cases/entradaMedicamentos/create-entradaMedicamento.use-case';
import { GetEntradaMedicamentoUseCase } from './use-cases/entradaMedicamentos/get-entradaMedicamento.use-case';
import { ReporteEntradaMedicamentoService } from './services/reporteEntradaMedicamentos.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Inventario, Entrada, Salida, Unidad_Medida, Subcategoria_Producto, EntradaMedicamento]),
    ],
  providers: [InventarioService, CreateProductoUseCase, GetProductosUseCase, UpdateProductoUseCase, GetInventarioUseCase, CreateEntradaUseCase, GetEntradaUseCase, CreateSalidaUseCase, GetSalidaUseCase, ReportesInventarioService, PdfHtmlService, SubcategoriaUseCase, CreateEntradaMedicamentoUseCase, GetEntradaMedicamentoUseCase, ReporteEntradaMedicamentoService],
  controllers: [InventarioController]
})
export class InventarioModule {}