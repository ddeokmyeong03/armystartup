import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ example: '토익 공부 어떤 강의가 좋을까?' })
  @IsString()
  @MaxLength(500)
  message: string;
}
