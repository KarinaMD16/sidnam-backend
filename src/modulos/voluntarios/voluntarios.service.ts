import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voluntarios } from './entities/voluntarios.entity';
import { CreateVoluntarioDto } from './dto/createVoluntarioDto';

@Injectable()
export class VoluntariosService {
  constructor(
    @InjectRepository(Voluntarios)
    private readonly repository: Repository<Voluntarios>,
  ) {}

  async create(data: CreateVoluntarioDto): Promise<Voluntarios> {
    const form = this.repository.create(data);
    return this.repository.save(form);
  }
}