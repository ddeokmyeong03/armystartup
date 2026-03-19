import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiChatService {
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async chat(userId: number, message: string) {
    const savedCourses = await this.prisma.courseRecommendation.findMany({
      where: { userId, status: 'SAVED' },
      include: { course: true },
      take: 5,
    });

    const savedContext = savedCourses.length > 0
      ? `사용자가 저장한 강의: ${savedCourses.map((r) => r.course.title).join(', ')}`
      : '';

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `당신은 군 병사의 자기개발을 돕는 AI 가이드 '밀로그'입니다.
장병e음, 국방전직교육원, K-MOOC 등 국방 자기개발 사업 강의를 중심으로 추천하세요.
${savedContext}
답변은 간결하고 실행 가능하게 한국어로 2-4문장으로 작성하세요.`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
      });

      const reply = response.choices[0].message.content ?? '응답을 생성할 수 없습니다.';
      return {
        message: 'AI 응답이 생성되었습니다.',
        data: { reply, timestamp: new Date().toISOString() },
      };
    } catch {
      return {
        message: 'AI 응답이 생성되었습니다.',
        data: { reply: '현재 AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.', timestamp: new Date().toISOString() },
      };
    }
  }
}
