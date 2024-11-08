import { IsNotEmpty, IsString } from "class-validator";
import { CreateCategoryCommand } from "./create-category.command";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryCommand extends CreateCategoryCommand
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}