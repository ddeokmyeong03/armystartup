import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: '목표 생성' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '목표 전체 조회' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.goalsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '목표 상세 조회' })
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.goalsService.findOne(user.userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: '목표 수정 (전체)' })
  update(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(user.userId, id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '목표 수정 (부분)' })
  partialUpdate(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '목표 삭제' })
  remove(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.goalsService.remove(user.userId, id);
  }
}
