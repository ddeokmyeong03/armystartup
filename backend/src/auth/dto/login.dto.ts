import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'soldier@army.mil.kr' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secure1234!' })
  @IsString()
  password: string;
}
