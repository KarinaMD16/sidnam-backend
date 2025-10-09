import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { CategoriaDto } from './dto/createCategoriaDto';
import { Galeria } from './entities/galeria.entity';
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

    async findAllCategoriasActivas(): Promise<Categoria[]> {
        return this.categoriaRepository.find({
          where: { isActive: true},
          order: { id: 'ASC' },
        });
    }

    async findAllCategoriasInactivas(): Promise<Categoria[]> {
        return this.categoriaRepository.find({
          where: { isActive: false},
          order: { id: 'ASC' },
        });
    }


    async handleEstadoCategoria(id: number): Promise<{ message: string}> {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });

         if (!categoria) {
            throw new NotFoundException(`La categoría con id ${id} no encontrada.`);
          }

          categoria.isActive = !categoria.isActive;

          await this.categoriaRepository.save(categoria);

          return {message: `Categoría ${categoria.isActive ? 'activada' : 'desactivada'} exitosamente.`};
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

    async removeImagen(id: number): Promise<{ message: string }> {

     const imagen = await this.galeriaRepository.findOne({ where: { id } });

      if (!imagen) {
         throw new NotFoundException(`Imagen con el id ${id} no encontrada`);
      }
       // Para eliminar de cloudinary tambien, se tendría que implementar más cosas.
       // await cloudinary.uploader.destroy(imagen.publicId);

      await this.galeriaRepository.remove(imagen);

      return { message: `Imagen con id ${id} eliminada exitosamente` };
    }

    async updateCategoriaImagen(imagenId: number, categoriaId: number) {

     const imagen = await this.galeriaRepository.findOne({
    where: { id: imagenId },
    relations: ['categoria'],
  });

  if (!imagen) {
    throw new NotFoundException(`Imagen con el id ${imagenId} no encontrada`);
  }

  const nuevaCategoria = await this.categoriaRepository.findOne({
    where: { id: categoriaId, isActive: true },
  });

  if (!nuevaCategoria) {
    throw new NotFoundException(
      `La categoría con ID ${categoriaId} no existe o está inactiva`,
    );
  }

  imagen.categoria = nuevaCategoria;
  imagen.categoriaId = categoriaId;
  await this.galeriaRepository.save(imagen);

  return {
    message: `Categoría de la imagen actualizada exitosamente`,
  };
}


    

}
