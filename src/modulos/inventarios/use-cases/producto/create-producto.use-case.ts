import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { DeepPartial, Repository } from "typeorm";
import { ProductoDto } from "../../dto/crearProductoDto";
import { Inventario } from "../../entities/inventario.entity";
import { Unidad_Medida } from "src/modulos/unidades-medida/entities/unidadMedida.entity";
import { Subcategoria_Producto } from "../../entities/subCategoriaProducto.entity";
import { getCategoriasId } from "src/common/enums/categoriasPrincipalesProductos.enum";
import { uploadBufferToCloudinary } from "src/common/services/cloudinary-buffer.service";


@Injectable()
export class CreateProductoUseCase {
  constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

        @InjectRepository(Unidad_Medida)
        private readonly unidadMedidaRepository: Repository<Unidad_Medida>,

        @InjectRepository(Subcategoria_Producto)
        private readonly subCategoriaProductoRepository: Repository<Subcategoria_Producto>

  ){}


    async crearProducto(producto: ProductoDto, file?: Express.Multer.File): Promise<Producto>{

    
       const categoriaId = Number(producto.categoriaId);
  
        const categoriaTipo = getCategoriasId(categoriaId);
        if (!categoriaTipo) {
           throw new BadRequestException(`Categoría inválida: ${producto.categoriaId}` );
          }

          const codigoExistente = await this.productoRepository.findOne({
            where: { codigo: producto.codigo },
          });
          if (codigoExistente) {
             throw new BadRequestException(`Ya existe un producto con el código ${producto.codigo}`);
          }

       let subcategoria: Subcategoria_Producto | null = null;
       if (producto.subcategoriaId !== undefined) {
       subcategoria = await this.subCategoriaProductoRepository.findOne({ where: { id: producto.subcategoriaId }});

       if (!subcategoria) throw new NotFoundException(`Subcategoría ${producto.subcategoriaId} no encontrada`);
      }

       const unidadMedida = await this.unidadMedidaRepository.findOne({
            where: { id_unidad: producto.unidadMedida },
       });

       
        if (!unidadMedida) {
                throw new NotFoundException(`Unidad de medida con el id ${producto.unidadMedida} no encontrada`,
         );
       }

       let imagen_url: string | null = null;
       if (file){
        const {secure_url} = await uploadBufferToCloudinary(
          file.buffer,
          'inventario/productos',
        );
        imagen_url = secure_url;
       }

       const crearProducto = this.productoRepository.create({
           nombre: producto.nombre,
           codigo: producto.codigo,
           categoriaTipo,
           subcategoria: subcategoria ?? null,
          imagen_url,

       }as DeepPartial<Producto>);

        const productoCreado = await this.productoRepository.save(crearProducto);

        const inventario = this.inventarioRepository.create({
          stock: 0,
          producto: productoCreado,
          unidad_medida: unidadMedida,
          
        } as DeepPartial<Inventario>);

        await this.inventarioRepository.save(inventario);

        return productoCreado;

    }

}