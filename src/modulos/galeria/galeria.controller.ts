import { Body, Controller, Delete, Get, Optional, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { GaleriaService } from './galeria.service';
import { CategoriaDto } from './dto/createCategoriaDto';
import { GaleriaDto } from './dto/createGaleriaDto';

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
    createImagenes(@Body() createImagenes: GaleriaDto){
        return this.galeriaService.createImagen(createImagenes);
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

