import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmAccountDTO
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}