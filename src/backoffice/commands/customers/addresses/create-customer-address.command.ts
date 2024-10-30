import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCustomerAddressCommand
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    alias: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 64)
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(8)
    zipCode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 128)
    neighborhood: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 5)
    number: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Length(1, 128)
    reference: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Length(1, 64)
    complement: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;
}
