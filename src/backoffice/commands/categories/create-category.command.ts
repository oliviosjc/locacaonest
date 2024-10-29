import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryCommand
{
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    description: string;
}