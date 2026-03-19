import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustPlanDto {
  @ApiProperty({ example: '20:30' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '21:30' })
  @IsString()
  endTime: string;
}
