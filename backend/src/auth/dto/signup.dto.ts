import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'soldier@army.mil.kr' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secure1234!' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({ example: '진덕명' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname: string;
}
