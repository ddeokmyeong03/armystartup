import { IsString, IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertProfileDto {
  @ApiProperty({ example: '06:30' })
  @IsString()
  wakeUpTime: string;

  @ApiProperty({ example: '23:00' })
  @IsString()
  sleepTime: string;

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

  @ApiPropertyOptional({ example: '2025-10-15', description: '전역 예정일 (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dischargeDate?: string;

  @ApiPropertyOptional({ example: '00사단 00대대', description: '소속 부대' })
  @IsOptional()
  @IsString()
  unitName?: string;

  @ApiPropertyOptional({ example: '일병', description: '계급' })
  @IsOptional()
  @IsString()
  rankName?: string;
}
