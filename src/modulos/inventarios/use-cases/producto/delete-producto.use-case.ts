import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Producto } from "../../entities/producto.entity";


@Injectable()
export class DeleteProductoUseCase {

    constructor(

        @InjectRepository(Producto)
            private readonly productoRepository: Repository<Producto>,
    ){}

    async deleteProducto(idProducto: number): Promise<{message: string}> {
    
        const productoEliminado = await this.productoRepository.findOne({
            where: {id: idProducto}
        })
    
        if(!productoEliminado){
            throw new NotFoundException('Producto no encontrado')
        }
    
        await this.productoRepository.remove(productoEliminado)
    
        return {message: 'Producto eliminado correctamente'};
      }
}