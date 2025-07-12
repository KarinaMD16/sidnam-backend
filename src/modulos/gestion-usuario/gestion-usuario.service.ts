import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async createUsuario(createUserDto: CreateUserDto){
        return await this.usuariosRepository.save(createUserDto);
    }

    async findOneByCedula(cedula: string){
        return await this.usuariosRepository.findOneBy({cedula});
    }

    async findOneByEmail(email: string){
        return await this.usuariosRepository.findOneBy({email});
    }

    async eliminarUsuario(cedula: string): Promise<void>{

        const usuario = await this.usuariosRepository.findOneBy({cedula});
        
        if(!usuario){
            throw new NotFoundException('Usuario no encontrado')
        }

        await this.usuariosRepository.delete({ cedula });
    }

    async updateUsuario(email: string, password: string): Promise<void>{

        const usuario = await this.usuariosRepository.findOneBy({email});
        
        if(!usuario){
            throw new NotFoundException('Usuario no encontrado')
        }

        await this.usuariosRepository.update({email}, {password});
    }

    

}
