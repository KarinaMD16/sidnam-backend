import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './services/inventario.service';
import { InventarioController } from './controllers/inventario.controller';
import { Categoria_Producto } from './entities/categoriaProducto.entity';
import { Producto } from './entities/producto.entity';
import { CreateProductoUseCase } from './use-cases/producto/create-producto.use-case';
import { GetProductosUseCase } from './use-cases/producto/get-producto.use-case';
import { UpdateProductoUseCase } from './use-cases/producto/update-producto.use-case';
import { DeleteProductoUseCase } from './use-cases/producto/delete-producto.use-case';
import { GetInventarioUseCase } from './use-cases/inventario/get-inventario.use-case';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioUseCase } from './use-cases/inventario/create-inventario.use-case';
import { Entrada } from './entities/entrada.entity';
import { Salida } from './entities/salida.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria_Producto, Producto, Inventario, Entrada, Salida]),
    ],
  providers: [InventarioService, CreateProductoUseCase, GetProductosUseCase, UpdateProductoUseCase, DeleteProductoUseCase, GetInventarioUseCase, CreateInventarioUseCase],
  controllers: [InventarioController]
})
export class InventarioModule {}