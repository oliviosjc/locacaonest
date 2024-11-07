import { IsNotEmpty, IsString, Length } from "class-validator";
import { BaseCommand } from "src/utils/base.command";

export class CreateCategoryCommand extends BaseCommand
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