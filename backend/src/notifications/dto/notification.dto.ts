import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'goal' })
  @IsString()
  type: string;

  @ApiProperty({ example: '정보처리기사 필기 D-23' })
  @IsString()
  title: string;

  @ApiProperty({ example: '마감일이 다가오고 있어요.' })
  @IsString()
  body: string;

  @ApiPropertyOptional({ example: 'goals' })
  @IsOptional()
  @IsString()
  link?: string;
}
