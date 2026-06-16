import { IsString, IsOptional, IsDateString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({ example: '자격증', description: '자격증|어학|독서|운동' })
  @IsString()
  category: string;

  @ApiProperty({ example: '정보처리기사 필기 합격' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: '2026-06-16' })
  @IsDateString()
  recordDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  evidenceUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  meta?: Record<string, unknown>;
}
