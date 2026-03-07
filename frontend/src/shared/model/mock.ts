import type { ChipItem, SchedulePreviewModel, AiPlanPreviewModel, UserModel } from './types';

export const mockUser: UserModel = {
  id: 1,
  nickname: '김병사',
  email: 'soldier@army.kr',
  message: '오늘 하루도 파이팅! 💪',
};

export const mockChips: ChipItem[] = [
  { id: 'year', label: '2026', active: false },
  { id: 'month-full', label: '2026.03', active: true },
  { id: 'month-short', label: '3월', active: false },
  { id: 'user', label: '김병사', active: false },
];

export const mockSchedulesByDate: Record<string, SchedulePreviewModel[]> = {
  '2026-03-07': [
    { id: 1, title: '점호', startTime: '06:30', endTime: '07:00', category: 'ROLL_CALL' },
    { id: 2, title: '오전 근무', startTime: '09:00', endTime: '12:00', category: 'DUTY' },
    { id: 3, title: '저녁 점호', startTime: '21:00', endTime: '21:30', category: 'ROLL_CALL' },
  ],
  '2026-03-10': [
    { id: 4, title: '훈련', startTime: '08:00', endTime: '17:00', category: 'TRAINING' },
  ],
  '2026-03-14': [
    { id: 5, title: '의무대 방문', startTime: '14:00', endTime: '15:00', category: 'MEDICAL' },
    { id: 6, title: '점호', startTime: '21:00', endTime: '21:30', category: 'ROLL_CALL' },
  ],
  '2026-03-20': [
    { id: 7, title: '주말 개인 정비', startTime: '09:00', endTime: '11:00', category: 'PERSONAL' },
  ],
};

export const mockAiPlansByDate: Record<string, AiPlanPreviewModel[]> = {
  '2026-03-07': [
    { id: 100, title: 'AI 추천: 영어 단어 20분', startTime: '20:00', endTime: '20:20', status: 'APPLIED' },
  ],
  '2026-03-12': [
    { id: 101, title: 'AI 추천: 독서 30분', startTime: '20:30', endTime: '21:00', status: 'RECOMMENDED' },
  ],
  '2026-03-20': [
    { id: 102, title: 'AI 추천: 코딩 40분', startTime: '14:00', endTime: '14:40', status: 'COMPLETED' },
  ],
};
