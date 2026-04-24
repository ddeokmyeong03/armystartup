import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CourseFilterDto {
  @ApiPropertyOptional({ example: 'K_MOOC' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ example: 'IT' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'STUDY' })
  @IsOptional()
  @IsString()
  goalType?: string;
}
