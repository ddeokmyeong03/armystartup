import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScheduleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduleDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() repeatType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() memo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fatigueType?: string;
}
