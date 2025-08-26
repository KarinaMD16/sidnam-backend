import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { Categoria_Producto } from "../../entities/categoriaProducto.entity";
import { ProductoDto } from "../../dto/crearProductoDto";


@Injectable()
export class CreateProductoUseCase {
  constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Categoria_Producto)
        private readonly categoriaProducto: Repository<Categoria_Producto>,

  ){}


    async crearProducto(producto: ProductoDto): Promise<Producto>{

        const categoria = await this.categoriaProducto.findOne({
             where: {id: producto.categoriaProducto},
        });
           
        if(!categoria){
             throw new NotFoundException(`Categoria con el id ${producto.categoriaProducto} no encontrada`);
       }


       const crearProducto = this.productoRepository.create({
           nombre: producto.nombre,
           codigo: producto.codigo,
           archivado: producto.archivado,
           unidadMedida: producto.unidadMedida,
           categoria,
       })

        const productoCreado = await this.productoRepository.save(crearProducto);

        return productoCreado;

    }

}