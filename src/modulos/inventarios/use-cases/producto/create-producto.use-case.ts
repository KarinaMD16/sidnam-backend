import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { Categoria_Producto } from "../../entities/categoriaProducto.entity";
import { ProductoDto } from "../../dto/crearProductoDto";
import { Inventario } from "../../entities/inventario.entity";
import { Unidad_Medida } from "src/modulos/unidades-medida/entities/unidadMedida.entity";


@Injectable()
export class CreateProductoUseCase {
  constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Categoria_Producto)
        private readonly categoriaProducto: Repository<Categoria_Producto>,

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

        @InjectRepository(Unidad_Medida)
        private readonly unidadMedidaRepository: Repository<Unidad_Medida>

  ){}


    async crearProducto(producto: ProductoDto): Promise<Producto>{

        const categoria = await this.categoriaProducto.findOne({
             where: {id: producto.categoriaProducto},
        });
           
        if(!categoria){
             throw new NotFoundException(`Categoria con el id ${producto.categoriaProducto} no encontrada`);
       }

       const unidadMedida = await this.unidadMedidaRepository.findOne({
            where: { id_unidad: producto.unidadMedida },
       });

       
        if (!unidadMedida) {
                throw new NotFoundException(`Unidad de medida con el id ${producto.unidadMedida} no encontrada`,
         );
       }


       const crearProducto = this.productoRepository.create({
           nombre: producto.nombre,
           codigo: producto.codigo,
           categoria,
       })

        const productoCreado = await this.productoRepository.save(crearProducto);

        const inventario = this.inventarioRepository.create({
          stock: 0,
          producto: productoCreado,
          unidad_medida: unidadMedida,
        });
        await this.inventarioRepository.save(inventario);

        return productoCreado;

    }

}