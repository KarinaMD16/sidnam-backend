import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './services/inventario.service';
import { InventarioController } from './controllers/inventario.controller';



@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ],
  providers: [InventarioService],
  controllers: [InventarioController]
})
export class InventarioModule {}