import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseCommand } from "src/utils/base.command";

export class AddCompanyUserGroupCommand extends BaseCommand
{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;
}