import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches, ValidateIf } from "class-validator";
import { IsEqual } from "src/utils/equal.validator";

export class ResetPasswordDTO
{
    @ApiProperty()
    @IsString()
    token: string;
    
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
}