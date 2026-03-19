import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseFilterDto } from './dto/course-filter.dto';
import OpenAI from 'openai';

@Injectable()
export class CoursesService {
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async findAll(filter: CourseFilterDto) {
    const where: any = { isActive: true };
    if (filter.source) where.source = filter.source;
    if (filter.category) where.category = filter.category;
    if (filter.goalType) where.targetGoalType = filter.goalType;

    const courses = await this.prisma.course.findMany({ where, orderBy: { title: 'asc' } });
    return { message: '강의 목록을 조회했습니다.', data: { courses, total: courses.length } };
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findFirst({ where: { id, isActive: true } });
    if (!course) throw new NotFoundException('강의를 찾을 수 없습니다.');
    return { message: '강의를 조회했습니다.', data: course };
  }

  async recommend(userId: number) {
    // 1단계: 사용자 활성 목표 조회
    const goals = await this.prisma.goal.findMany({ where: { userId, isActive: true } });
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    const availableMinutes = profile?.availableStudyMinutes ?? 60;

    // 2단계: 목표 타입 기반 강의 후보 필터링 (목표 없으면 전체 강의 대상)
    const goalTypes = goals.map((g) => g.type);
    const candidates = await this.prisma.course.findMany({
      where: {
        isActive: true,
        durationMinutes: { lte: availableMinutes + 30 },
        ...(goalTypes.length > 0 && {
          OR: [{ targetGoalType: { in: goalTypes as any } }, { targetGoalType: null }],
        }),
      },
      take: 10,
    });

    if (candidates.length === 0) {
      return { message: '추천할 강의가 없습니다. 목표를 먼저 등록해 주세요.', data: { recommendations: [] } };
    }

    // 3단계: 기존 추천 삭제 후 GPT 추천 생성
    await this.prisma.courseRecommendation.deleteMany({ where: { userId, status: 'RECOMMENDED' } });

    let gptResults: Array<{ courseId: number; reason: string; priority: number }> = [];

    try {
      const prompt = `
사용자 목표: ${goals.length > 0 ? goals.map((g) => `${g.title}(${g.type})`).join(', ') : '목표 없음'}
하루 가용 학습 시간: ${availableMinutes}분

추천 대상 강의 목록:
${candidates.map((c) => `- ID:${c.id} | ${c.title} | ${c.source} | ${c.durationMinutes}분 | 태그: ${c.tags.join(', ')}`).join('\n')}

위 강의 중 사용자 목표와 학습 시간에 가장 적합한 강의 최대 3개를 선별하고 추천 이유를 작성해주세요.
반드시 제공된 강의 목록에 있는 강의만 추천하세요.
JSON 배열로 응답하세요: [{"courseId": number, "reason": "추천 이유 (2-3문장)", "priority": 1}]
      `.trim();

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 군 병사의 자기개발을 돕는 AI 가이드 밀로그입니다. 장병e음, 국방전직교육원 강의를 중심으로 추천합니다. JSON 배열로만 응답하세요.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 600,
      });

      const content = response.choices[0].message.content ?? '[]';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) gptResults = JSON.parse(jsonMatch[0]);
    } catch {
      // GPT 실패 시 규칙 기반으로 fallback
      gptResults = candidates.slice(0, 3).map((c, i) => ({
        courseId: c.id,
        reason: `${c.title}은 ${c.durationMinutes}분 과정으로 현재 가용 시간 내에 수강 가능합니다.`,
        priority: i + 1,
      }));
    }

    // 4단계: 추천 결과 DB 저장
    const validResults = gptResults.filter((r) => candidates.some((c) => c.id === r.courseId));
    const saved = await Promise.all(
      validResults.map((r) => {
        const matchedGoal = goals.find((g) => {
          const course = candidates.find((c) => c.id === r.courseId);
          return course?.targetGoalType === g.type;
        });
        return this.prisma.courseRecommendation.create({
          data: {
            userId,
            courseId: r.courseId,
            goalId: matchedGoal?.id ?? null,
            reason: r.reason,
            priority: r.priority,
          },
          include: { course: true, goal: true },
        });
      }),
    );

    const recommendations = saved.map((r) => ({
      id: r.id,
      course: r.course,
      reason: r.reason,
      priority: r.priority,
      goalTitle: (r as any).goal?.title ?? null,
      status: r.status,
    }));

    return { message: 'AI가 강의를 추천했습니다.', data: { recommendations } };
  }

  async save(userId: number, recommendationId: number) {
    const rec = await this.prisma.courseRecommendation.findFirst({ where: { id: recommendationId, userId } });
    if (!rec) throw new NotFoundException('추천을 찾을 수 없습니다.');
    await this.prisma.courseRecommendation.update({ where: { id: recommendationId }, data: { status: 'SAVED' } });
    return { message: '강의를 저장했습니다.', data: null };
  }

  async dismiss(userId: number, recommendationId: number) {
    const rec = await this.prisma.courseRecommendation.findFirst({ where: { id: recommendationId, userId } });
    if (!rec) throw new NotFoundException('추천을 찾을 수 없습니다.');
    await this.prisma.courseRecommendation.update({ where: { id: recommendationId }, data: { status: 'DISMISSED' } });
    return { message: '강의 추천을 닫았습니다.', data: null };
  }

  async findSaved(userId: number) {
    const saved = await this.prisma.courseRecommendation.findMany({
      where: { userId, status: 'SAVED' },
      include: { course: true },
      orderBy: { recommendedAt: 'desc' },
    });
    return { message: '저장한 강의 목록을 조회했습니다.', data: saved };
  }
}
