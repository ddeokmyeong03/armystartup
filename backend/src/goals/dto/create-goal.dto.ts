import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: '정보처리기사 필기 합격' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '자격증', description: '자격증/어학/취업/취미/독서/체력/기타' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'STUDY' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: '2026-05-15' })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiPropertyOptional({ example: '정보처리기사 필기 합격 목표' })
  @IsOptional()
  @IsString()
  targetDescription?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

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
