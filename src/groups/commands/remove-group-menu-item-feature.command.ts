import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class RemoveGroupMenuItemFeatureCommand
{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    groupId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    menuItemId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    menuItemFeatureId: string
}