import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { CoursesService } from './courses.service';
import { CourseFilterDto } from './dto/course-filter.dto';
import { KmoocSyncService } from './kmooc-sync.service';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly kmoocSyncService: KmoocSyncService,
  ) {}

  @Get()
  @ApiOperation({ summary: '강의 목록 조회 (필터: source, category, goalType)' })
  findAll(@Query() filter: CourseFilterDto) {
    return this.coursesService.findAll(filter);
  }

  @Get('saved')
  @ApiOperation({ summary: '저장한 강의 목록' })
  findSaved(@CurrentUser() user: JwtPayload) {
    return this.coursesService.findSaved(user.userId);
  }

  @Get('recommend')
  @ApiOperation({ summary: 'AI 추천 강의 목록 (목표·일정 기반)' })
  recommend(@CurrentUser() user: JwtPayload) {
    return this.coursesService.recommend(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '강의 상세 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Post('recommendations/:id/save')
  @ApiOperation({ summary: '추천 강의 저장' })
  save(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.coursesService.save(user.userId, id);
  }

  @Post('recommendations/:id/dismiss')
  @ApiOperation({ summary: '추천 강의 닫기' })
  dismiss(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.coursesService.dismiss(user.userId, id);
  }

  @Post('admin/sync-kmooc')
  @ApiOperation({ summary: '[관리자] K-MOOC 강좌 데이터 동기화' })
  async syncKmooc() {
    const result = await this.kmoocSyncService.syncCourses();
    return {
      message: `K-MOOC 동기화 완료 — 성공: ${result.synced}건, 실패: ${result.skipped}건`,
      data: result,
    };
  }
}
