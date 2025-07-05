import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { CategoriaDto } from './dto/createCategoriaDto';
import { Galeria } from './entities/galeria.entity';
import { GaleriaDto } from './dto/createGaleriaDto';

@Injectable()
export class GaleriaService {

    constructor(
         @InjectRepository(Categoria)
         private readonly categoriaRepository: Repository<Categoria>,

         @InjectRepository(Galeria)
         private readonly galeriaRepository: Repository<Galeria>,
        
    ){}


    async createCategoria(createCAtegoria: CategoriaDto): Promise<Categoria> {
        const nuevaCategoria = this.categoriaRepository.create(createCAtegoria);
        return await this.categoriaRepository.save(nuevaCategoria);
    }

    async findAllCategorias(): Promise<Categoria[]> {
        return this.categoriaRepository.find();
    }

    async createImagen(createGaleria: GaleriaDto): Promise<Galeria>{
        const categoria = await this.categoriaRepository.findOne({
            where: {id: createGaleria.categoriaId},
        });

        if(!categoria) throw new NotFoundException('Categoria no encontrada');

        const nuevaImagen = this.galeriaRepository.create({
            imagenUrl: createGaleria.imagenUrl,
            categoria,
        });

        return this.galeriaRepository.save(nuevaImagen);
    }

    async findAllImagenes():Promise<Galeria[]>{
        return this.galeriaRepository.find();
    }

    async findByCategoriaId(categoriaId: number): Promise<Galeria[]>{
        return this.galeriaRepository.find({
            where:{
                categoria: {id: categoriaId},
            },
            relations: ['categoria'],
        });
    }
}
