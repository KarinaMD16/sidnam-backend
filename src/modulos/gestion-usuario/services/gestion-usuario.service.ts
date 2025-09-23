import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/createUsuarioDto';
import { GetRolesDto } from '../dto/response-role';
import { RolUsuario } from '../entities/rol.entity';
import { CreateRolDto } from '../dto/createRolDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GestionUsuarioService {

    constructor(
        @InjectRepository(Usuario)
        private readonly usuariosRepository: Repository<Usuario>,

        @InjectRepository(RolUsuario)
        private readonly rolRepository: Repository<RolUsuario>,
    ){}

    async saveUsuario(usuario: Usuario){
        await this.usuariosRepository.save(usuario)
    }

    async createUsuario({cedula, email, name, password, rol, apellido1, apellido2}: CreateUserDto) {
        return await this.usuariosRepository.save({
            cedula,
            email,
            name,
            password,
            apellido1,
            apellido2,
            rol 
        });
    }


    async findOneByCedula(cedula: string) {
        return await this.usuariosRepository.findOne({
            where: { cedula },
            relations: ['rol'], 
        });
    }


    async findOneByEmail(email: string){
        return await this.usuariosRepository.findOneBy({email});
    }

    async findOneById(id: number): Promise<Usuario> {
        const usuario = await this.usuariosRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'refreshToken', 'rol'],
            relations: ['rol'],
        });

        if (!usuario) {
            throw new NotFoundException('El usuario no se encuentra en los registros');
        }

        return usuario;
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

    async createRole(createRol: CreateRolDto): Promise<RolUsuario> {

        const rolExistenbte = await this.rolRepository.findOneBy({ nombre: createRol.nombre });
        if (rolExistenbte?.nombre.toLowerCase() === createRol.nombre.toLowerCase()) {
            throw new BadRequestException('El rol ya existe');
        }

        const rol = this.rolRepository.create(createRol);
        return await this.rolRepository.save(rol);
    }

    async getRoles(): Promise<GetRolesDto[]> {

        const roles = await this.rolRepository.find();
        
        const dto = plainToInstance(GetRolesDto, roles, { excludeExtraneousValues: true });
        return dto;

    }

}
