import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Inventario } from "../../entities/inventario.entity";
import { PatchEditarInventarioDto } from "../../dto/actualizarInventarioDto";
import { Unidad_Medida } from "src/modulos/unidades-medida/entities/unidadMedida.entity";
import { Subcategoria_Producto } from "../../entities/subCategoriaProducto.entity";
import { getCategoriasId } from "src/common/enums/categoriasPrincipalesProductos.enum";
import { uploadBufferToCloudinary } from "src/common/services/cloudinary-buffer.service";


export class UpdateProductoUseCase {
  constructor(

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,

    @InjectRepository(Unidad_Medida)
    private readonly unidadMedidaRepository: Repository<Unidad_Medida>,

    @InjectRepository(Subcategoria_Producto)
    private readonly subCategoriaRepository: Repository<Subcategoria_Producto>

  ) { }

  async updateArchivadoProducto(inventarioId: number) {
    const inventario = await this.inventarioRepository.findOne({
      where: { id: inventarioId },
      relations: { producto: true },
      select: { id: true, producto: { id: true, archivado: true } },
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


  async updateInventario(inventarioId: number, dto: PatchEditarInventarioDto, file?: Express.Multer.File): Promise<{ message: string }> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id: inventarioId },
      relations: { producto: true },
    });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');


    if (inventario.producto.archivado) {
      throw new BadRequestException('No se puede editar un producto archivado.');
    }

    if (
      dto.nombre === undefined &&
      dto.codigo === undefined &&
      dto.unidadMedida === undefined &&
      dto.subcategoriaId === undefined &&
      !file
    ) {
      throw new BadRequestException('No hay campos para actualizar');
    }


    let touchedInv = false;
    let touchedProd = false;

    if (dto.unidadMedida !== undefined) {
      const um = await this.unidadMedidaRepository.findOne({
        where: { id_unidad: dto.unidadMedida },
      });
      if (!um) throw new NotFoundException('Unidad de medida no encontrada');
      inventario.unidad_medida = um;
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

    if (dto.categoriaId !== undefined) {
      const categoriaTipo = getCategoriasId(Number(dto.categoriaId));
      if (!categoriaTipo) {
        throw new BadRequestException(`Categoría inválida: ${dto.categoriaId}`);
      }
      inventario.producto.categoriaTipo = categoriaTipo;
      touchedProd = true;
    }

    if (dto.subcategoriaId !== undefined) {
      const sub = await this.subCategoriaRepository.findOne({
        where: { id: dto.subcategoriaId },
      });
      if (!sub) throw new NotFoundException('Subcategoría no encontrada');
      inventario.producto.subcategoria = sub;
      touchedProd = true;
    }

    if (file) {
      const { secure_url } = await uploadBufferToCloudinary(
        file.buffer,
        'inventario/productos'
      );

      inventario.producto.imagen_url = secure_url;
      touchedProd = true;
    }

    if (touchedProd) {
      await this.productoRepository.save(inventario.producto);
    }

    if (touchedInv) {
      await this.inventarioRepository.save(inventario);
    }

    return { message: 'Inventario y/o producto actualizados exitosamente' };
  }

}