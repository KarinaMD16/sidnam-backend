import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { EdusService } from './edus.service';
import { CreatePasswordDto } from './dtos/createPasswordDto';
import { UpdatePasswordDto } from './dtos/updatePasswordDto';
import { AuthGuard } from '../autenticacion/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('edus')
export class EdusController {

    constructor(
        private readonly edusService: EdusService
    ) {}

    @Post('password')
    createPassword(@Body() createPassword: CreatePasswordDto){
        return this.edusService.createHashedPassword(createPassword)
    }

    @Get('password')
    getPassword(){
        return this.edusService.getPassword()
    }

    @Put('password')
    updatePassword(@Body() uupdatePassword: UpdatePasswordDto){
        return this.edusService.updatePassword(uupdatePassword)
    }

    
}
