import { useState, useRef, useEffect } from 'react';
import type { AiChatMessage } from '../../shared/model/types';

type AiGuideSectionProps = {
  messages: AiChatMessage[];
  isLoading: boolean;
  onSend: (message: string) => void;
};

export default function AiGuideSection({ messages, isLoading, onSend }: AiGuideSectionProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mx-5 mb-4 rounded-[20px] bg-white overflow-hidden">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <div className="w-6 h-6 rounded-full bg-[#DCE8F8] flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2">
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#111111]">AI 자기개발 가이드</p>
      </div>

      {/* 채팅 메시지 영역 */}
      {messages.length > 0 && (
        <div className="px-4 pb-2 flex flex-col gap-2 max-h-48 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-[14px] px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#F0F4FA] text-[#111111]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#F0F4FA] rounded-[14px] px-4 py-2">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A7BAF] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A7BAF] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A7BAF] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 입력창 */}
      <div className="flex items-end gap-2 px-4 pb-4 pt-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="자기개발 관련 질문을 입력하세요..."
          rows={1}
          className="flex-1 resize-none rounded-[12px] bg-[#F8F8F6] px-3 py-2 text-sm text-[#111111] placeholder:text-[#B7B7BD] outline-none leading-relaxed"
          style={{ maxHeight: '80px', overflowY: 'auto' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#111111] text-white disabled:opacity-30 shrink-0 transition-opacity"
          aria-label="전송"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
