import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCustomerContactCommand 
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    position: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    whatsapp: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    email: string;

    @ApiProperty()
    systemCommunication: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    customerId: string;
}