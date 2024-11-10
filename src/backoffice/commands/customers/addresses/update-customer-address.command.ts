import { ApiProperty } from "@nestjs/swagger";
import { CreateCustomerAddressCommand } from "./create-customer-address.command";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCustomerAddressCommand extends CreateCustomerAddressCommand
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}