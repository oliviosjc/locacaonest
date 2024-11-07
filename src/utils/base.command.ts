import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class BaseCommand
{
    @ApiProperty()
    @IsOptional()
    @IsString()
    companyId? : string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    groupId? : string;
}