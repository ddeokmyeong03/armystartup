export type RecordCategory = '자격증' | '어학' | '독서' | '운동';

export interface Record {
  id: number;
  userId: number;
  category: RecordCategory;
  title: string;
  content?: string;
  recordDate: string; // "YYYY-MM-DD"
  verified: boolean;
  evidenceUrl?: string;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecordDto {
  category: RecordCategory;
  title: string;
  content?: string;
  recordDate: string;
  evidenceUrl?: string;
  meta?: Record<string, unknown>;
}

export interface UpdateRecordDto extends Partial<CreateRecordDto> {}
