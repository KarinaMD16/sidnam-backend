  import { Module } from '@nestjs/common';
  import { EdusService } from './edus.service';
  import { EdusController } from './edus.controller';
  import { Type } from 'class-transformer';
  import { Password_Edus } from './entities/hash_contrasenia_edus.entity';
  import { TypeOrmModule } from '@nestjs/typeorm';

  @Module({
    imports: [TypeOrmModule.forFeature([Password_Edus])],
    providers: [EdusService],
    controllers: [EdusController]
  })
  export class EdusModule {}
