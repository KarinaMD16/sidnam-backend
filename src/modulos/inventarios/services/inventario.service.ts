import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriasOptions, CategoriasPrincipalesProductos, getCategoriasId } from "src/common/enums/categoriasPrincipalesProductos.enum";
import { Categoria_Producto } from "../entities/categoriaProducto.entity";
import { Repository } from "typeorm";
import { CategoriaProductoDto } from "../dto/crearCategoriaProductoDto";
import { CreateCategoriaDto } from "../dto/createCategoriaDto";



@Injectable()
export class InventarioService {

    constructor(

        @InjectRepository(Categoria_Producto)
        private readonly categoriaProducto: Repository<Categoria_Producto>,
    ){}

    getCategorias() {
            return CategoriasOptions.map(opt => ({
              id: opt.id,
              nombre: opt.nombre, 
            }));
        }

        async crearCategoria(idCategoria: number, createCategoria: CreateCategoriaDto){
        
                const tipo = getCategoriasId(idCategoria);
        
                if (!tipo) {
                throw new BadRequestException(
                    'Categoria no es válida'
                );
                }
        
                const categoria = this.categoriaProducto.create({
                ...createCategoria,
                tipo
                });
                
                return this.categoriaProducto.save(categoria);
            }
    
}