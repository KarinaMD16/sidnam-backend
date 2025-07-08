import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUsuarioDto';

@Injectable()
export class GestionUsuarioService {

    constructor(
        @InjectRepository(Usuario)
        private readonly usuariosRepository: Repository<Usuario>
    ){}

    async createUsuarioAdministrador(createUserDto: CreateUserDto){
        return await this.usuariosRepository.save(createUserDto);
    }

    async findOneByEmail(cedula: string){
        return await this.usuariosRepository.findOneBy({cedula});
    }


}
