import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGoalDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(10) @Max(480) preferredMinutesPerSession?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Max(7) preferredSessionsPerWeek?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deadline?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() pinned?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) @Max(100) progressPercent?: number;
}
