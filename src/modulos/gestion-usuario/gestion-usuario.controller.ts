import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GestionUsuarioService } from './services/gestion-usuario.service';
import { AuthGuard } from '../autenticacion/guard/auth.guard';
import { RolesGuard } from '../autenticacion/guard/roles.guard';
import { CreateRolDto } from './dto/createRolDto';
import { PermisosService } from './services/permiso-roles.service';

@Controller('gestion-usuario')
export class GestionUsuarioController {

    constructor(private readonly userService: GestionUsuarioService, private readonly permisosService: PermisosService){}

    @Delete('eliminarUsuario/:cedula')
    @UseGuards(AuthGuard, RolesGuard)
    eliminarUsuario(@Param('cedula') cedula: string){
        return this.userService.eliminarUsuario(cedula);
    }

    @Post('roles')
    createRole(@Body() createRolDto: CreateRolDto) {
        return this.userService.createRole(createRolDto);
    }

    @Get('roles')
    getAllRoles() {
        return this.userService.getRoles();
    }

    @Get('acciones')
    getAllAcciones(){
        return this.permisosService.getAcciones();
    }

    @Get('permisos')
    getAllPermisos(){
        return this.permisosService.getPermisos();
    }

    @Post('permisos/acciones/rol/:rolId/:permisoId/:accionId')
    asociarPermisoAccionARol(
        @Param('rolId', ParseIntPipe) rolId: number,
        @Param('permisoId', ParseIntPipe) permisoId: number,
        @Param('accionId', ParseIntPipe) accionId: number,
    ) {
        return this.permisosService.asociarPermisoAccionARol(rolId, permisoId, accionId);
    }

    @Get('acciones-por-rol/:rolId')
    getAccionesPorRol(@Param('rolId', ParseIntPipe) rolId: number) {
        return this.permisosService.getAccionesPorRol(rolId);
    }
}
