import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './services/inventario.service';
import { InventarioController } from './controllers/inventario.controller';
import { Categoria_Producto } from './entities/categoriaProducto.entity';
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



@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria_Producto, Producto, Inventario, Entrada, Salida, Unidad_Medida]),
    ],
  providers: [InventarioService, CreateProductoUseCase, GetProductosUseCase, UpdateProductoUseCase, GetInventarioUseCase, CreateEntradaUseCase, GetEntradaUseCase],
  controllers: [InventarioController]
})
export class InventarioModule {}