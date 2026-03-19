import { Module } from '@nestjs/common';
import { AiPlansService } from './ai-plans.service';
import { AiPlansController } from './ai-plans.controller';

@Module({
  providers: [AiPlansService],
  controllers: [AiPlansController],
})
export class AiPlansModule {}
