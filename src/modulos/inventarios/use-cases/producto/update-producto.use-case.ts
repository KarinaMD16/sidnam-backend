import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Categoria_Producto } from "../../entities/categoriaProducto.entity";
import { Inventario } from "../../entities/inventario.entity";
import { PatchEditarInventarioDto } from "../../dto/actualizarInventarioDto";


export class UpdateProductoUseCase {
    constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Categoria_Producto)
        private readonly categoriaProducto: Repository<Categoria_Producto>,

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

    ){}

    async updateArchivadoProducto(inventarioId: number) {
      const inventario = await this.inventarioRepository.findOne({
        where: { id: inventarioId },
        relations: { producto: true },
        select: { id: true,  producto: { id: true, archivado: true } },
     });
     if (!inventario) throw new NotFoundException('Inventario no encontrado');

     const pasaAArchivado = !inventario.producto.archivado;

     if (pasaAArchivado) {
    
     await this.inventarioRepository.update(inventario.id, { stock: 0 });

    
     await this.productoRepository.update(inventario.producto.id, { archivado: true });

      return {
        message: 'Producto archivado y stock puesto a 0',
        productoId: inventario.producto.id,
        inventarioId: inventario.id,
        archivado: true,
        stock: 0,
      };
    } else {
    
      await this.productoRepository.update(inventario.producto.id, { archivado: false });
      return {
        message: 'Producto desarchivado',
        productoId: inventario.producto.id,
        inventarioId: inventario.id,
        archivado: false,
      };
    }
  }


   async updateInventario(inventarioId: number, dto: PatchEditarInventarioDto): Promise<{ message: string }> {
       const inventario = await this.inventarioRepository.findOne({
         where: { id: inventarioId },
         relations: { producto: true },
       });
        if (!inventario) throw new NotFoundException('Inventario no encontrado');

    
        if (
         dto.stock === undefined &&
         dto.nombre === undefined &&
         dto.codigo === undefined &&
         dto.unidadMedida === undefined
        ) {
         throw new BadRequestException('No hay campos para actualizar');
       }

   
       let touchedInv = false;
       let touchedProd = false;

       if (dto.stock !== undefined) {
          inventario.stock = dto.stock; 
          touchedInv = true;
       }

       if (dto.nombre !== undefined) {
          inventario.producto.nombre = dto.nombre;
          touchedProd = true;
       }

       if (dto.codigo !== undefined) {
          inventario.producto.codigo = dto.codigo;
          touchedProd = true;
       }

       if (dto.unidadMedida !== undefined) {
          inventario.producto.unidadMedida = dto.unidadMedida;
          touchedProd = true;
       }

    
       if (touchedProd){ 
        await this.productoRepository.save(inventario.producto);
       }

       if (touchedInv){
         await this.inventarioRepository.save(inventario);
       }
       
          return { message: 'Inventario y/o producto actualizados exitosamente' };
      }

}