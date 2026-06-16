import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@ApiTags('Challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @ApiOperation({ summary: '챌린지 개설' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateChallengeDto) {
    return this.challengesService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '챌린지 목록 (탐색)' })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query('category') category?: string) {
    return this.challengesService.findAll(category);
  }

  @Get('mine')
  @ApiOperation({ summary: '내 챌린지 목록' })
  findMine(@CurrentUser() user: JwtPayload) {
    return this.challengesService.findMine(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '챌린지 상세' })
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.challengesService.findOne(user.userId, id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: '챌린지 참여' })
  join(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.challengesService.join(user.userId, id);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: '참여 현황 조회' })
  getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.challengesService.getParticipants(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: '판정 자료 제출' })
  submitEvidence(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { evidenceUrl: string; comment?: string },
  ) {
    return this.challengesService.submitEvidence(user.userId, id, body);
  }
}
