import React, { useState } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { WasteRecord } from '../types';

interface DisposalCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => void;
  daysElapsed: number;
  records: WasteRecord[];
}

export const DisposalCelebrationModal: React.FC<DisposalCelebrationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  daysElapsed,
  records
}) => {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const totalGrams = records.reduce((sum, r) => sum + r.estimatedGrams, 0);

  const handleConfirm = () => {
    onConfirm(note.trim() || undefined);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#DEECE2] animate-scale-up">
        {/* Visual Header Image */}
        <div className="relative aspect-[16/10] bg-[#F2F7F4] overflow-hidden">
          <img
            src="/src/assets/images/fresh_clean_home_1793252558430.jpg"
            alt="깨끗하고 상쾌한 주방"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#2D7A50] flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2D7A50]" />
            <span>날파리·냄새 제로 쾌적 주방</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-[#1E3329]">
              오늘 배출을 완료하셨나요?
            </h3>
            <p className="text-xs text-[#526D5E] leading-relaxed">
              확인을 누르면 마지막 배출일이 오늘로 갱신되어 <strong className="text-[#2D7A50]">D+0일로 리셋</strong>되며, 현재 보관함이 비워집니다.
            </p>
          </div>

          {/* Quick summary stats */}
          <div className="p-3.5 rounded-2xl bg-[#F6FAF7] border border-[#DEECE2] grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#638072] block">경과 일수</span>
              <span className="font-extrabold text-[#1E3329] text-base tabular-nums">
                {daysElapsed}일 만에
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#638072] block">비운 쓰레기</span>
              <span className="font-extrabold text-[#2D7A50] text-base tabular-nums">
                약 {totalGrams}g
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#638072] block">품목 수</span>
              <span className="font-extrabold text-[#1E3329] text-base tabular-nums">
                {records.length}건
              </span>
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold text-[#2E4839]">
              배출 메모 (선택사항)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 1L 봉투 가득 채워 수거함 배출 완료"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5E4DB] bg-[#FAFBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E8B62]"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D5E3DB] hover:bg-[#F2F7F4] text-xs font-medium text-[#486655] transition-colors cursor-pointer"
            >
              아직 안 버림 (취소)
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2D7A50] hover:bg-[#236440] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>배출 완료 & D-Day 리셋</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
