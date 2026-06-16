import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';

@ApiTags('Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({ summary: '기록 생성' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateRecordDto) {
    return this.recordsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '기록 목록 조회' })
  @ApiQuery({ name: 'category', required: false })
  findAll(@CurrentUser() user: JwtPayload, @Query('category') category?: string) {
    return this.recordsService.findAll(user.userId, category);
  }

  @Get(':id')
  @ApiOperation({ summary: '기록 상세 조회' })
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.recordsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '기록 수정' })
  update(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateRecordDto>) {
    return this.recordsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '기록 삭제' })
  remove(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.recordsService.remove(user.userId, id);
  }
}
