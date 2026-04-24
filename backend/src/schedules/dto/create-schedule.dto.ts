import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: '야간 점호' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2026-03-18' })
  @IsString()
  scheduleDate: string;

  @ApiProperty({ example: '21:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '21:30' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ enum: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'], default: 'NONE' })
  @IsOptional()
  @IsEnum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'])
  repeatType?: string;

  @ApiPropertyOptional({ enum: ['DUTY', 'TRAINING', 'ROLLCALL', 'PERSONAL', 'STUDY', 'REST', 'OTHER'], default: 'PERSONAL' })
  @IsOptional()
  @IsEnum(['DUTY', 'TRAINING', 'ROLLCALL', 'PERSONAL', 'STUDY', 'REST', 'OTHER'])
  category?: string;

  @ApiPropertyOptional({ example: '생활관 점호' })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiPropertyOptional({ example: '2026-04-03', description: '익일 종료 시 종료 날짜' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'guard-night' })
  @IsOptional()
  @IsString()
  fatigueType?: string;
}
