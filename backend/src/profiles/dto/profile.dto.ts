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

  @ApiPropertyOptional({ enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'MEDIUM' })
  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  preferredPlanIntensity?: string;

  @ApiPropertyOptional({ example: '주중엔 저녁 훈련이 많아요' })
  @IsOptional()
  @IsString()
  memo?: string;
}
