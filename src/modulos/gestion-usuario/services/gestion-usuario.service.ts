import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/createUsuarioDto';
import { GetRolesDto } from '../dto/response-role';
import { RolUsuario } from '../entities/rol.entity';
import { CreateRolDto } from '../dto/createRolDto';
import { plainToInstance } from 'class-transformer';
import { GetUsuarioPermisosDto } from '../dto/GetUsuarioPermisosDto';
import { Estado_Usuario, getEstadoUsuarioById } from 'src/common/enums/esatadoUsuario.enum';
import { UpdateUsuarioDto } from '../dto/updateUsuarioDto';
import { UpdateRolDto } from '../dto/updateRolDto';
import { UsuarioPreviewDto } from '../dto/getUsuariosPreviewsDto';

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

        const roles = await this.rolRepository.find({
          order: { estado: 'DESC' }
        });
        
        const dto = plainToInstance(GetRolesDto, roles, { excludeExtraneousValues: true });
        return dto;

    }


    async getUsuarioConPermisos(usuarioId: number): Promise<GetUsuarioPermisosDto> {

    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
      relations: [
        "rol",
        "rol.rolPermisoAcciones",
        "rol.rolPermisoAcciones.permiso",
        "rol.rolPermisoAcciones.accion",
      ],
    });

    if (!usuario) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const permisosMap = new Map<
      number,
      { id_permiso: number; modulo: string; seccion: string; acciones: { id_accion: number; accion: string }[] }
    >();

    for (const rpa of usuario.rol.rolPermisoAcciones) {
      const permisoId = rpa.permiso.id_permiso;

      if (!permisosMap.has(permisoId)) {
        permisosMap.set(permisoId, {
          id_permiso: permisoId,
          modulo: rpa.permiso.modulo,
          seccion: rpa.permiso.seccion,
          acciones: [],
        });
      }

      const permisoObj = permisosMap.get(permisoId);
      if (permisoObj) {
        permisoObj.acciones.push({
          id_accion: rpa.accion.id_accion,
          accion: rpa.accion.accion,
        });
      }
    }

    const dtoObj = {
      id_usuario: usuario.id,
      cedula: usuario.cedula,
      name: usuario.name,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      email: usuario.email,
      createdAt: usuario.createdAt,
      rol: {
        id_rol: usuario.rol.id_rol,
        nombre: usuario.rol.nombre,
        descripcion: usuario.rol.descripcion,
        permisos: Array.from(permisosMap.values()),
      },
    };

    return plainToInstance(GetUsuarioPermisosDto, dtoObj, {
      excludeExtraneousValues: true,
    });
  }

  async desactivarUsuario(id: number): Promise<{message: string}> {

    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    usuario.estado = Estado_Usuario.inactivo;
    await this.usuariosRepository.save(usuario);

    return { message: 'Usuario desactivado correctamente' };

  }

  async activarUsuario(id: number): Promise<{message: string}> {

    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    usuario.estado = Estado_Usuario.activo;
    await this.usuariosRepository.save(usuario);

    return { message: 'Usuario activado correctamente' };
  }


  async updateInformacionUsuario(updateUsuario: UpdateUsuarioDto, id: number): Promise<{mesage: string}> {

    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(usuario, updateUsuario);
    await this.usuariosRepository.save(usuario);

    return { mesage: 'Usuario actualizado correctamente' };
  }

  async updateRol(idRol: number, updateRol: UpdateRolDto): Promise<{message: string}> {

    const rol = await this.rolRepository.findOneBy({ id_rol: idRol });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    Object.assign(rol, updateRol);
    await this.rolRepository.save(rol);

    return { message: 'Rol actualizado correctamente' };
  }


  async findAllUsuarios(estadoID: number, page?: number, limit?: number): Promise<{ data: UsuarioPreviewDto[]; total: number }> {
    
    const estadoExistente = estadoID ? getEstadoUsuarioById(estadoID) : undefined;
    if (estadoID && !estadoExistente) {
      throw new BadRequestException('Estado de usuario inválido');
    }
    
    const [data, total] = await this.usuariosRepository.findAndCount({
      where: estadoExistente ? { estado: estadoExistente } : undefined,
        skip: page && limit ? (page - 1) * limit : 0,
        take: limit,
        order: { estado: 'ASC' },
        relations: ['rol'], 
        
    });

    const dtos = plainToInstance(UsuarioPreviewDto, data, { excludeExtraneousValues: true });

    return { data: dtos, total };
}

  


}
