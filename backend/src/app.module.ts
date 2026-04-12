import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SchedulesModule } from './schedules/schedules.module';
import { GoalsModule } from './goals/goals.module';
import { CoursesModule } from './courses/courses.module';
import { AiPlansModule } from './ai-plans/ai-plans.module';
import { CalendarModule } from './calendar/calendar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { RoadmapModule } from './roadmap/roadmap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    SchedulesModule,
    GoalsModule,
    CoursesModule,
    AiPlansModule,
    CalendarModule,
    DashboardModule,
    AiChatModule,
    RoadmapModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
