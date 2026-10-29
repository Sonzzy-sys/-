import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: 'home' | 'record' | 'tips' | 'settings') => void;
  onQuickAdd: () => void;
  daysElapsed: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onQuickAdd,
  daysElapsed
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAF8]/90 backdrop-blur-md border-b border-[#E3ECE6] px-4 md:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2 text-left text-lg font-bold tracking-tight text-[#1E3329] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
        >
          <span className="w-8 h-8 rounded-xl bg-[#E2EFE7] border border-[#CDE1D4] flex items-center justify-center text-sm shadow-xs">
            🌱
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight">소담쓰레기</span>
            <span className="text-[11px] font-normal text-[#587364]">1인 가구 소량 배출 매니저</span>
          </div>
        </button>

        {/* Zone 2: Navigation Links for Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#466052]">
          <button
            onClick={() => onTabChange('home')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              currentTab === 'home'
                ? 'border-[#2D7A50] text-[#1E3329] font-semibold'
                : 'border-transparent hover:text-[#1E3329]'
            }`}
          >
            현재 보관 현황
          </button>
          <button
            onClick={() => onTabChange('record')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              currentTab === 'record'
                ? 'border-[#2D7A50] text-[#1E3329] font-semibold'
                : 'border-transparent hover:text-[#1E3329]'
            }`}
          >
            쓰레기 기록하기
          </button>
          <button
            onClick={() => onTabChange('tips')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              currentTab === 'tips'
                ? 'border-[#2D7A50] text-[#1E3329] font-semibold'
                : 'border-transparent hover:text-[#1E3329]'
            }`}
          >
            종류별 맞춤 꿀팁 & 분리사전
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              currentTab === 'settings'
                ? 'border-[#2D7A50] text-[#1E3329] font-semibold'
                : 'border-transparent hover:text-[#1E3329]'
            }`}
          >
            우리 동네 배출 설정
          </button>
        </nav>

        {/* Zone 3: Primary Quick Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#EAF2ED] text-[#244E36] font-medium border border-[#D5E6DC]">
            <Sparkles className="w-3.5 h-3.5 text-[#2D7A50]" />
            <span>배출 D+{daysElapsed}일</span>
          </div>
          <button
            onClick={onQuickAdd}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-[#2D7A50] hover:bg-[#256843] active:scale-[0.98] rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>기록 추가</span>
          </button>
        </div>
      </div>
    </header>
  );
};
