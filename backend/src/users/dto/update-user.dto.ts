import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: '새닉네임' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nickname?: string;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
