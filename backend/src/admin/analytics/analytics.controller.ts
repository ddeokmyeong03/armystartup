import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBasicAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin Analytics')
@ApiBasicAuth()
@UseGuards(AdminGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'DAU, MAU, 상위 목표 카테고리 등 전체 현황' })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('records')
  @ApiOperation({ summary: '기록 카테고리별 분포, 인증/자가입력 현황' })
  getRecords() {
    return this.analyticsService.getRecordsAnalytics();
  }

  @Get('challenges')
  @ApiOperation({ summary: '챌린지 카테고리별 분포, 판정 방식별 현황' })
  getChallenges() {
    return this.analyticsService.getChallengesAnalytics();
  }

  @Get('users')
  @ApiOperation({ summary: '계급/군종별 유저 분포 및 월별 가입' })
  getUsers() {
    return this.analyticsService.getUsersAnalytics();
  }
}
