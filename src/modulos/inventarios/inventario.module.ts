import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './services/inventario.service';
import { InventarioController } from './controllers/inventario.controller';
import { Categoria_Producto } from './entities/categoriaProducto.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria_Producto]),
    ],
  providers: [InventarioService],
  controllers: [InventarioController]
})
export class InventarioModule {}