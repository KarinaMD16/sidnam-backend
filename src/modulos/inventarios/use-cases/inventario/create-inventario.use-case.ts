import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { Inventario } from "../../entities/inventario.entity";
import { CrearInventarioDto } from "../../dto/crearInventarioDto";


@Injectable()
export class CreateInventarioUseCase {

    constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

    ) {}

    async crearInventario(dto: CrearInventarioDto) {
       const producto = await this.productoRepository.findOne({ where: { id: dto.productoId } });
       if (!producto) throw new NotFoundException('Producto no encontrado');

       const inventario = this.inventarioRepository.create({ stock: dto.stock, producto });
       return this.inventarioRepository.save(inventario);
    }
}
  