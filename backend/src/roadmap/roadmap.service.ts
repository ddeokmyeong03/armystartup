import { Injectable, NotFoundException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

export interface RoadmapStage {
  week: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  items: string[];
}

@Injectable()
export class RoadmapService {
  private anthropic: Anthropic;

  constructor(private readonly prisma: PrismaService) {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  /** 사용자의 현재 로드맵 목록 조회 */
  async findAll(userId: number) {
    const roadmaps = await this.prisma.roadmap.findMany({
      where: { userId },
      include: { goal: { select: { title: true, type: true, progressPercent: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      message: '로드맵 목록을 조회했습니다.',
      data: roadmaps.map((r) => ({
        ...r,
        stages: JSON.parse(r.stages) as RoadmapStage[],
      })),
    };
  }

  /** 특정 로드맵 상세 조회 */
  async findOne(userId: number, roadmapId: number) {
    const roadmap = await this.prisma.roadmap.findFirst({
      where: { id: roadmapId, userId },
      include: { goal: { select: { title: true, type: true, progressPercent: true } } },
    });
    if (!roadmap) throw new NotFoundException('로드맵을 찾을 수 없습니다.');

    return {
      message: '로드맵을 조회했습니다.',
      data: { ...roadmap, stages: JSON.parse(roadmap.stages) as RoadmapStage[] },
    };
  }

  /** Claude API로 목표 기반 로드맵 생성 (또는 업데이트) */
  async generate(userId: number, goalId: number) {
    const goal = await this.prisma.goal.findFirst({ where: { id: goalId, userId } });
    if (!goal) throw new NotFoundException('목표를 찾을 수 없습니다.');

    // 기존 로드맵 확인 (업데이트인 경우)
    const existing = await this.prisma.roadmap.findFirst({ where: { userId, goalId } });
    const updateCount = (existing?.updateCount ?? 0) + 1;

    // 학습 이력 조회 (진행 맥락 파악용)
    const completedPlans = await this.prisma.aiPlan.count({
      where: { userId, goalId, status: 'COMPLETED' },
    });

    const prompt = `군 병사의 자기개발 로드맵을 생성해주세요.

목표: ${goal.title}
목표 유형: ${goal.type}
목표 설명: ${goal.targetDescription ?? '없음'}
주당 학습 빈도: ${goal.preferredSessionsPerWeek}회
1회 학습 시간: ${goal.preferredMinutesPerSession}분
완료한 학습 세션 수: ${completedPlans}개
현재 진행률: ${goal.progressPercent}%

위 정보를 바탕으로 4단계 학습 로드맵을 JSON으로 생성해주세요.
각 단계는 2-4주 분량이며, 총 12주 내외로 구성해주세요.
완료된 세션 수를 고려하여 진행 상태(completed/in_progress/pending)를 적절히 설정하세요.

응답 형식 (JSON만 출력):
{
  "title": "로드맵 제목",
  "totalWeeks": 12,
  "stages": [
    {
      "week": "1-3주차",
      "title": "단계 제목",
      "status": "completed",
      "items": ["세부 학습 항목 1", "세부 학습 항목 2", "세부 학습 항목 3"]
    }
  ]
}`;

    let title = `${goal.title} 플랜`;
    let totalWeeks = 12;
    let stages: RoadmapStage[] = this.getFallbackStages(goal.type);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: '당신은 군 병사의 자기개발을 돕는 AI 코치 밀로그입니다. 주어진 목표에 맞는 실용적인 학습 로드맵을 JSON 형식으로 생성합니다.',
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.title) title = parsed.title;
        if (parsed.totalWeeks) totalWeeks = parsed.totalWeeks;
        if (Array.isArray(parsed.stages)) stages = parsed.stages;
      }
    } catch {
      // Claude 실패 시 fallback 사용
    }

    const nextUpdateDate = dayjs().add(7, 'day').format('YYYY-MM-DD');
    const progressPercent = this.calcProgress(stages);

    let roadmap;
    if (existing) {
      roadmap = await this.prisma.roadmap.update({
        where: { id: existing.id },
        data: {
          title,
          totalWeeks,
          stages: JSON.stringify(stages),
          progressPercent,
          updateCount,
          nextUpdateDate,
        },
      });
    } else {
      roadmap = await this.prisma.roadmap.create({
        data: {
          userId,
          goalId,
          title,
          totalWeeks,
          stages: JSON.stringify(stages),
          progressPercent,
          updateCount: 1,
          nextUpdateDate,
        },
      });
    }

    return {
      message: `로드맵이 ${existing ? '업데이트' : '생성'}되었습니다.`,
      data: { ...roadmap, stages },
    };
  }

  /** 진행률 계산: completed 단계 비율 */
  private calcProgress(stages: RoadmapStage[]): number {
    if (stages.length === 0) return 0;
    const completed = stages.filter((s) => s.status === 'completed').length;
    return Math.round((completed / stages.length) * 100);
  }

  /** Claude 실패 시 목표 유형별 기본 로드맵 */
  private getFallbackStages(goalType: string): RoadmapStage[] {
    const templates: Record<string, RoadmapStage[]> = {
      CERTIFICATE: [
        { week: '1-2주차', title: '기초 이론', status: 'pending', items: ['개념 정리', '핵심 이론 학습', '기출 분석'] },
        { week: '3-5주차', title: '심화 학습', status: 'pending', items: ['심화 이론', '문제 유형 분석', '오답 노트'] },
        { week: '6-9주차', title: '문제 풀이', status: 'pending', items: ['기출문제 풀이', '모의고사', '취약점 보완'] },
        { week: '10-12주차', title: '최종 마무리', status: 'pending', items: ['최종 정리', '실전 모의고사', '시험 준비'] },
      ],
      STUDY: [
        { week: '1-2주차', title: '기초 다지기', status: 'pending', items: ['개념 학습', '기본기 확인', '학습 계획 수립'] },
        { week: '3-5주차', title: '핵심 내용', status: 'pending', items: ['주요 개념 학습', '예제 풀이', '정리 노트'] },
        { week: '6-9주차', title: '응용 연습', status: 'pending', items: ['응용 문제', '프로젝트 실습', '복습'] },
        { week: '10-12주차', title: '마무리', status: 'pending', items: ['전체 복습', '부족한 부분 보완', '목표 달성 확인'] },
      ],
      CODING: [
        { week: '1-2주차', title: '언어 기초', status: 'pending', items: ['문법 학습', '기본 자료구조', '입출력 연습'] },
        { week: '3-5주차', title: '알고리즘', status: 'pending', items: ['정렬/탐색', '재귀', '동적 프로그래밍'] },
        { week: '6-9주차', title: '프로젝트', status: 'pending', items: ['미니 프로젝트', 'API 활용', '코드 리뷰'] },
        { week: '10-12주차', title: '실전 대비', status: 'pending', items: ['코딩 테스트', '포트폴리오 정리', '취업 준비'] },
      ],
    };
    return templates[goalType] ?? templates.STUDY;
  }
}
