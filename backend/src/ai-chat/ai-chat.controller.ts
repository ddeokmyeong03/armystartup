import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { AiChatService } from './ai-chat.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('AI Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('chat')
  @ApiOperation({ summary: 'GPT-4o-mini 강의 추천 상담 채팅' })
  chat(@CurrentUser() user: JwtPayload, @Body() dto: ChatDto) {
    return this.aiChatService.chat(user.userId, dto.message);
  }
}
