import { ApiProperty } from "@nestjs/swagger";
import { CreateCustomerContactCommand } from "./create-customer-contact.command";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCustomerContactCommand extends CreateCustomerContactCommand
{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}