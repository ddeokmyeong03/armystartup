import { useState, useRef, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import apiClient from '../../shared/lib/apiClient';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import type { AiChatMessage } from '../../shared/model/types';

const QUICK_QUESTIONS = [
  '오늘 자기개발 계획 추천해줘',
  '토익 공부 어떻게 시작할까?',
  '운동 루틴 만들어줘',
  '주말 2시간 활용법 알려줘',
];

export default function AiPage() {
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
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
  }, [isLoading]);

  function handleSend() {
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleQuickQuestion(q: string) {
    sendMessage(q);
  }

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
          <h1 className="text-[20px] font-bold text-[#111111]">AI 가이드</h1>
        </div>
        <p className="text-[13px] text-[#8E8E93] mt-0.5 ml-9">자기개발 계획을 AI와 함께 세워보세요</p>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto pb-[140px] px-4 pt-2">
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

      {/* 입력 영역 (고정) */}
      <div className="fixed bottom-[60px] left-0 right-0 bg-[#F8F8F6] border-t border-[#EFEFEF] px-4 pt-2 pb-3 z-40">
        {/* 빠른 질문 */}
        {messages.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickQuestion(q)}
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
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            rows={1}
            className="flex-1 resize-none rounded-[14px] bg-white px-4 py-2.5 text-[14px] text-[#111111] placeholder:text-[#C7C7CC] outline-none leading-relaxed shadow-sm"
            style={{ maxHeight: '100px', overflowY: 'auto' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111111] text-white disabled:opacity-30 shrink-0 transition-opacity"
            aria-label="전송"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
