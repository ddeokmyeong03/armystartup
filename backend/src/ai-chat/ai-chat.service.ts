import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiChatService {
  private anthropic: Anthropic;

  constructor(private readonly prisma: PrismaService) {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async chat(userId: number, message: string) {
    const [savedCourses, goals] = await Promise.all([
      this.prisma.courseRecommendation.findMany({
        where: { userId, status: 'SAVED' },
        include: { course: true },
        take: 5,
      }),
      this.prisma.goal.findMany({ where: { userId, isActive: true }, take: 3 }),
    ]);

    const savedContext =
      savedCourses.length > 0
        ? `\n사용자가 저장한 강의: ${savedCourses.map((r) => r.course.title).join(', ')}`
        : '';

    const goalsContext =
      goals.length > 0
        ? `\n사용자의 자기개발 목표: ${goals.map((g) => `${g.title}(${g.type})`).join(', ')}`
        : '';

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: `당신은 군 병사의 자기개발을 돕는 AI 가이드 '밀로그'입니다.
장병e음, 국방전직교육원, K-MOOC 등 국방 자기개발 사업 강의를 중심으로 추천하세요.${savedContext}${goalsContext}
답변은 간결하고 실행 가능하게 한국어로 2-4문장으로 작성하세요.`,
        messages: [{ role: 'user', content: message }],
      });

      const reply =
        response.content[0].type === 'text'
          ? response.content[0].text
          : '응답을 생성할 수 없습니다.';

      return {
        message: 'AI 응답이 생성되었습니다.',
        data: { reply, timestamp: new Date().toISOString() },
      };
    } catch {
      return {
        message: 'AI 응답이 생성되었습니다.',
        data: {
          reply: '현재 AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
