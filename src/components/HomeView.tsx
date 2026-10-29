import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Snowflake,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import { DisposalSettings, WasteRecord } from '../types';
import {
  getRiskAssessment,
  isTodayDisposalDay,
  getNextDisposalDayNotice
} from '../utils/storage';
import { CATEGORY_GUIDES } from '../data/categoryTips';

interface HomeViewProps {
  records: WasteRecord[];
  daysElapsed: number;
  lastDisposalDate: string;
  settings: DisposalSettings;
  onOpenRecordModal: () => void;
  onOpenDisposalModal: () => void;
  onDeleteRecord: (id: string) => void;
  onAdjustDaysElapsed: (offsetDays: number) => void;
  onNavigateToTab: (tab: 'record' | 'tips' | 'settings') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  records,
  daysElapsed,
  settings,
  onOpenRecordModal,
  onOpenDisposalModal,
  onDeleteRecord,
  onAdjustDaysElapsed,
  onNavigateToTab
}) => {
  const totalGrams = records.reduce((sum, r) => sum + r.estimatedGrams, 0);
  const bagCapacityGrams = settings.bagCapacityLiters * 650; // roughly 650g for 1L food waste
  const fillPercentage = Math.min(100, Math.round((totalGrams / bagCapacityGrams) * 100));

  const hasSmellyItems = records.some(
    (r) => r.category === 'other' || r.category === 'delivery' || r.category === 'fruits'
  );

  const risk = getRiskAssessment(
    daysElapsed,
    hasSmellyItems,
    settings.summerMode,
    settings.customWarningDays
  );

  const todayIsDisposalDay = isTodayDisposalDay(settings.allowedDays);
  const nextDisposalNotice = getNextDisposalDayNotice(settings.allowedDays);

  const storageMethodLabels: Record<string, { label: string; icon: string; color: string }> = {
    freezer: { label: '냉동실 보관', icon: '❄️', color: 'bg-sky-50 text-sky-800 border-sky-200' },
    airtight: { label: '밀폐용기 보관', icon: '🔒', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    fridge: { label: '냉장 보관', icon: '🧊', color: 'bg-teal-50 text-teal-800 border-teal-200' },
    regular_bag: { label: '일반 비닐/통', icon: '🛍️', color: 'bg-amber-50 text-amber-800 border-amber-200' }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 3일 이상 경과 혹은 경고 시 뜨는 스마트 알림 배너 */}
      {risk.level === 3 && (
        <div className="p-4 rounded-2xl bg-[#FFF1F1] border border-[#FCD2D2] text-[#8C1D1D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDE2E2] flex items-center justify-center shrink-0 text-[#D04242]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[#B52A2A]">
                  배출 권장 알림 (D+{daysElapsed}일 경과)
                </span>
                <span className="text-xs bg-[#FDE2E2] text-[#B52A2A] font-semibold px-2 py-0.5 rounded-full">
                  초파리 주의
                </span>
              </div>
              <p className="text-xs text-[#9B2C2C] mt-0.5 leading-relaxed">
                마지막 배출 후 3일 이상 지났습니다. 부패 악취와 날파리 번식 위험이 높으니 오늘 저녁에 배출하세요!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDisposalModal}
            className="self-stretch sm:self-auto px-4 py-2 bg-[#D04242] hover:bg-[#B52A2A] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer text-center"
          >
            지금 비우고 리셋
          </button>
        </div>
      )}

      {/* Hero Card & D-Day Status Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E3ECE6] shadow-xs p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Visual Artwork & Warm Atmosphere */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-[#F2F6F3]">
              <img
                src="/src/assets/images/hero_kitchen_caddy_1793252557776.jpg"
                alt="깨끗하고 쾌적한 1인 가구 주방과 밀폐 음식물 쓰레기 보관용기"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  우리 집 소량 보관함
                </span>
                <span className="text-[11px] opacity-90">
                  {records.length > 0 ? `${records.length}개 보관 중` : '비어있음'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: D-Day & Risk Assessment */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Header metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#587364] mb-2">
                <div className="flex items-center gap-2">
                  <span>1인 가구 소량 관리</span>
                  <span aria-hidden="true">·</span>
                  <span>{settings.bagCapacityLiters}L 종량제 기준</span>
                </div>

                {/* Day adjuster simulation widget */}
                <div className="flex items-center gap-1 bg-[#F4F7F5] rounded-lg p-0.5 border border-[#E3ECE6] text-[11px]">
                  <span className="px-1.5 text-[#5B7567]">경과일 조정:</span>
                  <button
                    onClick={() => onAdjustDaysElapsed(Math.max(0, daysElapsed - 1))}
                    title="1일 전으로 (D-day 감소)"
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-[#2C3E35] font-semibold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-[#1E3329] px-1 tabular-nums">
                    {daysElapsed}일
                  </span>
                  <button
                    onClick={() => onAdjustDaysElapsed(daysElapsed + 1)}
                    title="1일 후로 (D-day 증가)"
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-[#2C3E35] font-semibold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Main Headline & D-day */}
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B3025] tracking-tight tabular-nums">
                    D+{daysElapsed}
                  </h1>
                  <span className="text-sm font-semibold text-[#526B5C]">
                    마지막 배출 후 {daysElapsed}일 경과
                  </span>
                </div>
              </div>

              {/* Current Storage Condition Card */}
              <div className={`mt-4 p-4 rounded-2xl ${risk.bgColor} border ${risk.borderColor} transition-colors`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {risk.level === 1 ? '🌿' : risk.level === 2 ? '⚠️' : '🚨'}
                    </span>
                    <span className={`text-sm font-bold ${risk.accentColor}`}>
                      {risk.statusText} ({risk.label})
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#526B5C]">
                    위험도 {risk.level}/3단계
                  </span>
                </div>

                {/* Level progress bar */}
                <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      risk.level === 1
                        ? 'bg-[#2D7A50]'
                        : risk.level === 2
                        ? 'bg-[#D97706]'
                        : 'bg-[#D04242]'
                    }`}
                    style={{ width: `${risk.progressPct}%` }}
                  />
                </div>

                <p className="text-xs text-[#3E5548] leading-relaxed">
                  {risk.description}
                </p>
              </div>
            </div>

            {/* Bag fill progress and primary actions */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-[#446051] mb-1 font-medium">
                  <span>현재 봉투 채움 상태 (추정 {totalGrams}g / {bagCapacityGrams}g)</span>
                  <span className="font-mono tabular-nums text-[#1E3329] font-bold">{fillPercentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#EAF0EC] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      fillPercentage >= 85
                        ? 'bg-[#D04242]'
                        : fillPercentage >= 50
                        ? 'bg-[#3E8B62]'
                        : 'bg-[#5DB082]'
                    }`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  onClick={onOpenDisposalModal}
                  className="w-full sm:flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#2D7A50] hover:bg-[#256843] active:scale-[0.98] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>오늘 배출 완료! (비우기)</span>
                </button>
                <button
                  onClick={onOpenRecordModal}
                  className="w-full sm:w-auto min-h-[46px] px-4 py-2.5 rounded-xl bg-[#E8F1EC] hover:bg-[#DCEAE1] text-[#1E3329] font-semibold text-sm transition-all flex items-center justify-center gap-1.5 border border-[#D5E4DB] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#2D7A50]" />
                  <span>소량 기록 추가</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Neighborhood schedule info pill */}
      <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E2EFE7] text-[#2D7A50] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-[#1E3329]">
              <span>우리 동네 배출 알림</span>
              {todayIsDisposalDay ? (
                <span className="text-[11px] font-bold text-[#2D7A50] bg-[#E3F4EB] px-2 py-0.5 rounded-md border border-[#CCE8D4]">
                  🚚 오늘 배출 가능일!
                </span>
              ) : (
                <span className="text-[11px] text-[#5C7567] bg-[#EAF0EC] px-2 py-0.5 rounded-md">
                  {nextDisposalNotice}
                </span>
              )}
            </div>
            <p className="text-[#556F61] mt-0.5">
              배출 시간: {settings.disposalTimeWindow} · 장소: {settings.disposalLocation}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('settings')}
          className="text-[#2D7A50] hover:text-[#1E3329] font-medium flex items-center gap-1 self-end sm:self-auto transition-colors cursor-pointer"
        >
          <span>배출 요일 변경</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Batch List (Current Food Waste Records) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-[#1E3329]">현재 보관 중인 쓰레기</h2>
            <p className="text-xs text-[#5B7567]">
              마지막 배출 이후 누적된 소량 발생 내역입니다 ({records.length}건)
            </p>
          </div>
          {records.length > 0 && (
            <button
              onClick={onOpenRecordModal}
              className="text-xs font-semibold text-[#2D7A50] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>추가하기</span>
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E3ECE6] text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAF7EE] text-[#2D7A50] flex items-center justify-center text-xl">
              ✨
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1E3329]">보관 중인 쓰레기가 없습니다!</h3>
              <p className="text-xs text-[#5B7567] max-w-sm mx-auto">
                주방이 말끔하게 비워져 있어요. 식사나 요리 후 발생한 소량 쓰레기가 있다면 간편하게 기록해 보세요.
              </p>
            </div>
            <button
              onClick={onOpenRecordModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D7A50] hover:bg-[#256843] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>첫 기록 남기기</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {records.map((record) => {
              const guide = CATEGORY_GUIDES[record.category];
              const storageInfo = storageMethodLabels[record.storageMethod] || storageMethodLabels.airtight;
              const dateObj = new Date(record.timestamp);
              const timeString = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(
                dateObj.getHours()
              ).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

              return (
                <div
                  key={record.id}
                  className="p-4 rounded-2xl bg-white border border-[#E3ECE6] hover:border-[#CCDED3] transition-all shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1 rounded-xl bg-[#F4F7F5]">
                          {guide?.emoji || '🥗'}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[#1E3329]">
                              {record.categoryLabel}
                            </span>
                            <span className="text-[11px] font-mono tabular-nums text-[#5C7567] bg-[#F0F4F1] px-1.5 py-0.2 rounded">
                              약 {record.estimatedGrams}g
                            </span>
                          </div>
                          <span className="text-[11px] text-[#718A7C]">기록: {timeString}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        title="기록 삭제"
                        className="p-1.5 rounded-lg text-[#95A59D] hover:text-[#D04242] hover:bg-[#FEECEC] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {record.notes && (
                      <p className="text-xs text-[#445E50] bg-[#FAFBF9] p-2 rounded-xl border border-[#EDF3EF]">
                        "{record.notes}"
                      </p>
                    )}

                    {/* Storage method indicator */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${storageInfo.color}`}>
                        <span>{storageInfo.icon}</span>
                        <span>{storageInfo.label}</span>
                      </span>
                      {guide?.bugRisk === '초파리 급증' && (
                        <span className="text-[11px] font-medium text-[#C44343] bg-[#FEEFEF] px-1.5 py-0.5 rounded-md">
                          🪰 초파리 주의
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contextual Mini Tip from the Guide */}
                  {guide && (
                    <div className="pt-2 border-t border-[#F0F5F2] flex items-center justify-between text-[11px] text-[#556F61]">
                      <span className="truncate pr-2">
                        💡 팁: {guide.storageTip.bestMethod}
                      </span>
                      <button
                        onClick={() => onNavigateToTab('tips')}
                        className="text-[#2D7A50] font-semibold hover:underline shrink-0 cursor-pointer"
                      >
                        가이드 보기
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick link banner to the category tips */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#EFF6F1] to-[#FAF8F5] border border-[#DEEBE2] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white text-xl flex items-center justify-center shadow-xs border border-[#D8E6DD] shrink-0">
            📖
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E3329]">
              종류별 냄새 방지 & 배출 가이드
            </h3>
            <p className="text-xs text-[#526D5E] mt-0.5">
              채소, 과일, 육류, 생선 등 종류에 맞춘 냄새 차단법과 요일별 배출 꿀팁을 확인하세요.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('tips')}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-[#F2F6F3] text-[#244E36] font-semibold text-xs border border-[#CCDED3] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-1"
        >
          <span>맞춤 팁 확인</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
