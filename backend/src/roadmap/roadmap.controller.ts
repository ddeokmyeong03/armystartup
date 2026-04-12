import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { RoadmapService } from './roadmap.service';
import { GenerateRoadmapDto } from './dto/roadmap.dto';

@ApiTags('Roadmap')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  @ApiOperation({ summary: '내 로드맵 전체 조회' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.roadmapService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '로드맵 상세 조회' })
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.findOne(user.userId, id);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Claude API로 로드맵 생성/업데이트' })
  generate(@CurrentUser() user: JwtPayload, @Body() dto: GenerateRoadmapDto) {
    return this.roadmapService.generate(user.userId, dto.goalId);
  }
}
