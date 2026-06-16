import { RecordCategory } from './record';

export type JudgmentType = 'RANKING' | 'PASS_FAIL' | 'NON_COMPETITIVE';
export type ChallengeStatus = 'OPEN' | 'CLOSED' | 'JUDGING' | 'DONE';
export type ParticipantStatus = 'JOINED' | 'SUBMITTED' | 'JUDGED' | 'REWARDED';

export interface Challenge {
  id: number;
  creatorId: number;
  title: string;
  description?: string;
  category: RecordCategory;
  judgmentType: JudgmentType;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  maxParticipants?: number;
  isRewarded: boolean;
  entryFee: number;
  prizeMoney: number;
  status: ChallengeStatus;
  participantCount?: number;
  myParticipation?: ChallengeParticipant;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeParticipant {
  id: number;
  challengeId: number;
  userId: number;
  nickname?: string;
  joinedAt: string;
  status: ParticipantStatus;
  rank?: number;
  passed?: boolean;
  evidenceUrl?: string;
  judgedAt?: string;
}

export interface CreateChallengeDto {
  title: string;
  description?: string;
  category: RecordCategory;
  judgmentType: JudgmentType;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  isRewarded?: boolean;
  entryFee?: number;
  prizeMoney?: number;
}
