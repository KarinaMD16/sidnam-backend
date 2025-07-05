import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GaleriaService } from './galeria.service';
import { CategoriaDto } from './dto/createCategoriaDto';
import { GaleriaDto } from './dto/createGaleriaDto';

@Controller('galeria')
export class GaleriaController {

    constructor(private readonly galeriaService: GaleriaService){}

    @Post('createCategoria')
    createCategoria(@Body() createCategoriaDto: CategoriaDto){
        return this.galeriaService.createCategoria(createCategoriaDto);
    }

    @Get('getCategorias')
    findAllCategorias(){
        return this.galeriaService.findAllCategorias();
    }

    @Post('createImagenes')
    createImagenes(@Body() createImagenes: GaleriaDto){
        return this.galeriaService.createImagen(createImagenes);
    }

    @Get('getImagenes')
    findAllImagenes(){
        return this.galeriaService.findAllImagenes();
    }

    @Get('categoria/:id')
    findByCategoria(@Param() id: number){
        return this.galeriaService.findByCategoriaId(id);
    }

}

