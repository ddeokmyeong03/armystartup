import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ example: '상병' })
  @IsOptional()
  @IsString()
  rankName?: string;

  @ApiPropertyOptional({ example: '육군' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ example: '제00보병사단' })
  @IsOptional()
  @IsString()
  unitName?: string;

  @ApiPropertyOptional({ example: '2024-10-03' })
  @IsOptional()
  @IsString()
  enlistedAt?: string;

  @ApiPropertyOptional({ example: '2026-07-02' })
  @IsOptional()
  @IsString()
  dischargeDate?: string;
}
