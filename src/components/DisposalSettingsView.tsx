import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertTriangle,
  History,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';
import { DisposalEvent, DisposalSettings } from '../types';

interface DisposalSettingsViewProps {
  settings: DisposalSettings;
  history: DisposalEvent[];
  onSaveSettings: (settings: DisposalSettings) => void;
  onClearHistory: () => void;
}

export const DisposalSettingsView: React.FC<DisposalSettingsViewProps> = ({
  settings,
  history,
  onSaveSettings,
  onClearHistory
}) => {
  const [localSettings, setLocalSettings] = useState<DisposalSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const daysOfWeek = [
    { day: 1, label: '월' },
    { day: 2, label: '화' },
    { day: 3, label: '수' },
    { day: 4, label: '목' },
    { day: 5, label: '금' },
    { day: 6, label: '토' },
    { day: 0, label: '일' }
  ];

  const handleDayToggle = (day: number) => {
    const current = localSettings.allowedDays;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort();
    setLocalSettings({ ...localSettings, allowedDays: next });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E3ECE6] p-6 md:p-8 shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#1E3329] tracking-tight">
          우리 동네 배출 설정 & 메모
        </h1>
        <p className="text-xs text-[#526D5E] mt-1 leading-relaxed">
          거주하시는 지역(원룸, 빌라, 오피스텔 등)의 수거 요일과 배출 방식을 메모해 두면 앱이 배출일마다 스마트하게 알려드립니다.
        </p>

        <form onSubmit={handleSave} className="space-y-6 mt-6">
          {/* 1. 배출 요일 체크박스 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2A4335]">
              1. 우리 동네 음식물 쓰레기 배출 요일
            </label>
            <p className="text-[11px] text-[#637D70]">
              지자체 수거차가 오는 요일을 모두 선택하세요 (예: 월·수·금 저녁)
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {daysOfWeek.map((item) => {
                const isSelected = localSettings.allowedDays.includes(item.day);
                return (
                  <button
                    type="button"
                    key={item.day}
                    onClick={() => handleDayToggle(item.day)}
                    className={`min-w-[48px] min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#2D7A50] text-white border-[#2D7A50] shadow-xs'
                        : 'bg-[#FAFBF9] text-[#557062] border-[#D5E3DB] hover:bg-[#EFF5F1]'
                    }`}
                  >
                    {item.label}요일
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 주 사용 봉투 규격 & 배출 방식 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2A4335]">
                2. 주 사용 종량제 봉투 용량
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((liters) => (
                  <button
                    type="button"
                    key={liters}
                    onClick={() => setLocalSettings({ ...localSettings, bagCapacityLiters: liters })}
                    className={`min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      localSettings.bagCapacityLiters === liters
                        ? 'bg-[#2D7A50] text-white border-[#2D7A50] shadow-xs'
                        : 'bg-[#FAFBF9] text-[#557062] border-[#D5E3DB] hover:bg-[#EFF5F1]'
                    }`}
                  >
                    {liters}L
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#6C8679]">
                💡 1인 가구는 냄새와 벌레 방지를 위해 1L~2L를 가장 추천합니다.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2A4335]">
                3. 배출 방식
              </label>
              <select
                value={localSettings.disposalType}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    disposalType: e.target.value as any
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border border-[#D5E4DB] bg-[#FAFBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E8B62]"
              >
                <option value="bag">규격 종량제 봉투 배출</option>
                <option value="rfid">RFID 카드 / 태그 종량기</option>
                <option value="sticker">전용 수거용기 + 납부필증(스티커)</option>
                <option value="container">공용 음식물 수거함 직접 투입</option>
              </select>
            </div>
          </div>

          {/* 3. 배출 시간 & 장소 메모 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2A4335] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2D7A50]" />
                <span>배출 권장 시간대 메모</span>
              </label>
              <input
                type="text"
                value={localSettings.disposalTimeWindow}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, disposalTimeWindow: e.target.value })
                }
                placeholder="예: 저녁 7시 ~ 자정 (19:00 ~ 24:00)"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5E4DB] bg-[#FAFBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E8B62]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2A4335] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2D7A50]" />
                <span>배출 장소 메모</span>
              </label>
              <input
                type="text"
                value={localSettings.disposalLocation}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, disposalLocation: e.target.value })
                }
                placeholder="예: 1층 주차장 분리수거대 옆 노란 수거통"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5E4DB] bg-[#FAFBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E8B62]"
              />
            </div>
          </div>

          {/* 4. 여름철 날파리 집중 관리 모드 */}
          <div className="p-4 rounded-2xl bg-[#FFF9EE] border border-[#F3E5CE] flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#8A5109] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                여름철 초파리 집중 관리 모드
              </span>
              <p className="text-[11px] text-[#6E4817] mt-0.5">
                기온이 높을 때는 부패가 빠르므로 배출 권장 알림을 3일에서 2일로 단축합니다.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={localSettings.summerMode}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, summerMode: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A50]"></div>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EDF3EF]">
            {savedSuccess ? (
              <span className="text-xs font-bold text-[#2D7A50] flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                설정이 저장되었습니다!
              </span>
            ) : (
              <span className="text-[11px] text-[#678274]">
                설정 내용은 브라우저에 안전하게 보관됩니다.
              </span>
            )}
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#2D7A50] hover:bg-[#236440] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>설정 저장하기</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Log */}
      <div className="bg-white rounded-3xl border border-[#E3ECE6] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#2D7A50]" />
            <h2 className="text-base font-bold text-[#1E3329]">
              배출 완료 히스토리
            </h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-[#95A59D] hover:text-[#D04242] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>기록 비우기</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-[#718B7D] py-4 text-center">
            아직 배출 완료 기록이 없습니다. 홈에서 '오늘 배출 완료!'를 누르면 이곳에 차곡차곡 기록됩니다.
          </p>
        ) : (
          <div className="divide-y divide-[#F0F5F2]">
            {history.map((item) => {
              const d = new Date(item.timestamp);
              const dateStr = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} (${
                ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
              })`;
              return (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-[#1E3329]">{dateStr} 배출</span>
                    <p className="text-[#5B7567] mt-0.5">
                      {item.daysElapsed}일 만에 배출 · 총 {item.totalGrams}g ({item.itemCount}개 품목)
                    </p>
                    {item.note && (
                      <p className="text-[11px] text-[#718B7D] italic mt-0.5">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-[#2D7A50] bg-[#EAF7EE] px-2.5 py-1 rounded-lg shrink-0">
                    완료
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
