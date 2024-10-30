import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateModelCommand
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

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    brandId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    categoryId: string;
}