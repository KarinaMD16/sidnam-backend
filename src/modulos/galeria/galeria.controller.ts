import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GaleriaService } from './galeria.service';
import { CategoriaDto } from './dto/createCategoriaDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdateCategoriaImagenDto } from './dto/updateCategoriaImagenDto';

@Controller('galeria')
export class GaleriaController {

    constructor(private readonly galeriaService: GaleriaService){}

    //Categorias
    @Post('createCategoria')
    createCategoria(@Body() createCategoriaDto: CategoriaDto){
        return this.galeriaService.createCategoria(createCategoriaDto);
    }

    @Get('getCategoriasActivas')
    findAllCategoriasActivas(){
        return this.galeriaService.findAllCategoriasActivas();
    }

    @Get('getCategoriasInactivas')
    findAllCategoriasInactivas(){
        return this.galeriaService.findAllCategoriasInactivas();
    }

    @Patch('handleCategoria/:id')
    async toggleEstado(@Param('id', ParseIntPipe) id: number) {
       return this.galeriaService.handleEstadoCategoria(id);
    }


    //Imagenes

    @Post('createImagen')
    @UseInterceptors(FileInterceptor('imagen'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { categoriaId: { type: 'integer', example: 1 }, imagen: { type: 'string', format: 'binary' } } } })
    createImagen(
    @UploadedFile() file: Express.Multer.File,
    @Body('categoriaId', ParseIntPipe) categoriaId: number,
    ) {
    if (!file) throw new BadRequestException('Debes subir un archivo en el campo "imagen"');
    return this.galeriaService.createImagen(file, categoriaId);
    }

    @Get('getImagenes')
    findAllImagenes(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        if (page && limit) {
            return this.galeriaService.findAllImagenes(page, limit);
        }
        return this.galeriaService.findAllImagenes();
    }


   @Get('categoria/:id')
   findImagenesByCategoria(
        @Param('id') id: string,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        const categoriaId = parseInt(id);
        if (page && limit) {
            return this.galeriaService.findByCategoriaId(categoriaId, page, limit);
        }
        return this.galeriaService.findByCategoriaId(categoriaId);
    }
    
    @Delete('removeImagen/:id')
     async removeImagen(@Param('id', ParseIntPipe) id: number) {
     return this.galeriaService.removeImagen(id);
    }

    @Patch('updateCategoria/:imagenId')
    async updateCategoriaImagen(
    @Param('imagenId', ParseIntPipe) imagenId: number,
    @Body() dto: UpdateCategoriaImagenDto,
    ) {
      return this.galeriaService.updateCategoriaImagen(imagenId, dto.categoriaId);
    }


}

