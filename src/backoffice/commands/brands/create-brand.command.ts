import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateBrandCommand
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
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    image: string;
}