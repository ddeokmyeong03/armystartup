import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateRoadmapDto {
  @ApiProperty({ description: '로드맵을 생성할 목표 ID' })
  @IsInt()
  @IsPositive()
  goalId: number;
}
