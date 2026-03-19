import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { AiPlansService } from './ai-plans.service';
import { RecommendAiPlanDto } from './dto/recommend.dto';
import { BatchApplyDto } from './dto/batch-apply.dto';
import { AdjustPlanDto } from './dto/adjust-plan.dto';

@ApiTags('AI Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-plans')
export class AiPlansController {
  constructor(private readonly aiPlansService: AiPlansService) {}

  @Post('recommend')
  @ApiOperation({ summary: 'AI 일정 기반 계획 추천' })
  recommend(@CurrentUser() user: JwtPayload, @Body() dto: RecommendAiPlanDto) {
    return this.aiPlansService.recommend(user.userId, dto);
  }

  @Post('apply-batch')
  @ApiOperation({ summary: '계획 일괄 적용' })
  batchApply(@CurrentUser() user: JwtPayload, @Body() dto: BatchApplyDto) {
    return this.aiPlansService.batchApply(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '추천 계획 목록' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.aiPlansService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '추천 계획 상세' })
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.aiPlansService.findOne(user.userId, id);
  }

  @Post(':id/apply')
  @ApiOperation({ summary: '계획 개별 적용' })
  apply(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.aiPlansService.apply(user.userId, id);
  }

  @Patch(':id/adjust')
  @ApiOperation({ summary: '계획 시간 조정' })
  adjust(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: AdjustPlanDto) {
    return this.aiPlansService.adjust(user.userId, id, dto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: '계획 완료 처리' })
  complete(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.aiPlansService.complete(user.userId, id);
  }

  @Patch(':id/miss')
  @ApiOperation({ summary: '계획 미완료 처리' })
  miss(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.aiPlansService.miss(user.userId, id);
  }
}
