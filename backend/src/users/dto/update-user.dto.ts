import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: '새닉네임' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nickname?: string;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: '현재비밀번호' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: '새비밀번호123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;
}
