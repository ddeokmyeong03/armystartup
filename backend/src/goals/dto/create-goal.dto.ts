import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: '토익 공부' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ enum: ['STUDY', 'CERTIFICATE', 'EXERCISE', 'READING', 'CODING', 'OTHER'], default: 'STUDY' })
  @IsOptional()
  @IsEnum(['STUDY', 'CERTIFICATE', 'EXERCISE', 'READING', 'CODING', 'OTHER'])
  type?: string;

  @ApiPropertyOptional({ example: '토익 900점 목표' })
  @IsOptional()
  @IsString()
  targetDescription?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(480)
  preferredMinutesPerSession?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  preferredSessionsPerWeek?: number;
}
