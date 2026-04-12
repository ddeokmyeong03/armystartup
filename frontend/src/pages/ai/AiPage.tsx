import { useState, useRef, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import apiClient from '../../shared/lib/apiClient';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import type { AiChatMessage } from '../../shared/model/types';

// ─── 타입 ────────────────────────────────────────────────────────────────────

type Course = {
  id: number;
  title: string;
  source: string;
  category: string;
  durationMinutes: number;
  description: string | null;
  url: string | null;
  tags: string[];
};

type Recommendation = {
  id: number;
  course: Course;
  reason: string;
  priority: number;
  goalTitle: string | null;
  status: 'RECOMMENDED' | 'SAVED' | 'DISMISSED';
};

// ─── 상수 ────────────────────────────────────────────────────────────────────

const SOURCE_LABEL: Record<string, string> = {
  JANGBYEONGEEUM: '장병e음',
  DEFENSE_TRANSITION: '국방전직교육원',
  K_MOOC: 'K-MOOC',
  CERTIFICATE: '자격증',
  OTHER: '기타',
};

const SOURCE_COLOR: Record<string, string> = {
  JANGBYEONGEEUM: 'bg-[#DCE8F8] text-[#4A7BAF]',
  DEFENSE_TRANSITION: 'bg-[#E8F4E8] text-[#3A7D44]',
  K_MOOC: 'bg-[#FFF3DC] text-[#B07830]',
  CERTIFICATE: 'bg-[#EDE8F8] text-[#6040A0]',
  OTHER: 'bg-[#EFEFEF] text-[#8E8E93]',
};

const QUICK_QUESTIONS = [
  '오늘 자기개발 계획 추천해줘',
  '토익 공부 어떻게 시작할까?',
  '운동 루틴 만들어줘',
  '주말 2시간 활용법 알려줘',
];

// ─── 강의 추천 탭 ─────────────────────────────────────────────────────────────

function CourseRecommendTab() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [savedCourses, setSavedCourses] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [subTab, setSubTab] = useState<'recommend' | 'saved'>('recommend');

  useEffect(() => {
    setLoadingSaved(true);
    apiClient
      .get<{ data: Recommendation[] }>('/api/courses/saved')
      .then((res) => setSavedCourses(res.data.data))
      .catch(() => setSavedCourses([]))
      .finally(() => setLoadingSaved(false));
  }, []);

  async function handleRecommend() {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: { recommendations: Recommendation[] } }>(
        '/api/courses/recommend',
      );
      setRecommendations(res.data.data.recommendations);
      setSubTab('recommend');
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(recId: number) {
    setActioningId(recId);
    try {
      await apiClient.post(`/api/courses/recommendations/${recId}/save`);
      const saved = recommendations.find((r) => r.id === recId);
      if (saved) {
        setSavedCourses((prev) => [{ ...saved, status: 'SAVED' }, ...prev]);
      }
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } catch {
      //
    } finally {
      setActioningId(null);
    }
  }

  async function handleDismiss(recId: number) {
    setActioningId(recId);
    try {
      await apiClient.post(`/api/courses/recommendations/${recId}/dismiss`);
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } catch {
      //
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 서브탭 */}
      <div className="flex gap-1 px-5 pb-3">
        {(['recommend', 'saved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`flex-1 h-9 rounded-[10px] text-[13px] font-semibold transition-colors ${
              subTab === tab ? 'bg-[#111111] text-white' : 'bg-white text-[#8E8E93]'
            }`}
          >
            {tab === 'recommend' ? 'AI 추천' : '저장한 강의'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-5">
        {subTab === 'recommend' ? (
          <>
            {/* 추천 받기 버튼 */}
            <button
              onClick={handleRecommend}
              disabled={loading}
              className="w-full h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold mb-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  목표 기반 강의 추천받기
                </>
              )}
            </button>

            {recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-12 h-12 rounded-full bg-[#DCE8F8] flex items-center justify-center mb-1">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="1.8">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <p className="text-[15px] font-semibold text-[#111111]">강의 추천 받기</p>
                <p className="text-[13px] text-[#8E8E93] text-center px-4">
                  목표를 등록한 뒤 버튼을 누르면<br />장병e음·국방전직교육원·K-MOOC 강의를<br />AI가 맞춤 추천해드려요
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recommendations.map((rec) => (
                  <CourseCard
                    key={rec.id}
                    rec={rec}
                    onSave={() => handleSave(rec.id)}
                    onDismiss={() => handleDismiss(rec.id)}
                    actioning={actioningId === rec.id}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {loadingSaved ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : savedCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <p className="text-[15px] font-semibold text-[#111111]">저장한 강의가 없어요</p>
                <p className="text-[13px] text-[#8E8E93]">추천받은 강의를 저장해보세요</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {savedCourses.map((rec) => (
                  <SavedCourseCard key={rec.id} rec={rec} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CourseCard({
  rec,
  onSave,
  onDismiss,
  actioning,
}: {
  rec: Recommendation;
  onSave: () => void;
  onDismiss: () => void;
  actioning: boolean;
}) {
  const sourceColor = SOURCE_COLOR[rec.course.source] ?? SOURCE_COLOR.OTHER;
  const sourceLabel = SOURCE_LABEL[rec.course.source] ?? rec.course.source;

  return (
    <div className="bg-white rounded-[18px] px-4 py-4 flex flex-col gap-3">
      <div className="flex items-start gap-2 flex-wrap">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sourceColor}`}>
          {sourceLabel}
        </span>
        <span className="text-[11px] font-medium text-[#8E8E93] px-2 py-0.5 bg-[#F8F8F6] rounded-full">
          {rec.course.durationMinutes}분
        </span>
        {rec.goalTitle && (
          <span className="text-[11px] font-medium text-[#6040A0] px-2 py-0.5 bg-[#EDE8F8] rounded-full">
            {rec.goalTitle}
          </span>
        )}
      </div>

      <div>
        <p className="text-[15px] font-semibold text-[#111111] leading-snug">{rec.course.title}</p>
        {rec.course.description && (
          <p className="text-[12px] text-[#8E8E93] mt-1 line-clamp-2">{rec.course.description}</p>
        )}
      </div>

      <div className="bg-[#F8F8F6] rounded-[10px] px-3 py-2.5">
        <p className="text-[12px] text-[#4A7BAF] leading-relaxed">
          <span className="font-semibold">AI 추천 이유: </span>{rec.reason}
        </p>
      </div>

      {rec.course.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {rec.course.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-[#8E8E93] bg-[#F8F8F6] px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {rec.course.url && (
          <a
            href={rec.course.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 h-9 bg-[#F8F8F6] rounded-[10px] text-[13px] font-medium text-[#4A7BAF] flex items-center justify-center"
          >
            바로가기
          </a>
        )}
        <button
          onClick={onSave}
          disabled={actioning}
          className="flex-1 h-9 bg-[#111111] text-white rounded-[10px] text-[13px] font-semibold disabled:opacity-50"
        >
          저장
        </button>
        <button
          onClick={onDismiss}
          disabled={actioning}
          className="w-9 h-9 bg-[#F8F8F6] rounded-[10px] text-[#8E8E93] flex items-center justify-center disabled:opacity-50"
          aria-label="닫기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SavedCourseCard({ rec }: { rec: Recommendation }) {
  const sourceColor = SOURCE_COLOR[rec.course.source] ?? SOURCE_COLOR.OTHER;
  const sourceLabel = SOURCE_LABEL[rec.course.source] ?? rec.course.source;

  return (
    <div className="bg-white rounded-[18px] px-4 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sourceColor}`}>
          {sourceLabel}
        </span>
        <span className="text-[11px] font-medium text-[#8E8E93] px-2 py-0.5 bg-[#F8F8F6] rounded-full">
          {rec.course.durationMinutes}분
        </span>
      </div>
      <p className="text-[15px] font-semibold text-[#111111]">{rec.course.title}</p>
      {rec.course.description && (
        <p className="text-[12px] text-[#8E8E93] line-clamp-2">{rec.course.description}</p>
      )}
      {rec.course.url && (
        <a
          href={rec.course.url}
          target="_blank"
          rel="noreferrer"
          className="w-full h-9 bg-[#F8F8F6] rounded-[10px] text-[13px] font-medium text-[#4A7BAF] flex items-center justify-center mt-1"
        >
          바로가기
        </a>
      )}
    </div>
  );
}

// ─── AI 채팅 탭 ───────────────────────────────────────────────────────────────

function AiChatTab() {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'ai-welcome',
      role: 'ai',
      content: '안녕하세요! Millog AI 가이드입니다.\n자기개발 계획, 목표 설정, 시간 관리에 대해 무엇이든 물어보세요.',
      timestamp: dayjs().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: AiChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: dayjs().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const res = await apiClient.post<{ data: { reply: string; timestamp: string } }>(
          '/api/ai/chat',
          { message: trimmed },
        );
        const aiMsg: AiChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: res.data.data.reply,
          timestamp: res.data.data.timestamp,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const errMsg: AiChatMessage = {
          id: `ai-err-${Date.now()}`,
          role: 'ai',
          content: '답변을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
          timestamp: dayjs().toISOString(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto pb-4 px-4 pt-1">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#DCE8F8] flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2.2">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-[16px] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#111111] text-white rounded-tr-[4px]'
                    : 'bg-white text-[#111111] rounded-tl-[4px] shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-[#DCE8F8] flex items-center justify-center mr-2 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2.2">
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="bg-white rounded-[16px] rounded-tl-[4px] px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-[#4A7BAF] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#4A7BAF] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#4A7BAF] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="px-4 pt-2 pb-2 bg-[#F8F8F6] border-t border-[#EFEFEF]">
        {messages.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                className="shrink-0 text-[12px] font-medium text-[#4A7BAF] bg-[#DCE8F8] rounded-full px-3 py-1.5 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 mt-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            rows={1}
            className="flex-1 resize-none rounded-[14px] bg-white px-4 py-2.5 text-[14px] text-[#111111] placeholder:text-[#C7C7CC] outline-none leading-relaxed shadow-sm"
            style={{ maxHeight: '80px', overflowY: 'auto' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111111] text-white disabled:opacity-30 shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function AiPage() {
  const [tab, setTab] = useState<'course' | 'chat'>('course');

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-3 bg-[#F8F8F6]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#DCE8F8] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2">
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="text-[20px] font-bold text-[#111111]">강의 추천</h1>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 px-5 pb-3">
        <button
          onClick={() => setTab('course')}
          className={`flex-1 h-10 rounded-[12px] text-[14px] font-semibold transition-colors ${
            tab === 'course' ? 'bg-[#3A3A3A] text-white' : 'bg-white text-[#8E8E93]'
          }`}
        >
          강의 추천
        </button>
        <button
          onClick={() => setTab('chat')}
          className={`flex-1 h-10 rounded-[12px] text-[14px] font-semibold transition-colors ${
            tab === 'chat' ? 'bg-[#3A3A3A] text-white' : 'bg-white text-[#8E8E93]'
          }`}
        >
          AI 채팅
        </button>
      </div>

      {/* 콘텐츠 */}
      {tab === 'course' ? (
        <CourseRecommendTab />
      ) : (
        <div className="flex flex-col flex-1 min-h-0 pb-[60px]">
          <AiChatTab />
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
