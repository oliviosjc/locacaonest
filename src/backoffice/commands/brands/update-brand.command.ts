import { ApiProperty } from "@nestjs/swagger";
import { CreateBrandCommand } from "./create-brand.command";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBrandCommand extends CreateBrandCommand
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}