import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Snowflake,
  ShieldAlert,
  Calendar,
  Layers,
  HelpCircle,
  Info
} from 'lucide-react';
import { WasteCategory } from '../types';
import { CATEGORY_GUIDES } from '../data/categoryTips';
import { STORAGE_TIPS, WASTE_DICTIONARY } from '../data/tips';

export const TipsAndGuideView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'tips' | 'dictionary'>('categories');
  const [selectedCatKey, setSelectedCatKey] = useState<WasteCategory>('vegetables');
  const [expandedTipId, setExpandedTipId] = useState<string | null>('tip-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [dictFilter, setDictFilter] = useState<'all' | 'food' | 'general'>('all');

  const selectedGuide = CATEGORY_GUIDES[selectedCatKey];

  const categoryKeys: { key: WasteCategory; label: string; emoji: string }[] = [
    { key: 'vegetables', label: '채소 / 나물', emoji: '🥬' },
    { key: 'fruits', label: '과일류 / 껍질', emoji: '🍎' },
    { key: 'other', label: '생선 / 해산물 / 육류', emoji: '🐟' },
    { key: 'soup_solids', label: '국물 / 찌개', emoji: '🍲' },
    { key: 'delivery', label: '배달음식 잔반', emoji: '🛵' },
    { key: 'meal_leftovers', label: '밥 / 반찬 잔반', emoji: '🍚' },
    { key: 'bakery_snacks', label: '빵 / 베이커리', emoji: '🥪' }
  ];

  // Filter dictionary
  const filteredDictionary = WASTE_DICTIONARY.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (dictFilter === 'food') return item.isFoodWaste;
    if (dictFilter === 'general') return !item.isFoodWaste;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Banner and Sub-tab switcher */}
      <div className="bg-white rounded-3xl border border-[#E3ECE6] p-6 md:p-8 shadow-xs">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-[#2D7A50] tracking-wide">
            1인 가구 음식물 쓰레기 백서
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E3329] tracking-tight mt-1">
            종류별 맞춤 꿀팁 & 배출 가이드
          </h1>
          <p className="text-xs text-[#526D5E] mt-1.5 leading-relaxed">
            원룸 주방 악취와 초파리를 100% 차단하는 종류별 보관법부터 우리 동네 일반적인 배출 요일/방법, 헷갈리는 분리배출 기준까지 확인하세요.
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F6F3] rounded-2xl mt-6 border border-[#E2ECE5] max-w-lg">
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`flex-1 min-h-[40px] px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
              activeSubTab === 'categories'
                ? 'bg-white text-[#1E3329] shadow-xs'
                : 'text-[#587364] hover:text-[#1E3329]'
            }`}
          >
            종류별 맞춤 가이드
          </button>
          <button
            onClick={() => setActiveSubTab('tips')}
            className={`flex-1 min-h-[40px] px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
              activeSubTab === 'tips'
                ? 'bg-white text-[#1E3329] shadow-xs'
                : 'text-[#587364] hover:text-[#1E3329]'
            }`}
          >
            냄새 차단 6대 꿀팁
          </button>
          <button
            onClick={() => setActiveSubTab('dictionary')}
            className={`flex-1 min-h-[40px] px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
              activeSubTab === 'dictionary'
                ? 'bg-white text-[#1E3329] shadow-xs'
                : 'text-[#587364] hover:text-[#1E3329]'
            }`}
          >
            음식물 vs 일반사전
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 종류별 맞춤 가이드 (User's primary explicit request) */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          {/* Horizontal Category Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryKeys.map((cat) => {
              const isSelected = selectedCatKey === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCatKey(cat.key)}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#2D7A50] text-white border-[#2D7A50] shadow-xs'
                      : 'bg-white text-[#385244] border-[#E3ECE6] hover:bg-[#F4F8F5]'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Category Guide Card */}
          {selectedGuide && (
            <div className="bg-white rounded-3xl border border-[#E3ECE6] p-6 md:p-8 space-y-6 shadow-xs">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDF3EF] pb-5">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl p-2 rounded-2xl bg-[#F2F7F4] border border-[#E0ECE4]">
                    {selectedGuide.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#1E3329]">
                        {selectedGuide.name}
                      </h2>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${selectedGuide.badgeColor}`}>
                        {selectedGuide.odorRisk === '매우 높음' ? '🚨 악취 위험 최고' : `냄새 위험: ${selectedGuide.odorRisk}`}
                      </span>
                    </div>
                    <p className="text-xs text-[#526D5E] mt-1">
                      {selectedGuide.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#486655] bg-[#F7FAF8] p-2.5 rounded-xl border border-[#E5EFE8]">
                  <span>날파리/초파리:</span>
                  <span className="font-bold text-[#2D7A50]">
                    {selectedGuide.bugRisk}
                  </span>
                </div>
              </div>

              {/* Two Column Grid: 1. Storage & Anti-Odor Tip / 2. Disposal Timing & Processing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. 맞춤 냄새 차단 및 보관법 */}
                <div className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#DEECE2] space-y-3.5">
                  <div className="flex items-center gap-2 text-[#2D7A50]">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="text-sm font-bold text-[#1E3329]">
                      맞춤 냄새 저감 & 보관 요령
                    </h3>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#E0EDE4]">
                    <span className="text-[11px] font-bold text-[#2D7A50] block">
                      추천 보관법
                    </span>
                    <p className="text-xs font-bold text-[#1E3329] mt-0.5">
                      {selectedGuide.storageTip.bestMethod}
                    </p>
                    <p className="text-xs text-[#526D5E] mt-1 leading-relaxed">
                      {selectedGuide.storageTip.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-[#3E5C4B]">
                      실천 단계
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#355242]">
                      {selectedGuide.storageTip.actionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#E2EFE7] text-[#2D7A50] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. 일반적인 배출 요일 및 처리 방법 안내 */}
                <div className="p-5 rounded-2xl bg-[#FFFBF5] border border-[#F6E9D5] space-y-3.5">
                  <div className="flex items-center gap-2 text-[#B4690E]">
                    <Calendar className="w-4 h-4" />
                    <h3 className="text-sm font-bold text-[#1E3329]">
                      배출 요일 및 처리 안내
                    </h3>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#F3E5CE]">
                    <span className="text-[11px] font-bold text-[#B4690E] block">
                      권장 배출 타이밍 & 주기
                    </span>
                    <p className="text-xs font-bold text-[#1E3329] mt-0.5">
                      {selectedGuide.disposalAdvice.recommendedTiming}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-[#6B502A]">
                      배출 전 처리 방법
                    </span>
                    <p className="text-xs text-[#544125] leading-relaxed">
                      {selectedGuide.disposalAdvice.preparation}
                    </p>
                  </div>

                  {selectedGuide.disposalAdvice.generalTrashWarning && (
                    <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#FCD6D6] text-xs text-[#9B2C2C] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D04242]" />
                      <p className="leading-snug">
                        {selectedGuide.disposalAdvice.generalTrashWarning}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* DO & DON'T Comparison Grid */}
              <div className="border-t border-[#EDF3EF] pt-5">
                <h4 className="text-xs font-bold text-[#2A4335] mb-3">
                  이 쓰레기 처리 시 꼭 기억할 DO & DON'T
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#F0FAF3] border border-[#D5EEDB] space-y-1.5">
                    <span className="text-xs font-bold text-[#246A42] flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      이렇게 하세요 (DO)
                    </span>
                    <ul className="space-y-1 text-xs text-[#2A5237]">
                      {selectedGuide.keyDoAndDont.dos.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#2D7A50] font-bold">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFF2F2] border border-[#FBD9D9] space-y-1.5">
                    <span className="text-xs font-bold text-[#B02828] flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      이것만은 피하세요 (DON'T)
                    </span>
                    <ul className="space-y-1 text-xs text-[#7A2424]">
                      {selectedGuide.keyDoAndDont.donts.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#D04242] font-bold">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: 냄새 차단 6대 꿀팁 */}
      {activeSubTab === 'tips' && (
        <div className="space-y-3">
          {STORAGE_TIPS.map((tip) => {
            const isExpanded = expandedTipId === tip.id;
            return (
              <div
                key={tip.id}
                className="bg-white rounded-2xl border border-[#E3ECE6] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#FAFBF9] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#2D7A50] flex items-center justify-center font-bold text-sm shrink-0">
                      💡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1E3329]">
                          {tip.title}
                        </span>
                        <span className="text-[11px] font-medium text-[#2D7A50] bg-[#EAF5EE] px-2 py-0.5 rounded-full">
                          {tip.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#526D5E] mt-0.5">
                        {tip.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#728B7E]">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#F0F5F2] space-y-3 text-xs bg-[#FAFBF9]">
                    <p className="text-[#2C4637] font-medium leading-relaxed">
                      {tip.summary}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-[#1E3329] text-[11px]">
                        따라하기 쉬운 방법:
                      </span>
                      <ul className="space-y-1 text-[#486354]">
                        {tip.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#2D7A50] font-bold">✔</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 3: 음식물 vs 일반 쓰레기 사전 */}
      {activeSubTab === 'dictionary' && (
        <div className="space-y-4">
          {/* Search bar & filter pills */}
          <div className="bg-white rounded-3xl border border-[#E3ECE6] p-5 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7A9385] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="품목 검색 (예: 달걀, 바나나, 치킨 뼈, 양파껍질, 조개)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E4DB] bg-[#FAFBF9] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E8B62]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#5B7567] font-medium mr-1">분류 필터:</span>
              <button
                onClick={() => setDictFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  dictFilter === 'all'
                    ? 'bg-[#1E3329] text-white'
                    : 'bg-[#F0F4F1] text-[#446051] hover:bg-[#E5ECE7]'
                }`}
              >
                전체 ({WASTE_DICTIONARY.length})
              </button>
              <button
                onClick={() => setDictFilter('food')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  dictFilter === 'food'
                    ? 'bg-[#2D7A50] text-white'
                    : 'bg-[#EBF7EE] text-[#246A42] hover:bg-[#DDEFE2]'
                }`}
              >
                음식물 쓰레기
              </button>
              <button
                onClick={() => setDictFilter('general')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  dictFilter === 'general'
                    ? 'bg-[#8F2E2E] text-white'
                    : 'bg-[#FFF0F0] text-[#9B2C2C] hover:bg-[#FCDDDD]'
                }`}
              >
                일반 쓰레기 (혼동주의)
              </button>
            </div>
          </div>

          {/* Dictionary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredDictionary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#1E3329]">
                      {item.name}
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        item.isFoodWaste
                          ? 'bg-[#EAF7EE] text-[#246A42] border-[#CDE7D5]'
                          : 'bg-[#FFF0F0] text-[#9B2C2C] border-[#FCD2D2]'
                      }`}
                    >
                      {item.isFoodWaste ? '✅ 음식물 쓰레기' : '❌ 일반 종량제'}
                    </span>
                  </div>

                  <p className="text-xs text-[#486354] mt-2 leading-relaxed">
                    <span className="font-semibold text-[#1E3329]">이유: </span>
                    {item.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0F5F2] text-[11px] text-[#2C523D] bg-[#F7FAF8] p-2 rounded-lg">
                  💡 {item.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
