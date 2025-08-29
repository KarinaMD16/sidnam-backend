import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriasPrincipalesProductos } from "src/common/enums/categoriasPrincipalesProductos.enum";
import { Categoria_Producto } from "../entities/categoriaProducto.entity";
import { Repository } from "typeorm";
import { CategoriaProductoDto } from "../dto/crearCategoriaProductoDto";



@Injectable()
export class InventarioService {

    constructor(

        @InjectRepository(Categoria_Producto)
        private readonly categoriaProducto: Repository<Categoria_Producto>,
    ){}


    async crearCategoriaProducto(categoriaDto: CategoriaProductoDto): Promise<Categoria_Producto>{
        
        if (!Object.values(CategoriasPrincipalesProductos).includes(categoriaDto.nombre)) {
            throw new BadRequestException(`La categoría debe ser una de: ${Object.values(CategoriasPrincipalesProductos).join(', ')}`);
        }
        const nuevaCategoria = this.categoriaProducto.create(categoriaDto);
        return await this.categoriaProducto.save(nuevaCategoria);
    }

    async getAllCategoriasProductos(): Promise<CategoriaProductoDto[]>{
        return await this.categoriaProducto.find()
    }
    
}