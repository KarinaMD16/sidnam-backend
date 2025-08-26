import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { ActualizarProductoDto } from "../../dto/actualizarProductoDto";
import { NotFoundException } from "@nestjs/common";
import { Categoria_Producto } from "../../entities/categoriaProducto.entity";
import { Inventario } from "../../entities/inventario.entity";


export class UpdateProductoUseCase {
    constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Categoria_Producto)
        private readonly categoriaProducto: Repository<Categoria_Producto>,

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

    ){}

    
    async updateProducto(idProducto: number, actualizarProducto: Partial<ActualizarProductoDto>): Promise<{ message: string }> {

        const producto = await this.productoRepository.findOne({
          where: { id: idProducto },
        });

        if (!producto) {
           throw new NotFoundException('Producto no encontrado');
        }
  
        if (actualizarProducto.categoriaProducto !== undefined) {
            const categoria = await this.categoriaProducto.findOne({
            where: { id: actualizarProducto.categoriaProducto },
        });

        if (!categoria) {
           throw new NotFoundException(`Categoría con id ${actualizarProducto.categoriaProducto} no encontrada`);
        }
        producto.categoria = categoria;
        }

  
        if (actualizarProducto.nombre) producto.nombre = actualizarProducto.nombre;
        if (actualizarProducto.codigo) producto.codigo = actualizarProducto.codigo;
        if (actualizarProducto.archivado !== undefined) producto.archivado = actualizarProducto.archivado;
        if (actualizarProducto.unidadMedida) producto.unidadMedida = actualizarProducto.unidadMedida;

        await this.productoRepository.save(producto);

        return { message: 'Producto actualizado exitosamente' };
    }

    async updateArchivadoProducto(inventarioId: number) {
      const inventario = await this.inventarioRepository.findOne({
        where: { id: inventarioId },
        relations: { producto: true },
        select: { id: true, producto: { id: true, archivado: true } },
      });
      if (!inventario) throw new NotFoundException('Inventario no encontrado');

      const valorArchivado = !inventario.producto.archivado;
      await this.productoRepository.update(inventario.producto.id, { archivado: valorArchivado });

      return {
        message: valorArchivado ? 'Producto archivado' : 'Producto desarchivado',
        productoId: inventario.producto.id,
        archivado: valorArchivado,
     };
   }
    
}