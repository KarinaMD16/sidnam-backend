import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VoluntariosService } from './voluntarios.service';
import { CreateVoluntarioDto } from './dto/createVoluntarioDto';
import { Voluntarios } from './entities/voluntarios.entity';

@Controller('voluntarios')
export class VoluntariosController {
  constructor(private readonly service: VoluntariosService) {}

  @Post('create')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,               // elimina propiedades no incluidas en el DTO
      forbidNonWhitelisted: true,    // rechaza si vienen props extra
      transform: true,               // convierte strings en tipos (e.g. Date)
    }),
  )
  async create(
    @Body() createDto: CreateVoluntarioDto,
  ): Promise<Voluntarios> {
    return this.service.create(createDto);
  }
}