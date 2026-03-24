import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GestionUsuarioService } from './services/gestion-usuario.service';
import { AuthGuard } from '../autenticacion/guard/auth.guard';
import { CreateRolDto } from './dto/createRolDto';
import { PermisosService } from './services/permiso-roles.service';
import { UpdateUsuarioDto } from './dto/updateUsuarioDto';
import { UpdateRolDto } from './dto/updateRolDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { assertValidImageUpload } from 'src/common/utils/imageUploadValidation';



@Controller('gestion-usuario')
export class GestionUsuarioController {

    constructor(private readonly userService: GestionUsuarioService, private readonly permisosService: PermisosService){}

    @Delete('eliminarUsuario/:cedula')
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

    @Delete('permisos/acciones/rol/:rolId/:permisoId/:accionId')
    desasociarPermisoAccionDeRol(
        @Param('rolId', ParseIntPipe) rolId: number,
        @Param('permisoId', ParseIntPipe) permisoId: number,
        @Param('accionId', ParseIntPipe) accionId: number,
    ) {
        return this.permisosService.desasociarPermisoAccionDeRol(rolId, permisoId, accionId);
    }

    @Get('roles/estado/:rolId')
    getEstadoRol(@Param('rolId', ParseIntPipe) rolId: number) {
        return this.permisosService.getEstadoRol(rolId);
    }

    @Patch('roles/estado/desactivar/:rolId')
    desactivarRolPorId(@Param('rolId', ParseIntPipe) rolId: number) {
        return this.permisosService.desactivarRol(rolId);
    }

    @Patch('roles/estado/activar/:rolId')
    activarRolPorId(@Param('rolId', ParseIntPipe) rolId: number) {
        return this.permisosService.activarRol(rolId);
    }

    @Get('roles/permisos/acciones/:usuarioId')
    getPermisosAccionesPorUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
        return this.userService.getUsuarioConPermisos(usuarioId);
    }

    @Patch('usuarios/desactivar/:id')
    desactivarUsuario(@Param('id', ParseIntPipe) id: number) {
        return this.userService.desactivarUsuario(id);
    }

    @Patch('usuarios/activar/:id')
    activarUsuario(@Param('id', ParseIntPipe) id: number) {
        return this.userService.activarUsuario(id);
    }

    @Patch('usuarios/:id')
    updateUsuario(@Body() updateUsuarioDto: UpdateUsuarioDto, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updateInformacionUsuario(updateUsuarioDto, id);
    }

    @Patch('roles/:id')
    updateRol(@Body() updateRolDto: UpdateRolDto, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updateRol(id, updateRolDto);
    }

    @Get('usuarios/:estadoID')
        async getUsuariosPreviews(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Param('estadoID' , ParseIntPipe) estadoID: number,
        ) {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        return this.userService.findAllUsuarios(estadoID, pageNumber, limitNumber);
    }

    @Get('usuarios/cedula/:cedula')
    async getUsuarioPorCedula(@Param('cedula') cedula: string) {
        return this.userService.findUsuariosByCedula(cedula);
    }

    @UseGuards(AuthGuard)
    @Get('perfil')
    async getPerfil(@Req() req) {
    return this.userService.findPerfil(req.user);
    }

    @Post('createImagen')
    @UseInterceptors(FileInterceptor('imagen'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { usuarioId: { type: 'integer', example: 1 }, imagen: { type: 'string', format: 'binary' } } } })
    createImagen(
    @UploadedFile() file: Express.Multer.File,
    @Body('usuarioId', ParseIntPipe) usuarioId: number,
    ) {
    assertValidImageUpload(file);
    return this.userService.createImagenUsuario(file, usuarioId);
    }

}
