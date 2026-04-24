import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertProfileDto {
  @ApiPropertyOptional({ example: '06:30' })
  @IsOptional()
  @IsString()
  wakeUpTime?: string;

  @ApiPropertyOptional({ example: '23:00' })
  @IsOptional()
  @IsString()
  sleepTime?: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(480)
  availableStudyMinutes?: number;

  @ApiPropertyOptional({ example: 'MEDIUM' })
  @IsOptional()
  @IsString()
  preferredPlanIntensity?: string;

  @ApiPropertyOptional({ example: '주중엔 저녁 훈련이 많아요' })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiPropertyOptional({ example: '2025-10-15' })
  @IsOptional()
  @IsString()
  dischargeDate?: string;

  @ApiPropertyOptional({ example: '2024-03-05' })
  @IsOptional()
  @IsString()
  enlistedAt?: string;

  @ApiPropertyOptional({ example: '00사단 00대대' })
  @IsOptional()
  @IsString()
  unitName?: string;

  @ApiPropertyOptional({ example: '일병' })
  @IsOptional()
  @IsString()
  rankName?: string;

  @ApiPropertyOptional({ example: '육군' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ example: '["cert","lang"]' })
  @IsOptional()
  @IsString()
  interests?: string;
}
