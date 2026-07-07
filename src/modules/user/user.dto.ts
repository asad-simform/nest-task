import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
    @ApiProperty({
        example: 'sample@gmail.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'Merchant',
    })
    @IsString()
    lastName!: string;

    @ApiProperty({
        example: 'Asad',
    })
    @IsString()
    firstName!: string;

    @ApiProperty({
        example: '123456',
    })
    @IsString()
    password!: string;
}

export class LoginUserDTO {
    @ApiProperty({
        example: 'sample@gmail.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '123456',
    })
    @IsString()
    password!: string;
}
