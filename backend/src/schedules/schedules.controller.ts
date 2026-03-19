import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: '일정 생성' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '전체 일정 조회' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.schedulesService.findAll(user.userId);
  }

  @Get('by-date')
  @ApiOperation({ summary: '날짜별 일정 조회' })
  @ApiQuery({ name: 'date', example: '2026-03-18' })
  findByDate(@CurrentUser() user: JwtPayload, @Query('date') date: string) {
    return this.schedulesService.findByDate(user.userId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: '일정 상세 조회' })
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.schedulesService.findOne(user.userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: '일정 수정' })
  update(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScheduleDto) {
    return this.schedulesService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '일정 삭제' })
  remove(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.schedulesService.remove(user.userId, id);
  }
}
