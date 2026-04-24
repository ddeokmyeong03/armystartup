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

위 정보를 바탕으로 6단계 학습 로드맵을 JSON으로 생성해주세요.
각 단계는 2주 분량이며, 총 12주로 구성해주세요.
각 단계에는 구체적인 학습 항목 3-4개를 포함하고, 참고할 수 있는 무료 리소스(책명, 유튜브, 앱, 사이트 등)를 1개 포함하세요.
완료된 세션 수(${completedPlans}개)와 현재 진행률(${goal.progressPercent}%)을 고려하여 진행 상태(completed/in_progress/pending)를 적절히 설정하세요.
주당 ${goal.preferredSessionsPerWeek}회, 1회 ${goal.preferredMinutesPerSession}분 학습 일정에 맞게 현실적으로 구성하세요.

응답 형식 (JSON만 출력, 다른 텍스트 없이):
{
  "title": "로드맵 제목",
  "totalWeeks": 12,
  "stages": [
    {
      "week": "1-2주차",
      "title": "단계 제목",
      "status": "completed",
      "items": ["세부 학습 항목 1", "세부 학습 항목 2", "세부 학습 항목 3", "📚 참고: 리소스명"]
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

  /** 단계 상태 직접 업데이트 */
  async updateStage(userId: number, roadmapId: number, stageIndex: number, status: string) {
    const roadmap = await this.prisma.roadmap.findFirst({ where: { id: roadmapId, userId } });
    if (!roadmap) throw new NotFoundException('로드맵을 찾을 수 없습니다.');

    const stages: RoadmapStage[] = JSON.parse(roadmap.stages);
    if (stageIndex < 0 || stageIndex >= stages.length) {
      throw new NotFoundException('유효하지 않은 단계 인덱스입니다.');
    }

    stages[stageIndex].status = status as RoadmapStage['status'];
    const progressPercent = this.calcProgress(stages);

    const updated = await this.prisma.roadmap.update({
      where: { id: roadmapId },
      data: { stages: JSON.stringify(stages), progressPercent },
    });

    return {
      message: '단계 상태가 업데이트되었습니다.',
      data: { ...updated, stages },
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
        { week: '1-2주차', title: '시험 파악 및 계획', status: 'pending', items: ['시험 구조 분석', '출제 범위 정리', '학습 일정표 작성', '📚 참고: 해커스/에듀윌 무료 강의'] },
        { week: '3-4주차', title: '기초 이론 학습', status: 'pending', items: ['핵심 이론 1회독', '개념 정리 노트', '용어 암기', '📚 참고: 공식 교재'] },
        { week: '5-6주차', title: '심화 이론 학습', status: 'pending', items: ['심화 내용 학습', '이론 2회독', '오답 원인 분석', '📚 참고: 기출문제집'] },
        { week: '7-8주차', title: '기출문제 풀이', status: 'pending', items: ['최근 5개년 기출', '유형별 풀이 전략', '취약 파트 집중', '📚 참고: 국가자격시험 포털'] },
        { week: '9-10주차', title: '모의고사 훈련', status: 'pending', items: ['실전 모의고사 3회', '시간 배분 연습', '오답 총정리', '📚 참고: 스터디 앱'] },
        { week: '11-12주차', title: '최종 마무리', status: 'pending', items: ['핵심 요약본 정리', '약점 최종 보완', '컨디션 관리', '📚 참고: 암기 카드'] },
      ],
      STUDY: [
        { week: '1-2주차', title: '학습 설계', status: 'pending', items: ['목표 세분화', '교재/강의 선택', '학습 루틴 설계', '📚 참고: 유튜브 입문 강의'] },
        { week: '3-4주차', title: '기초 개념 학습', status: 'pending', items: ['기본 개념 1회독', '핵심 요약 노트', '예제 문제 풀기', '📚 참고: 칸아카데미'] },
        { week: '5-6주차', title: '심화 내용 학습', status: 'pending', items: ['심화 이론 학습', '응용 문제 도전', '이해 안 된 부분 재학습', '📚 참고: 교육부 e학습터'] },
        { week: '7-8주차', title: '반복 학습', status: 'pending', items: ['전체 내용 2회독', '플래시카드 제작', '취약 파트 집중 복습', '📚 참고: Anki 암기 앱'] },
        { week: '9-10주차', title: '응용 및 실습', status: 'pending', items: ['응용 문제 풀이', '실전 적용 연습', '자기 점검', '📚 참고: 관련 유튜브 채널'] },
        { week: '11-12주차', title: '마무리 및 점검', status: 'pending', items: ['전체 복습', '최종 자기평가', '다음 목표 설정', '📚 참고: 학습 일지 정리'] },
      ],
      CODING: [
        { week: '1-2주차', title: '언어 기초 문법', status: 'pending', items: ['변수·자료형·조건문', '반복문·함수', '입출력 연습', '📚 참고: 프로그래머스 입문 문제'] },
        { week: '3-4주차', title: '자료구조 기초', status: 'pending', items: ['배열·문자열', '스택·큐', '기본 정렬', '📚 참고: 백준 브론즈 문제'] },
        { week: '5-6주차', title: '알고리즘 기초', status: 'pending', items: ['이분탐색·DFS/BFS', '재귀', '그리디 기초', '📚 참고: 이것이 코딩테스트다(유튜브)'] },
        { week: '7-8주차', title: '알고리즘 심화', status: 'pending', items: ['동적 프로그래밍', '그래프 탐색', '실버 문제 풀이', '📚 참고: 백준 실버 문제'] },
        { week: '9-10주차', title: '프로젝트 실습', status: 'pending', items: ['미니 프로젝트 설계', 'API 연동 실습', 'GitHub 커밋', '📚 참고: GitHub 무료 교육'] },
        { week: '11-12주차', title: '코딩테스트 대비', status: 'pending', items: ['프로그래머스 레벨1-2', '모의 코딩테스트', '포트폴리오 정리', '📚 참고: LeetCode Easy'] },
      ],
      LANGUAGE: [
        { week: '1-2주차', title: '기초 실력 점검', status: 'pending', items: ['현재 실력 진단', '어휘 암기 시작', '발음 교정', '📚 참고: Duolingo 무료앱'] },
        { week: '3-4주차', title: '문법 기초', status: 'pending', items: ['핵심 문법 학습', '패턴 문장 암기', '듣기 연습', '📚 참고: EBS 무료 강의'] },
        { week: '5-6주차', title: '어휘 확장', status: 'pending', items: ['주제별 어휘 500개', '단어장 제작', '독해 연습', '📚 참고: Quizlet 앱'] },
        { week: '7-8주차', title: '말하기·쓰기', status: 'pending', items: ['기본 회화 패턴', '작문 연습', '말하기 녹음 연습', '📚 참고: 스피킹 유튜브'] },
        { week: '9-10주차', title: '실전 모의 훈련', status: 'pending', items: ['모의시험 응시', '오답 분석', '취약 영역 집중', '📚 참고: 토익/토스 무료 기출'] },
        { week: '11-12주차', title: '최종 마무리', status: 'pending', items: ['전 범위 복습', '실전 감각 유지', '시험 준비 완료', '📚 참고: 암기 플래시카드'] },
      ],
    };
    return templates[goalType] ?? templates.STUDY;
  }
}
