import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScheduleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduleDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endTime?: string;
  @ApiPropertyOptional({ enum: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'] })
  @IsOptional() @IsEnum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']) repeatType?: string;
  @ApiPropertyOptional({ enum: ['MILITARY', 'SELF_DEV', 'PERSONAL', 'REST', 'OTHER'] })
  @IsOptional() @IsEnum(['MILITARY', 'SELF_DEV', 'PERSONAL', 'REST', 'OTHER']) category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() memo?: string;
}
