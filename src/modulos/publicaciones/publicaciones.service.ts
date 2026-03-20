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
import { parseFechaLocal } from 'src/common/utils/parseFechaLocal';


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

    private getTodayInCostaRica(): Date {
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Costa_Rica',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        const parts = formatter.formatToParts(new Date());
        const year = parts.find((part) => part.type === 'year')?.value;
        const month = parts.find((part) => part.type === 'month')?.value;
        const day = parts.find((part) => part.type === 'day')?.value;

        return parseFechaLocal(`${year}-${month}-${day}`);
    }

    private isEventoActivoPorFecha(fecha: string | Date): boolean {
        return parseFechaLocal(fecha) >= this.getTodayInCostaRica();
    }

    private async syncExpiredEventos(): Promise<void> {
        const today = this.getTodayInCostaRica();
        const eventosActivos = await this.eventosRepository.find({
            where: { isActive: true },
            select: ['id', 'fecha', 'isActive'],
        });

        const expirados = eventosActivos.filter((evento) => parseFechaLocal(evento.fecha) < today);

        if (expirados.length === 0) {
            return;
        }

        await this.eventosRepository.save(
            expirados.map((evento) => ({
                ...evento,
                isActive: false,
            })),
        );
    }

    //Proyectos
   async createProyecto(dto: ProyectoDto, file: Express.Multer.File): Promise<Proyectos> {

     const { secure_url } = await uploadBufferToCloudinary(file.buffer, 'publicaciones/proyectos');

     const nuevoProyecto = this.proyectosRepository.create({
      ...dto,
     imagenUrl: secure_url,
     });

     return await this.proyectosRepository.save(nuevoProyecto);
    }

   async updateProyecto(id: number, updateProyectoDto: updateProyectoDto, file?: Express.Multer.File): Promise<Proyectos> {
        const proyecto = await this.proyectosRepository.findOne({ where: { id } });
        if (!proyecto) throw new NotFoundException(`Proyecto con id ${id} no encontrado`);

        if (file) {
          const { secure_url } = await uploadBufferToCloudinary(file.buffer, 'publicaciones/proyectos');
          proyecto.imagenUrl = secure_url;
        }

        for (const [key, value] of Object.entries(updateProyectoDto)) {
          if (value !== undefined && value !== '') {
            (proyecto as any)[key] = value;
          }
    }
        await this.proyectosRepository.save(proyecto);

        return proyecto;
    }

    async removeProyecto(id: number): Promise<{message: string}> {

        const proyecto = await this.proyectosRepository.findOneBy({ id });

        if (!proyecto) {
            throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
        }
        await this.proyectosRepository.delete(id);

        return { message: `Proyecto con id ${id} eliminado correctamente` };
    }

    async handleEstadoProyecto(id: number): Promise<{ message: string }> {
        const proyecto = await this.proyectosRepository.findOne({ where: { id } });

        if (!proyecto) {
            throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
        }

        proyecto.isActive = !proyecto.isActive;
        await this.proyectosRepository.save(proyecto);

        return { message: `Proyecto ${proyecto.isActive ? 'activado' : 'desactivado'} correctamente.` };
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

   async updateDonacion(id: number, dto: updateDonacionDto, file?: Express.Multer.File): Promise<Donacion> {
  const donacion = await this.donacionesRepository.findOne({ where: { id } });
  if (!donacion) throw new NotFoundException(`Donación con id ${id} no encontrada`);

  
  if (file) {
    
    const { secure_url} = await uploadBufferToCloudinary(file.buffer, 'publicaciones/donaciones');
    donacion.imagenUrl = secure_url;
  }

  for (const [key, value] of Object.entries(dto)) {
  if (value !== undefined && value !== '') {
    (donacion as any)[key] = value;
  }
}
  await this.donacionesRepository.save(donacion);

  return donacion;
}

    async removeDonacion(id: number): Promise<{message: string}> {

        const donacion = await this.donacionesRepository.findOneBy({ id });

        if (!donacion) {
            throw new NotFoundException(`Donación con id ${id} no encontrada`);
        }

        await this.donacionesRepository.delete(id);

        return { message: `Donación con id ${id} eliminada correctamente` };
    }

    async handleEstadoDonacion(id: number): Promise<{ message: string }> {
        const donacion = await this.donacionesRepository.findOne({ where: { id } });

        if (!donacion) {
            throw new NotFoundException(`Donacion con id ${id} no encontrada`);
        }

        donacion.isActive = !donacion.isActive;
        await this.donacionesRepository.save(donacion);

        return { message: `Donacion ${donacion.isActive ? 'activada' : 'desactivada'} correctamente.` };
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
    isActive: this.isEventoActivoPorFecha(dto.fecha),
  });

  return await this.eventosRepository.save(nuevoEvento);
}

   async updateEventos(id: number, updateEvento: updateEventosDto, file?: Express.Multer.File): Promise<Eventos> {
    const evento = await this.eventosRepository.findOne({ where: { id } });
    if (!evento) throw new NotFoundException(`Evento con id ${id} no encontrado`);
        
    if (file) {
        const { secure_url } = await uploadBufferToCloudinary(file.buffer, 'publicaciones/eventos');
        evento.imagenUrl = secure_url;
     }

        for (const [key, value] of Object.entries(updateEvento)) {
        if (value !== undefined && value !== '') {
           (evento as any)[key] = value;
        }
    }

    evento.isActive = this.isEventoActivoPorFecha(evento.fecha);

    await this.eventosRepository.save(evento);

    return evento;
       
  }

    async removeEventos(id: number): Promise<{message: string}> {

        const evento = await this.eventosRepository.findOneBy({ id });

        if (!evento) {
            throw new NotFoundException(`Evento con id ${id} no encontrado`);
        }
        await this.eventosRepository.delete(id);

        return { message: `Evento con id ${id} eliminado correctamente` };
    }

    async handleEstadoEvento(id: number): Promise<{ message: string }> {
        const evento = await this.eventosRepository.findOne({ where: { id } });

        if (!evento) {
            throw new NotFoundException(`Evento con id ${id} no encontrado`);
        }

        evento.isActive = !evento.isActive;
        await this.eventosRepository.save(evento);

        return { message: `Evento ${evento.isActive ? 'activado' : 'desactivado'} correctamente.` };
    }

    async findAllEventos(page?: number, limit?: number): Promise<{ data: Eventos[]; total: number }> {

        await this.syncExpiredEventos();

        if (!page || !limit) throw new Error('Los parámetros page y limit son requeridos');

        const [data, total] = await this.eventosRepository.findAndCount({
            where: { isActive: true },
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
