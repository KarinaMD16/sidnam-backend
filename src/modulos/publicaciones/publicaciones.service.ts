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

@Injectable()
export class PublicacionesService {

    constructor(
        @InjectRepository(Donacion)
        private donacionesRepository: Repository<Donacion>,

        @InjectRepository(Eventos)
        private eventosRepository: Repository<Eventos>,

        @InjectRepository(Proyectos)
        private proyectosRepository: Repository<Proyectos>,
    ){}

    //Proyectos
    async createProyecto(proyectoDto: ProyectoDto): Promise<Proyectos> {
        const nuevoProyecto = this.proyectosRepository.create(proyectoDto);
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

    async removeProyecto(id: number): Promise<void> {
        await this.proyectosRepository.delete(id);
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

    async createDoanciones(createDonaciones: DonacionDto): Promise<Donacion> {
        const nuevaDonacion = this.donacionesRepository.create(createDonaciones);
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

    async removeDonacion(id: number): Promise<void> {
        await this.donacionesRepository.delete(id);
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

    async createEventos(createEventos: EventoDto): Promise<Eventos> {
        const nuevoEvento = this.eventosRepository.create(createEventos);
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

    async removeEventos(id: number): Promise<void> {
        await this.eventosRepository.delete(id);
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
