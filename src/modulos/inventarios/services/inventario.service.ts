import { Injectable } from "@nestjs/common";
import { CategoriasPrincipalesProductos } from "src/common/enums/categoriasPrincipalesProductos.enum";



@Injectable()
export class InventarioService {

    constructor(


    ){}

    async getCategoriasProductos() {
    
            const categorias = Object.entries(CategoriasPrincipalesProductos)
            .filter(([key, value]) => typeof value === 'number') 
            .map(([key, value]) => ({
                id: value as number,
                nombre: key,
            }));
    
            return categorias;
        }
}