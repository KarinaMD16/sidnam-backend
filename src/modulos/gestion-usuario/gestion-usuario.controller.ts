import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { GestionUsuarioService } from './gestion-usuario.service';
import { Roles } from '../autenticacion/decorators/roles.decorator';
import { Rol } from 'src/common/enums/rol.enum';
import { AuthGuard } from '../autenticacion/guard/auth.guard';
import { RolesGuard } from '../autenticacion/guard/roles.guard';

@Controller('gestion-usuario')
export class GestionUsuarioController {

    constructor(private readonly userService: GestionUsuarioService){}

    @Delete('eliminarUsuario/:cedula')
    @Roles(Rol.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    eliminarUsuario(@Param('cedula') cedula: string){
        return this.userService.eliminarUsuario(cedula);
    }

    @Get('getRoles')
    getRoles(){
        return this.userService.getRoles()
    }


}
