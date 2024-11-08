import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCustomerContactCommand
{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: string;
}