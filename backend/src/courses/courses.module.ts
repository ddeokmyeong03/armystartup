import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { KmoocSyncService } from './kmooc-sync.service';

@Module({
  providers: [CoursesService, KmoocSyncService],
  controllers: [CoursesController],
  exports: [KmoocSyncService],
})
export class CoursesModule {}
