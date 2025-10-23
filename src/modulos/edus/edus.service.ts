import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreatePasswordDto } from './dtos/createPasswordDto';
import { UpdatePasswordDto } from './dtos/updatePasswordDto';
import { Password_Edus } from './entities/hash_contrasenia_edus.entity';


@Injectable()
export class EdusService {

    constructor(
        @InjectRepository(Password_Edus)
        private readonly hashedPasswordEdusRepository: Repository<Password_Edus>,
    ){}


    async createHashedPassword(createPasswordDto: CreatePasswordDto): Promise<{message: string}> {

        const passwordExisted = await this.hashedPasswordEdusRepository.find()

        if(passwordExisted){
            throw new BadRequestException('La contraseña ya ha sido creada')
        }

        const password = await this.hashedPasswordEdusRepository.create(createPasswordDto);
        this.hashedPasswordEdusRepository.save(password)

        return {message: "Contraseña creada correctamente"}
    }

    async getPassword(){
        return this.hashedPasswordEdusRepository.find()
    }

    async updatePassword(updatePassword: UpdatePasswordDto){

        const password = await this.hashedPasswordEdusRepository.findOne({
            where: {id_password: updatePassword.id}
        })

        if(!password){
            throw new NotFoundException('Password not found')
        }

        password.password = updatePassword.newPassword

        await this.hashedPasswordEdusRepository.save(password)

        return {message: 'Password updated'}
    }
    

}
