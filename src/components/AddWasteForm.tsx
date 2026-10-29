import React, { useState } from 'react';
import {
  Sparkles,
  Info,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Snowflake
} from 'lucide-react';
import { StorageMethod, WasteAmount, WasteCategory, WasteRecord } from '../types';
import { CATEGORY_GUIDES } from '../data/categoryTips';

interface AddWasteFormProps {
  onSaveRecord: (record: Omit<WasteRecord, 'id' | 'timestamp'>) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AddWasteForm: React.FC<AddWasteFormProps> = ({
  onSaveRecord,
  onCancel,
  isModal = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('fruits');
  const [selectedAmount, setSelectedAmount] = useState<WasteAmount>('small');
  const [selectedStorage, setSelectedStorage] = useState<StorageMethod>('airtight');
  const [notes, setNotes] = useState('');
  const [showGeneralTrashAlert, setShowGeneralTrashAlert] = useState(false);

  const guide = CATEGORY_GUIDES[selectedCategory];

  const amountPresets: { id: WasteAmount; label: string; grams: number; desc: string; icon: string }[] = [
    {
      id: 'small',
      label: '소량 (한 줌)',
      grams: 90,
      desc: '사과 1개 껍질, 찻잎, 자투리 채소',
      icon: '🌱'
    },
    {
      id: 'medium',
      label: '보통 (한 끼 잔반)',
      grams: 220,
      desc: '혼밥 후 남은 밥, 반찬, 찌개 건더기',
      icon: '🥣'
    },
    {
      id: 'large',
      label: '넉넉함 (다량)',
      grams: 480,
      desc: '주말 요리 정리, 배달음식 잔반, 수박껍질',
      icon: '📦'
    }
  ];

  const categories: { id: WasteCategory; label: string; emoji: string; sub: string }[] = [
    { id: 'fruits', label: '과일류 / 껍질', emoji: '🍎', sub: '사과, 바나나, 귤, 수박' },
    { id: 'vegetables', label: '채소 / 나물', emoji: '🥬', sub: '다듬은 채소, 샐러드 잔여' },
    { id: 'meal_leftovers', label: '식사 잔반 / 밥 / 반찬', emoji: '🍚', sub: '밥, 김치, 볶음류' },
    { id: 'delivery', label: '배달음식 잔반', emoji: '🛵', sub: '치킨 살코기, 피자, 떡볶이' },
    { id: 'soup_solids', label: '국물 / 찌개 건더기', emoji: '🍲', sub: '수분 탈수 필수 잔반' },
    { id: 'other', label: '생선 / 해산물 / 육류', emoji: '🐟', sub: '비린내·단백질 부패 주의' },
    { id: 'bakery_snacks', label: '빵 / 베이커리 / 간식', emoji: '🥪', sub: '식빵, 과자, 떡류' }
  ];

  const storageOptions: { id: StorageMethod; label: string; icon: string; desc: string; badge?: string }[] = [
    {
      id: 'freezer',
      label: '냉동실 보관',
      icon: '❄️',
      desc: '부패 및 악취 0%, 초파리 원천 차단 (강력 추천)',
      badge: '추천'
    },
    {
      id: 'airtight',
      label: '밀폐용기 보관',
      icon: '🔒',
      desc: '실온에서 냄새 분자 밀폐 차단',
      badge: '실온 권장'
    },
    {
      id: 'fridge',
      label: '냉장 보관',
      icon: '🧊',
      desc: '1~2일 단기 보관 시 신선도 유지'
    },
    {
      id: 'regular_bag',
      label: '일반 비닐 / 오픈 통',
      icon: '🛍️',
      desc: '냄새가 새어나올 수 있어 당일 배출 필요'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountObj = amountPresets.find((a) => a.id === selectedAmount);
    const categoryObj = categories.find((c) => c.id === selectedCategory);

    onSaveRecord({
      amount: selectedAmount,
      category: selectedCategory,
      categoryLabel: categoryObj?.label || '소량 음식물 쓰레기',
      storageMethod: selectedStorage,
      notes: notes.trim() || undefined,
      estimatedGrams: amountObj?.grams || 100
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E3ECE6] p-6 md:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
      <div className="border-b border-[#EDF3EF] pb-4">
        <h2 className="text-xl font-bold text-[#1E3329] tracking-tight">
          오늘 발생한 음식물 쓰레기 기록
        </h2>
        <p className="text-xs text-[#526D5E] mt-1">
          발생한 양과 종류를 선택하면 냄새를 막는 보관 꿀팁과 배출 요령을 실시간으로 안내합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: 음식물 쓰레기 종류 선택 */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-[#2A4335] tracking-tight">
            1. 쓰레기 종류 선택
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id === 'delivery' || cat.id === 'other') {
                      setShowGeneralTrashAlert(true);
                    } else {
                      setShowGeneralTrashAlert(false);
                    }
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer min-h-[64px] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#EAF5EE] border-[#3E8B62] text-[#1E3329] shadow-xs ring-1 ring-[#3E8B62]'
                      : 'bg-[#FAFBF9] border-[#E5EDE7] text-[#486354] hover:bg-[#F2F7F4]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-bold leading-tight">{cat.label}</span>
                  </div>
                  <span className="text-[10px] text-[#6A8576] truncate mt-1">
                    {cat.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Category Custom Tips & Disposal Notice */}
        {guide && (
          <div className="p-4 rounded-2xl bg-[#F4F9F6] border border-[#D8EADB] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{guide.emoji}</span>
                <span className="text-xs font-bold text-[#1E3329]">
                  {guide.name} 맞춤 냄새 방지 & 배출 안내
                </span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${guide.badgeColor}`}>
                냄새 위험: {guide.odorRisk}
              </span>
            </div>

            <div className="text-xs text-[#355242] space-y-1.5 leading-relaxed bg-white/70 p-3 rounded-xl border border-[#E2EFE5]">
              <p className="font-semibold text-[#1E3329] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2D7A50]" />
                <span>추천 보관법: {guide.storageTip.bestMethod}</span>
              </p>
              <p className="text-[11px] text-[#476353]">
                {guide.storageTip.description}
              </p>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#2C523D] bg-[#EAF3ED] p-2.5 rounded-xl border border-[#D5E6DC]">
              <Info className="w-3.5 h-3.5 text-[#2D7A50] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">배출 타이밍: </span>
                <span>{guide.disposalAdvice.recommendedTiming}</span>
                {guide.disposalAdvice.generalTrashWarning && (
                  <p className="text-[#8D2B2B] font-medium mt-1">
                    {guide.disposalAdvice.generalTrashWarning}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 발생량 선택 */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-[#2A4335] tracking-tight">
            2. 오늘 발생한 양
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {amountPresets.map((amt) => {
              const isSelected = selectedAmount === amt.id;
              return (
                <button
                  type="button"
                  key={amt.id}
                  onClick={() => setSelectedAmount(amt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer min-h-[58px] ${
                    isSelected
                      ? 'bg-[#EAF5EE] border-[#3E8B62] text-[#1E3329] shadow-xs ring-1 ring-[#3E8B62]'
                      : 'bg-[#FAFBF9] border-[#E5EDE7] text-[#486354] hover:bg-[#F2F7F4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{amt.label}</span>
                    <span className="text-[11px] font-mono text-[#627D6E]">
                      ~{amt.grams}g
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6E887B] mt-1 leading-snug">
                    {amt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: 현재 보관 방식 선택 */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-[#2A4335] tracking-tight">
            3. 현재 어디에 보관하시나요?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {storageOptions.map((st) => {
              const isSelected = selectedStorage === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setSelectedStorage(st.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer min-h-[56px] flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#EAF5EE] border-[#3E8B62] text-[#1E3329] shadow-xs'
                      : 'bg-[#FAFBF9] border-[#E5EDE7] text-[#486354] hover:bg-[#F2F7F4]'
                  }`}
                >
                  <span className="text-lg shrink-0 mt-0.5">{st.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{st.label}</span>
                      {st.badge && (
                        <span className="text-[10px] font-semibold text-[#2D7A50] bg-[#DEEFE5] px-1.5 py-0.2 rounded shrink-0">
                          {st.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#6E887B] truncate mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: 간편 메모 (선택) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#2A4335] tracking-tight">
            4. 간편 메모 (선택)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="예: 사과 2개 껍질 + 물기 꽉 짜서 비닐에 넣음"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5E4DB] bg-[#FAFBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E8B62] focus:border-transparent transition-all placeholder:text-[#9FB3A8]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EDF3EF]">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#526D5E] hover:bg-[#F0F5F2] transition-colors cursor-pointer"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#2D7A50] hover:bg-[#236440] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>기록 저장하기</span>
          </button>
        </div>
      </form>
    </div>
  );
};
