import { IsArray, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecommendAiPlanDto {
  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @IsInt({ each: true })
  goalIds: number[];

  @ApiProperty({ example: '2026-03-18' })
  @IsString()
  targetDate: string;
}
