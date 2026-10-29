import { DisposalEvent, DisposalSettings, WasteRecord } from '../types';
import { INITIAL_SETTINGS } from '../data/tips';

const STORAGE_KEYS = {
  RECORDS: 'sodam_waste_records_v1',
  HISTORY: 'sodam_disposal_history_v1',
  SETTINGS: 'sodam_settings_v1',
  LAST_DISPOSAL: 'sodam_last_disposal_date_v1'
};

export const getInitialData = () => {
  // Check records
  let records: WasteRecord[] = [];
  try {
    const rawRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (rawRecords) {
      records = JSON.parse(rawRecords);
    } else {
      // Default sample records for realistic single-person experience
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      records = [
        {
          id: 'sample-1',
          timestamp: yesterday.toISOString(),
          amount: 'small',
          category: 'fruits',
          categoryLabel: '과일류 / 사과 껍질',
          storageMethod: 'freezer',
          notes: '사과 1개 깎아 먹음, 냉동 밀폐통에 보관',
          estimatedGrams: 80
        },
        {
          id: 'sample-2',
          timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
          amount: 'medium',
          category: 'meal_leftovers',
          categoryLabel: '식사 잔반 / 밥 & 반찬',
          storageMethod: 'airtight',
          notes: '물기 꽉 짜고 베이킹소다 솔솔 뿌림',
          estimatedGrams: 220
        }
      ];
    }
  } catch (e) {
    console.error('Error reading records', e);
  }

  // Check history
  let history: DisposalEvent[] = [];
  try {
    const rawHist = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (rawHist) {
      history = JSON.parse(rawHist);
    } else {
      const now = new Date();
      history = [
        {
          id: 'hist-1',
          timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          daysElapsed: 3,
          totalGrams: 650,
          itemCount: 4,
          bagSizeLiters: 1,
          note: '1L 종량제 봉투 가득 채워 월요일 저녁 배출 완료'
        }
      ];
    }
  } catch (e) {
    console.error('Error reading history', e);
  }

  // Check settings
  let settings: DisposalSettings = INITIAL_SETTINGS;
  try {
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (rawSettings) {
      settings = { ...INITIAL_SETTINGS, ...JSON.parse(rawSettings) };
    }
  } catch (e) {
    console.error('Error reading settings', e);
  }

  // Check last disposal date
  let lastDisposalDate = '';
  try {
    const rawDate = localStorage.getItem(STORAGE_KEYS.LAST_DISPOSAL);
    if (rawDate) {
      lastDisposalDate = rawDate;
    } else {
      // Default: 2 days ago so user immediately sees real D-day indicator (D+2)
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      lastDisposalDate = twoDaysAgo.toISOString();
    }
  } catch (e) {
    console.error('Error reading last disposal date', e);
  }

  return { records, history, settings, lastDisposalDate };
};

export const saveRecords = (records: WasteRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error(e);
  }
};

export const saveHistory = (history: DisposalEvent[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }
};

export const saveSettings = (settings: DisposalSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
};

export const saveLastDisposalDate = (isoDate: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_DISPOSAL, isoDate);
  } catch (e) {
    console.error(e);
  }
};

export const calculateDaysElapsed = (lastDisposalDate: string): number => {
  if (!lastDisposalDate) return 0;
  const last = new Date(lastDisposalDate);
  const now = new Date();
  
  // Set both to midnight for whole day comparison
  const lastMidnight = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  const diffDays = Math.round((nowMidnight - lastMidnight) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const getRiskAssessment = (
  daysElapsed: number,
  hasSmellyItems: boolean,
  isSummer: boolean,
  customThreshold: number = 3
) => {
  const effectiveThreshold = isSummer ? Math.min(2, customThreshold) : customThreshold;

  if (daysElapsed >= effectiveThreshold || (daysElapsed >= 2 && hasSmellyItems)) {
    return {
      level: 3 as const,
      label: '배출 권장 (경고)',
      statusText: '초파리 & 악취 주의보!',
      description: '배출한 지 3일 이상 경과했거나 부패 위험이 큽니다. 오늘 바로 배출하세요!',
      accentColor: 'text-[#D04242]',
      bgColor: 'bg-[#FFF0F0]',
      borderColor: 'border-[#F8D0D0]',
      progressPct: 100
    };
  } else if (daysElapsed >= 2 || hasSmellyItems) {
    return {
      level: 2 as const,
      label: '주의 단계',
      statusText: '냄새 발생 주의',
      description: '부패가 시작되는 시점입니다. 냉동 보관으로 전환하거나 소주/식초를 분무하세요.',
      accentColor: 'text-[#B4690E]',
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-[#FDE68A]',
      progressPct: 66
    };
  } else {
    return {
      level: 1 as const,
      label: '쾌적 단계',
      statusText: '청결하고 안심',
      description: '밀폐 또는 냉동 보관으로 냄새와 벌레 걱정 없는 쾌적한 상태입니다.',
      accentColor: 'text-[#2D7A50]',
      bgColor: 'bg-[#EBF7EE]',
      borderColor: 'border-[#CCE8D4]',
      progressPct: 33
    };
  }
};

export const isTodayDisposalDay = (allowedDays: number[]): boolean => {
  const todayDay = new Date().getDay(); // 0 is Sun, 1 is Mon...
  return allowedDays.includes(todayDay);
};

export const getNextDisposalDayNotice = (allowedDays: number[]): string => {
  if (allowedDays.length === 0) return '배출 요일 미설정';
  const todayDay = new Date().getDay();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  if (allowedDays.includes(todayDay)) {
    return '오늘 배출 가능 (수거일)';
  }

  // Find next closest day
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (todayDay + offset) % 7;
    if (allowedDays.includes(nextDay)) {
      if (offset === 1) return `내일(${dayNames[nextDay]}) 배출 가능`;
      return `${offset}일 뒤 ${dayNames[nextDay]}요일 배출`;
    }
  }

  return '';
};
