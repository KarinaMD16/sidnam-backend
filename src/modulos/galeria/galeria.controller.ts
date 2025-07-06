import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

    @Post('createImagenes')
    createImagenes(@Body() createImagenes: GaleriaDto){
        return this.galeriaService.createImagen(createImagenes);
    }

    @Get('getImagenes')
    findAllImagenes(){
        return this.galeriaService.findAllImagenes();
    }

   @Get('categoria/:id')
   findImagenesByCategoria(@Param('id') id: string) {
        const categoriaId = parseInt(id);
        return this.galeriaService.findByCategoriaId(categoriaId);
    }
    
    @Delete('removeImagenes/:id')
      removeImagen(@Param() id: number): Promise<void> {
        return this.galeriaService.removeImagen(id);
    }

}

