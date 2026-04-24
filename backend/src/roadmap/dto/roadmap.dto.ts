import { IsInt, IsPositive, IsIn, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateRoadmapDto {
  @ApiProperty({ description: '로드맵을 생성할 목표 ID' })
  @IsInt()
  @IsPositive()
  goalId: number;
}

export class UpdateStageDto {
  @ApiProperty({ description: '단계 인덱스 (0부터 시작)' })
  @IsInt()
  @Min(0)
  @Max(20)
  stageIndex: number;

  @ApiProperty({ enum: ['completed', 'in_progress', 'pending'] })
  @IsIn(['completed', 'in_progress', 'pending'])
  status: 'completed' | 'in_progress' | 'pending';
}

export class CheckItemDto {
  @ApiProperty({ description: '단계 인덱스 (0부터 시작)' })
  @IsInt()
  @Min(0)
  @Max(20)
  stageIndex: number;

  @ApiProperty({ description: '항목 인덱스 (0부터 시작)' })
  @IsInt()
  @Min(0)
  itemIndex: number;

  @ApiProperty({ description: '체크 여부' })
  @IsBoolean()
  checked: boolean;
}
