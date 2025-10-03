import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GaleriaService } from './galeria.service';
import { CategoriaDto } from './dto/createCategoriaDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('galeria')
export class GaleriaController {

    constructor(private readonly galeriaService: GaleriaService){}

    //Categorias
    @Post('createCategoria')
    createCategoria(@Body() createCategoriaDto: CategoriaDto){
        return this.galeriaService.createCategoria(createCategoriaDto);
    }

    @Get('getCategorias')
    findAllCategorias(){
        return this.galeriaService.findAllCategorias();
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
      removeImagen(@Param() id: number): Promise<void> {
        return this.galeriaService.removeImagen(id);
    }

}

