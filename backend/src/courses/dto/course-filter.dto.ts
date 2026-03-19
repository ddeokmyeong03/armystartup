import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CourseFilterDto {
  @ApiPropertyOptional({ enum: ['JANGBYEONGEEUM', 'DEFENSE_TRANSITION', 'K_MOOC', 'CERTIFICATE', 'OTHER'] })
  @IsOptional()
  @IsEnum(['JANGBYEONGEEUM', 'DEFENSE_TRANSITION', 'K_MOOC', 'CERTIFICATE', 'OTHER'])
  source?: string;

  @ApiPropertyOptional({ enum: ['LANGUAGE', 'IT', 'LEADERSHIP', 'EXERCISE', 'CERTIFICATE', 'OTHER'] })
  @IsOptional()
  @IsEnum(['LANGUAGE', 'IT', 'LEADERSHIP', 'EXERCISE', 'CERTIFICATE', 'OTHER'])
  category?: string;

  @ApiPropertyOptional({ enum: ['STUDY', 'CERTIFICATE', 'EXERCISE', 'READING', 'CODING', 'OTHER'] })
  @IsOptional()
  @IsString()
  goalType?: string;
}
