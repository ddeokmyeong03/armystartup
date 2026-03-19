import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchApplyDto {
  @ApiProperty({ example: [101, 102, 103] })
  @IsArray()
  @IsInt({ each: true })
  planIds: number[];
}
