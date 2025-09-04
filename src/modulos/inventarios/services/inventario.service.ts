import {  Injectable } from "@nestjs/common";
import { CategoriasOptions } from "src/common/enums/categoriasPrincipalesProductos.enum";


@Injectable()
export class InventarioService {

    constructor(

    ){}

    getCategorias() {
            return CategoriasOptions.map(opt => ({
              id: opt.id,
              nombre: opt.nombre, 
            }));
        }
    
}