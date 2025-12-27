import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Israel Israeli', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'israel@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'israel_123', description: 'User username' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'Password123!', description: 'User strong password' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: `Password must be at least 8 characters long and
      contain at least 1 lowercase letter,
      1 uppercase letter,
      1 number,
      and 1 symbol.`,
    },
  )
  password: string;
}
