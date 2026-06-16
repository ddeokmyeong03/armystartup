import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertProfileDto {
  @ApiPropertyOptional({ example: '일병' })
  @IsOptional()
  @IsString()
  rankName?: string;

  @ApiPropertyOptional({ example: '육군' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ example: '00사단 00대대' })
  @IsOptional()
  @IsString()
  unitName?: string;

  @ApiPropertyOptional({ example: '2024-03-05' })
  @IsOptional()
  @IsString()
  enlistedAt?: string;

  @ApiPropertyOptional({ example: '2025-10-15' })
  @IsOptional()
  @IsString()
  dischargeDate?: string;

  @ApiPropertyOptional({ example: 'TOEIC 900점 달성' })
  @IsOptional()
  @IsString()
  goal?: string;
}
