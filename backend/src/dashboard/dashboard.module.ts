import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RecordsModule } from '../records/records.module';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [RecordsModule, ChallengesModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
