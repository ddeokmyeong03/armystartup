import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChallengeDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '자격증' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'NON_COMPETITIVE', description: 'RANKING|PASS_FAIL|NON_COMPETITIVE' })
  @IsString()
  judgmentType: string;

  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-07-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isRewarded?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  entryFee?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  prizeMoney?: number;
}
