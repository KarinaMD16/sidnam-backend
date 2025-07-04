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

    findAllProyectos(): Promise<Proyectos[]> {
        return this.proyectosRepository.find();
    }

    //Donaciones

    async createDoanciones(createDonaciones: DonacionDto): Promise<Donacion> {
        const nuevaDonacion = this.donacionesRepository.create(createDonaciones);
        return await this.donacionesRepository.save(nuevaDonacion);
    }

   async updateDonacion(id: number, updateDonacion: updateProyectoDto): Promise<Donacion> {
        await this.donacionesRepository.update(id, updateDonacion);

        const donacionActualizada = await this.donacionesRepository.findOneBy({ id });
            if (!donacionActualizada) {
                throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
            }

        return donacionActualizada;
    }

    async removeDonacion(id: number): Promise<void> {
        await this.donacionesRepository.delete(id);
    }

    findAllDonacion(): Promise<Donacion[]> {
        return this.donacionesRepository.find();
    }



}
