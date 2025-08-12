import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegistroDonacion } from "../../entities/registroDonacion.entity";
import { Donador } from "../../entities/donador.entity";


@Injectable()
export class GetRegistrosDonacionUseCase {
    constructor(
        @InjectRepository(RegistroDonacion)
        private readonly registroDonacion: Repository<RegistroDonacion>,
               
        @InjectRepository(Donador)
        private readonly donadorRepository: Repository<Donador>,
    
      ) {}
}