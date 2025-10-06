import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donacion } from './entities/donacion.entity';
import { Repository } from 'typeorm';
import { Eventos } from './entities/eventos.entity';
import { Proyectos } from './entities/proyectos.entity';
import { ProyectoDto } from './dto/createProyectosDto';
import { updateDonacionDto } from './dto/updateDonacionDto';
import { updateProyectoDto } from './dto/updateProyectoDto';
import { DonacionDto } from './dto/createDonacionDto';
import { EventoDto } from './dto/createEventosDto';
import { updateEventosDto } from './dto/updateEventosDto';
import { uploadBufferToCloudinary } from 'src/common/services/cloudinary-buffer.service';

@Injectable()
export class PublicacionesService {

    constructor(
        @InjectRepository(Donacion)
        private readonly donacionesRepository: Repository<Donacion>,

        @InjectRepository(Eventos)
        private readonly eventosRepository: Repository<Eventos>,

        @InjectRepository(Proyectos)
        private readonly proyectosRepository: Repository<Proyectos>,
    ){}

    //Proyectos
   async createProyecto(dto: ProyectoDto, file: Express.Multer.File): Promise<Proyectos> {

     const { secure_url } = await uploadBufferToCloudinary(file.buffer, 'publicaciones/proyectos');

     const nuevoProyecto = this.proyectosRepository.create({
      ...dto,
     imagenUrl: secure_url,
     });

     return await this.proyectosRepository.save(nuevoProyecto);
    }

   async updateProyecto(id: number, updateProyectoDto: updateProyectoDto): Promise<Proyectos> {
        await this.proyectosRepository.update(id, updateProyectoDto);

        const proyectoActualizado = await this.proyectosRepository.findOneBy({ id });
            if (!proyectoActualizado) {
                throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
            }

        return proyectoActualizado;
    }

    async removeProyecto(id: number): Promise<{message: string}> {

        const proyecto = await this.proyectosRepository.findOneBy({ id });

        if (!proyecto) {
            throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
        }
        await this.proyectosRepository.delete(id);

        return { message: `Proyecto con id ${id} eliminado correctamente` };
    }

    async findAllProyectos(page?: number, limit?: number): Promise<{ data: Proyectos[]; total: number }> {

        if (!page || !limit) throw new Error('Los parámetros page y limit son requeridos');

        const [data, total] = await this.proyectosRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'DESC' },
            select: ['id', 'fecha', 'Titulo', 'Descripcion', 'imagenUrl'],
        });

        if ((page - 1) * limit >= total) {
            return { data: [], total }; 
        }

        return { data, total };
    }

    async getProyectoById(id: number): Promise<Partial<Proyectos>> {

      const proyecto = await this.proyectosRepository.findOne({
       where: { id },
       select: ['id', 'fecha', 'Titulo', 'Descripcion', 'imagenUrl'],
     });

      if (!proyecto) {
        throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
      }

      return proyecto;
    }

    //Donaciones

    async createDonacion(dto: DonacionDto, file: Express.Multer.File): Promise<Donacion> {

    const { secure_url } = await uploadBufferToCloudinary(file.buffer, 'publicaciones/donaciones');

    const nuevaDonacion = this.donacionesRepository.create({
    ...dto,
    imagenUrl: secure_url,
    });

    return await this.donacionesRepository.save(nuevaDonacion);
   }

   async updateDonacion(id: number, updateDonacion: updateDonacionDto): Promise<Donacion> {
        await this.donacionesRepository.update(id, updateDonacion);

        const donacionActualizada = await this.donacionesRepository.findOneBy({ id });
            if (!donacionActualizada) {
                throw new NotFoundException(`Donacion con id ${id} no encontrado`);
            }

        return donacionActualizada;
    }

    async removeDonacion(id: number): Promise<{message: string}> {

        const donacion = await this.donacionesRepository.findOneBy({ id });

        if (!donacion) {
            throw new NotFoundException(`Donación con id ${id} no encontrada`);
        }

        await this.donacionesRepository.delete(id);

        return { message: `Donación con id ${id} eliminada correctamente` };
    }

    async findAllDonacion(page?: number, limit?: number): Promise<{ data: Donacion[]; total: number }> {

        if (!page || !limit) throw new Error('Los parámetros page y limit son requeridos');

        const [data, total] = await this.donacionesRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'DESC' },
            select: ['id', 'fecha', 'Titulo', 'Descripcion', 'imagenUrl'],
        });

        if ((page - 1) * limit >= total) {
            return { data: [], total }; 
        }

        return { data, total };
    }
    

    async getDonacionById(id: number): Promise<Partial<Donacion>> {

      const donacion = await this.donacionesRepository.findOne({
        where: { id },
        select: ['id', 'fecha', 'Titulo', 'Descripcion', 'imagenUrl'], 
     });

     if (!donacion) {
        throw new NotFoundException(`Donación con id ${id} no encontrada`);
    }

     return donacion;
    }


    //Eventos

    async createEvento(dto: EventoDto, file: Express.Multer.File): Promise<Eventos> {
  const { secure_url } = await uploadBufferToCloudinary(file.buffer, 'publicaciones/eventos');

  const nuevoEvento = this.eventosRepository.create({
    ...dto,
    imagenUrl: secure_url,
  });

  return await this.eventosRepository.save(nuevoEvento);
}

   async updateEventos(id: number, updateEvento: updateEventosDto): Promise<Eventos> {
        await this.eventosRepository.update(id, updateEvento);

        const eventoActualizado = await this.eventosRepository.findOneBy({ id });
            if (!eventoActualizado) {
                throw new NotFoundException(`Evento con id ${id} no encontrado`);
            }

        return eventoActualizado;
    }

    async removeEventos(id: number): Promise<{message: string}> {

        const evento = await this.eventosRepository.findOneBy({ id });

        if (!evento) {
            throw new NotFoundException(`Evento con id ${id} no encontrado`);
        }
        await this.eventosRepository.delete(id);

        return { message: `Evento con id ${id} eliminado correctamente` };
    }

    async findAllEventos(page?: number, limit?: number): Promise<{ data: Eventos[]; total: number }> {

        if (!page || !limit) throw new Error('Los parámetros page y limit son requeridos');

        const [data, total] = await this.eventosRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'DESC' },
            select: ['id', 'fecha', 'Titulo', 'Descripcion', 'imagenUrl'],
        });

        if ((page - 1) * limit >= total) {
            return { data: [], total }; 
        }

        return { data, total };
    }

    async getEventoById(id: number): Promise<Partial<Eventos>> {

       const evento = await this.eventosRepository.findOne({
        where: { id },
        select: ['id', 'fecha', 'Titulo', 'Descripcion', 'imagenUrl'],
       });

       if (!evento) {
        throw new NotFoundException(`Evento con id ${id} no encontrado`);
       }

       return evento;
    }
}
