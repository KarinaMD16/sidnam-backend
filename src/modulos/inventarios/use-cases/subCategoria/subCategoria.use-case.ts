// use-cases/subcategoria/subcategoria.use-case.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Subcategoria_Producto } from '../../entities/subCategoriaProducto.entity';
import { CrearSubcategoriaDto } from '../../dto/crearSubCategoriaDto';

export class SubcategoriaUseCase {
  constructor(
    @InjectRepository(Subcategoria_Producto)
    private readonly subCategoriaProductoRepository: Repository<Subcategoria_Producto>,
  ) {}

  async crearSubCategoria(dto: CrearSubcategoriaDto) {
    const exists = await this.subCategoriaProductoRepository.findOne({ where: { nombre: dto.nombre.trim() }});

    if (exists) throw new BadRequestException('Ya existe una subcategoría con ese nombre');

    const subCategoria = this.subCategoriaProductoRepository.create({ nombre: dto.nombre.trim() });

    return this.subCategoriaProductoRepository.save(subCategoria);
  }

  async getAllSubCategorias() {
    return this.subCategoriaProductoRepository.find({ order: { id: 'ASC' } });
  }
}
