import { Expose } from "class-transformer";

export class GetPasswordDto{

    @Expose()
    id_password: number
    
    @Expose()
    password: string;
}