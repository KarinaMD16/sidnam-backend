import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { CategoriaDto } from './dto/createCategoriaDto';
import { Galeria } from './entities/galeria.entity';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';
import { configureCloudinary } from 'src/common/cloudinary/cloudinary.config';
import { uploadBufferToCloudinary } from 'src/common/services/cloudinary-buffer.service';


@Injectable()
export class GaleriaService {

    private readonly cloudinary = configureCloudinary();

    constructor(
         @InjectRepository(Categoria)
         private readonly categoriaRepository: Repository<Categoria>,

         @InjectRepository(Galeria)
         private readonly galeriaRepository: Repository<Galeria>,
        
    ){}

    //Categorias
    async createCategoria(createCAtegoria: CategoriaDto): Promise<Categoria> {
        const nuevaCategoria = this.categoriaRepository.create(createCAtegoria);
        return await this.categoriaRepository.save(nuevaCategoria);
    }

    async findAllCategorias(): Promise<Categoria[]> {
        return this.categoriaRepository.find();
    }
    //Imagenes
    
  async createImagen(file: Express.Multer.File, categoriaId: number): Promise<Galeria> {

    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new NotFoundException(`Categoría con id ${categoriaId} no encontrada`);

    const { secure_url } = await uploadBufferToCloudinary(file.buffer, `galeria/${categoriaId}`);

    const nueva = this.galeriaRepository.create({
      imagenUrl: secure_url,
      categoria,
    });

    return this.galeriaRepository.save(nueva);
  }

    async findAllImagenes(page?: number, limit?: number): Promise<Galeria[]>{

        if (page && limit) {
            return this.galeriaRepository.find({
                skip: (page - 1) * limit,
                take: limit,
                order: { id: 'DESC' },
                select: ['id', 'imagenUrl'],
            });
        }
        
        return this.galeriaRepository.find();
    }

    async findByCategoriaId(categoriaId: number, page?: number, limit?: number): Promise<Galeria[]> {
        const categoria = await this.categoriaRepository.findOne({
          where: { id: categoriaId },
        });

      if (!categoria) {
        throw new NotFoundException(`Categoría con id ${categoriaId} no encontrada`);
      }

        if (page && limit) {
            return this.galeriaRepository.find({
                where: { categoriaId },
                skip: (page - 1) * limit,
                take: limit,
                order: { id: 'DESC' },
                select: ['id', 'imagenUrl'],
            });
        }
      
      return this.galeriaRepository.find({
        where: { categoriaId },

      });   
    }

    async removeImagen(id: number): Promise<void> {
        await this.galeriaRepository.delete(id);
    }


    

}
