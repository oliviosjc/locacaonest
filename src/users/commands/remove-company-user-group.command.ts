import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RemoveCompanyUserGroupCommand 
{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    groupId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    companyId: string;
}