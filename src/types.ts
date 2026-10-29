export type WasteAmount = 'small' | 'medium' | 'large';

export type WasteCategory =
  | 'fruits'
  | 'vegetables'
  | 'meal_leftovers'
  | 'delivery'
  | 'soup_solids'
  | 'bakery_snacks'
  | 'other';

export type StorageMethod = 'freezer' | 'airtight' | 'fridge' | 'regular_bag';

export interface WasteRecord {
  id: string;
  timestamp: string; // ISO
  amount: WasteAmount;
  category: WasteCategory;
  categoryLabel: string;
  storageMethod: StorageMethod;
  notes?: string;
  estimatedGrams: number;
}

export interface DisposalEvent {
  id: string;
  timestamp: string; // ISO
  daysElapsed: number;
  totalGrams: number;
  itemCount: number;
  bagSizeLiters: number;
  note?: string;
}

export interface DisposalSettings {
  bagCapacityLiters: number; // 1, 2, 3, 5
  allowedDays: number[]; // 0: Sun, 1: Mon, ... 6: Sat
  disposalTimeWindow: string; // e.g. "19:00 ~ 24:00"
  disposalLocation: string; // e.g. "빌라 1층 입구 음식물 수거함"
  disposalType: 'bag' | 'rfid' | 'sticker' | 'container';
  summerMode: boolean; // quicker warning
  customWarningDays: number; // default 3
}

export interface WasteGuideItem {
  name: string;
  isFoodWaste: boolean;
  reason: string;
  tip: string;
  tags: string[];
}
