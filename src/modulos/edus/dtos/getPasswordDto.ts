import { Expose } from "class-transformer";

export class GetPasswordDto{
    @Expose()
    password: string;
}