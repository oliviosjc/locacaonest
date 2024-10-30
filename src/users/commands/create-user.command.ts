import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, ValidateIf } from "class-validator";
import { IsEqual } from "../../utils/equal.validator";

export class CreateUserCommand 
{
    @ApiProperty()
    @IsString({ message: "O nome deve ser uma string" })
    @Length(1, 255, { message: "O nome deve ter entre 1 e 255 caracteres" })
    fullName: string;

    @ApiProperty()
    @IsEmail({}, { message: "O e-mail deve ser válido" })
    email: string;

    @ApiProperty()
    @IsString({message: "A senha deve ser uma string"})
    @Length(6, 18, {message: "A senha deve ter entre 6 e 18 caracteres"})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número ou um caractere especial'})
    password: string;

    @ApiProperty()
    @IsString({ message: "A confirmação da senha deve ser uma string" })
    @ValidateIf(o => o.password)
    @IsEqual('password', { message: 'A confirmação da senha deve ser igual à senha' })
    passwordConfirm: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    companyId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    groupId: string;

    @ApiProperty()
    @IsString()
    @Length(14)
    @IsNotEmpty()
    document: string;
}