import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCustomerDocumentConfigurationCommand 
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    name: string

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    required: boolean;
}