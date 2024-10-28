import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCompanyCommand
{
    @ApiProperty()
    @IsString()
    @Length(1,128)
    @IsNotEmpty()
    socialName: string;

    @ApiProperty()
    @IsString()
    @Length(1,128)
    @IsNotEmpty()
    fantasyName: string;

    @ApiProperty()
    @IsString()
    @Length(14)
    @IsNotEmpty()
    document: string;
}