import React from 'react';
import { Home, PlusCircle, BookOpen, Settings } from 'lucide-react';

interface BottomTabBarProps {
  currentTab: 'home' | 'record' | 'tips' | 'settings';
  onTabChange: (tab: 'home' | 'record' | 'tips' | 'settings') => void;
  daysElapsed: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onTabChange,
  daysElapsed
}) => {
  const tabs = [
    {
      id: 'home' as const,
      label: '현재 현황',
      icon: Home,
      badge: daysElapsed >= 3 ? '!' : undefined
    },
    {
      id: 'record' as const,
      label: '기록하기',
      icon: PlusCircle
    },
    {
      id: 'tips' as const,
      label: '맞춤 팁·사전',
      icon: BookOpen
    },
    {
      id: 'settings' as const,
      label: '동네 설정',
      icon: Settings
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAFBF9]/95 backdrop-blur-md border-t border-[#E3ECE6] px-2 py-1.5 pb-safe shadow-lg">
      <div className="grid grid-cols-4 items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                isActive ? 'text-[#2D7A50]' : 'text-[#627D6F] hover:text-[#1E3329]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#D04242] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-[#1E3329]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#2D7A50] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
