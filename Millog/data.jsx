// data.jsx — mock user/state for Millog
const { useState: _useState } = React;

const USER = {
  name: '진덕명',
  rank: '상병',
  branch: '육군',
  unit: '제00보병사단',
  dDay: 173,
  enlistedAt: '2024-10-03',
  dischargeAt: '2026-07-02',
  progress: 0.68, // percent served
};

const DUTY_TYPES = [
  { id: 'guard-night',   label: '불침번',     fatigue: 0.9, color: '#8b5cf6', glyph: '불' },
  { id: 'cctv',          label: 'CCTV',       fatigue: 0.5, color: '#3b82f6', glyph: 'C' },
  { id: 'duty-day',      label: '주간 당직',  fatigue: 0.7, color: '#f59e0b', glyph: '주' },
  { id: 'duty-night',    label: '야간 당직',  fatigue: 1.0, color: '#ef4444', glyph: '야' },
  { id: 'mess-clean',    label: '식당청소',   fatigue: 0.4, color: '#10b981', glyph: '식' },
  { id: 'training',      label: '훈련',       fatigue: 0.9, color: '#f43f5e', glyph: '훈' },
  { id: 'crst',          label: 'CRST',       fatigue: 1.0, color: '#dc2626', glyph: 'R' },
  { id: 'gate',          label: '위병소',     fatigue: 0.6, color: '#06b6d4', glyph: '위' },
];

// Weekly schedule — today = Wed
const TODAY_INDEX = 2;
const WEEK = [
  { day: '월', date: '20', items: [{ type: 'duty-day', start: 9, end: 18 }] },
  { day: '화', date: '21', items: [{ type: 'training', start: 8, end: 17 }] },
  { day: '수', date: '22', items: [{ type: 'duty-day', start: 9, end: 18 }, { type: 'guard-night', start: 22, end: 24 }], today: true },
  { day: '목', date: '23', items: [{ type: 'cctv', start: 14, end: 18 }] },
  { day: '금', date: '24', items: [{ type: 'duty-night', start: 18, end: 24 }] },
  { day: '토', date: '25', items: [{ type: 'gate', start: 9, end: 15 }] },
  { day: '일', date: '26', items: [] },
];

const GOALS = [
  { id: 'g1', title: '정보처리기사 필기 합격', category: '자격증', deadline: '2026-05-15', progress: 0.42, pinned: true, tasksDone: 5, tasksTotal: 12 },
  { id: 'g2', title: 'TOEIC 850점 돌파',       category: '어학',  deadline: '2026-06-30', progress: 0.28, tasksDone: 3, tasksTotal: 10 },
  { id: 'g3', title: '파이썬 데이터분석 기초', category: '취업',  deadline: '2026-04-30', progress: 0.72, tasksDone: 9, tasksTotal: 12 },
  { id: 'g4', title: '주 3회 러닝 루틴',       category: '취미',  deadline: null,         progress: 0.55, tasksDone: 11, tasksTotal: 20 },
];

const ROADMAP = [
  { week: 'W1', status: 'done',    title: '기본기 다지기',       items: ['정보처리기사 개념 1단원', 'TOEIC LC 파트1·2', '파이썬 기초 복습'] },
  { week: 'W2', status: 'done',    title: '문제 적응 단계',       items: ['기출문제 2회차', 'LC 파트3·4', 'pandas 기초'] },
  { week: 'W3', status: 'current', title: '핵심 약점 보완',       items: ['데이터베이스 심화', 'RC 파트5 1000문제', 'pandas 실습 프로젝트'] },
  { week: 'W4', status: 'next',    title: '모의고사 집중',        items: ['정보처리기사 모의고사 2회', '실전 TOEIC 1회', '시각화 프로젝트 시작'] },
  { week: 'W5', status: 'next',    title: '최종 점검',            items: ['오답노트 정리', 'RC 속도 훈련', '프로젝트 리뷰'] },
];

const COURSES_BY_SOURCE = {
  armye: [ // 장병e음
    { id: 'c1', title: '정보처리기사 필기 핵심요약', provider: '장병e음', duration: 45, match: 98, tag: '자격증', color: '#8b5cf6' },
    { id: 'c2', title: '실전 TOEIC LC 공략',        provider: '장병e음', duration: 30, match: 95, tag: '어학',   color: '#f59e0b' },
    { id: 'c3', title: '진로설계 기초',             provider: '국방전직교육원', duration: 60, match: 88, tag: '취업', color: '#10b981' },
  ],
  external: [ // K-MOOC, Class 101
    { id: 'c4', title: '모두의 딥러닝 입문',        provider: 'K-MOOC',   duration: 90, match: 92, tag: '취업', color: '#3b82f6' },
    { id: 'c5', title: '손그림으로 시작하는 일러스트', provider: 'Class101', duration: 35, match: 78, tag: '취미', color: '#ef4444' },
    { id: 'c6', title: '파이썬으로 배우는 데이터 시각화', provider: 'K-MOOC', duration: 50, match: 90, tag: '취업', color: '#06b6d4' },
  ],
};

// Combined roadmap-linked recommendations (top)
const ROADMAP_PICKS = [
  { id: 'p1', title: '데이터베이스 정규화 심화',   provider: '장병e음', duration: 25, match: 99, tag: '자격증', color: '#8b5cf6', linkedWeek: 'W3' },
  { id: 'p2', title: 'RC 파트5 집중 트레이닝',     provider: '장병e음', duration: 40, match: 97, tag: '어학',   color: '#f59e0b', linkedWeek: 'W3' },
  { id: 'p3', title: 'pandas 실전 프로젝트',       provider: 'K-MOOC',   duration: 55, match: 95, tag: '취업',   color: '#3b82f6', linkedWeek: 'W3' },
];

const AI_MESSAGES_SEED = [
  { role: 'ai', kind: 'text', text: '안녕하세요 진덕명 상병님 👋 이번 주 로드맵을 보니 데이터베이스 심화와 RC 파트5에 시간이 많이 필요해요. 가용시간을 어떻게 나눌지 같이 계획해볼까요?' },
  { role: 'ai', kind: 'options', text: '무엇부터 도와드릴까요?', options: [
    { id: 'opt1', label: '오늘 저녁 공부 스케줄 짜기' },
    { id: 'opt2', label: '이번 주 로드맵 조정하기' },
    { id: 'opt3', label: '약점 진단 받기' },
  ]},
];

Object.assign(window, {
  USER, DUTY_TYPES, WEEK, TODAY_INDEX, GOALS, ROADMAP,
  COURSES_BY_SOURCE, ROADMAP_PICKS, AI_MESSAGES_SEED,
});
