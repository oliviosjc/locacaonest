import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateGroupCommand
{
    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 128)
    name: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    parentGroupId?: string;
}