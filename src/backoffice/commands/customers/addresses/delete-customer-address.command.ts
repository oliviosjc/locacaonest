import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCustomerAddressCommand 
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}