import { WasteCategory } from '../types';

export interface CategoryDetailGuide {
  id: WasteCategory;
  name: string;
  emoji: string;
  badgeColor: string; // Tailwind color class for pastel tags
  odorRisk: '매우 높음' | '높음' | '보통' | '낮음';
  bugRisk: '초파리 급증' | '위험' | '보통' | '안전';
  summary: string;
  // Specific anti-odor & storage advice
  storageTip: {
    bestMethod: string;
    description: string;
    actionSteps: string[];
  };
  // General disposal day and handling instructions
  disposalAdvice: {
    recommendedTiming: string; // e.g. "배출 당일 직전까지 냉동 후 배출"
    preparation: string; // e.g. "수분 꽉 짜기, 소금기 헹구기"
    generalTrashWarning?: string; // e.g. "치킨뼈나 조개껍데기는 일반쓰레기!"
  };
  keyDoAndDont: {
    dos: string[];
    donts: string[];
  };
}

export const CATEGORY_GUIDES: Record<WasteCategory, CategoryDetailGuide> = {
  vegetables: {
    id: 'vegetables',
    name: '채소 / 나물류',
    emoji: '🥬',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    odorRisk: '보통',
    bugRisk: '보통',
    summary: '수분을 머금은 채소는 쉽게 물러서 악취의 원인이 됩니다. 반나절 말려 부피를 줄이세요.',
    storageTip: {
      bestMethod: '신문지 흡수 후 밀폐 보관 또는 냉동',
      description: '채소 다듬은 부스러기는 수분 함량이 80% 이상입니다. 신문지나 키친타월에 펼쳐 수분을 날린 후 넣으면 부피가 1/3로 줄어듭니다.',
      actionSteps: [
        '싱크대 거름망에서 물기를 꾹 짜냅니다.',
        '봉투 바닥에 키친타월을 깔고 채소를 담아 침출수를 흡수합니다.',
        '며칠 모아야 한다면 1L 밀폐용기에 담아 냉동실에 얼려두는 것이 가장 깔끔합니다.'
      ]
    },
    disposalAdvice: {
      recommendedTiming: '주 2회 정기 배출일 (월·목 or 화·금 등) 맞춰 배출',
      preparation: '흙이나 이물질을 물로 가볍게 털어내고 물기를 최대한 제거하세요.',
      generalTrashWarning: '주의: 양파 껍질, 마늘 껍질, 대파 뿌리, 옥수수 수염/대는 일반 종량제 봉투로 버려야 합니다!'
    },
    keyDoAndDont: {
      dos: ['물기 꽉 짜서 넣기', '양배추/배추 등 큰 잎은 가위로 잘게 자르기'],
      donts: ['흙 묻은 채로 그대로 넣기', '양파 껍질과 대파 뿌리 혼입하기']
    }
  },
  fruits: {
    id: 'fruits',
    name: '과일류 / 과일 껍질',
    emoji: '🍎',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    odorRisk: '높음',
    bugRisk: '초파리 급증',
    summary: '달콤한 과당 성분은 초파리를 유인하는 1등 주범입니다. 즉시 에탄올/식초를 뿌리거나 급속 냉동하세요.',
    storageTip: {
      bestMethod: '전용 밀폐용기에 넣어 냉동 보관',
      description: '바나나, 사과, 귤껍질 등은 상온에 반나절만 두어도 공기 중의 초파리가 냄새를 맡고 몰려듭니다. 섭취 즉시 냉동실 전용통에 격리하세요.',
      actionSteps: [
        '과일을 먹은 즉시 상온에 방치하지 말고 밀폐 비닐/용기에 넣습니다.',
        '분무기로 소주나 알코올을 1회 가볍게 칙 뿌려 당분의 발효를 차단합니다.',
        '수박이나 멜론 껍질은 부피가 크므로 3~4cm 크기로 깍둑썰기하여 부피를 최소화합니다.'
      ]
    },
    disposalAdvice: {
      recommendedTiming: '여름철엔 2일 이내 배출, 또는 배출일 당일 아침까지 냉동 보관',
      preparation: '수박 등 즙이 많은 과일은 손으로 즙을 꼭 짜낸 후 봉투에 담으세요.',
      generalTrashWarning: '주의: 복숭아, 살구, 감, 아보카도 씨앗과 호두/밤 껍질은 일반쓰레기입니다!'
    },
    keyDoAndDont: {
      dos: ['수박/멜론 껍질 가위나 칼로 잘게 썰기', '바나나 꼭지의 단단한 줄기 분리하기'],
      donts: ['싱크대 위에 과일 껍질 1시간 이상 방치하기', '복숭아 씨앗을 음식물 봉투에 넣기']
    }
  },
  meal_leftovers: {
    id: 'meal_leftovers',
    name: '식사 잔반 / 밥 / 반찬',
    emoji: '🍚',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    odorRisk: '높음',
    bugRisk: '위험',
    summary: '김치 양념이나 젓갈류 등 염분이 많은 잔반은 헹구고, 베이킹소다를 살짝 뿌려 부패취를 억제합니다.',
    storageTip: {
      bestMethod: '양념 헹굼 후 밀폐 보관 + 베이킹소다 살포',
      description: '반찬류의 고춧가루와 마늘 양념은 상온에서 시큼하고 매캐한 산성 악취를 발생시킵니다.',
      actionSteps: [
        '김치나 양념이 진한 반찬은 물을 살짝 부어 양념을 헹군 뒤 물기를 뺍니다.',
        '음식물 쓰레기통에 넣은 후 베이킹소다 반 스푼을 솔솔 뿌려 산성을 중화시킵니다.',
        '밥이나 떡류는 물을 흡수하면 질척해지므로 마른 상태 그대로 봉투에 넣으세요.'
      ]
    },
    disposalAdvice: {
      recommendedTiming: '발생 후 2~3일 이내, 동네 정기 수거일 저녁 시간대 배출',
      preparation: '고추장, 된장, 쌈장 등 고염분 장류는 다량으로 넣지 말고 일반쓰레기로 분리하거나 물에 희석하세요.',
      generalTrashWarning: '주의: 찻잎 티백, 한약재 찌꺼기는 비료화가 되지 않으므로 일반쓰레기입니다.'
    },
    keyDoAndDont: {
      dos: ['진한 양념 물로 살짝 헹구기', '물기 꽉 짠 뒤 베이킹소다 뿌리기'],
      donts: ['국물과 찌꺼기를 한꺼번에 쏟아붓기', '고추장 통째로 버리기']
    }
  },
  delivery: {
    id: 'delivery',
    name: '배달음식 잔반',
    emoji: '🛵',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    odorRisk: '매우 높음',
    bugRisk: '초파리 급증',
    summary: '1인 가구의 가장 큰 골칫거리! 치킨 뼈와 플라스틱 용기는 완벽히 분리하고 기름기는 닦아내세요.',
    storageTip: {
      bestMethod: '뼈/일반쓰레기 선분리 후 잔여 음식만 밀폐 냉동',
      description: '치킨, 피자, 떡볶이, 마라탕 등 배달음식은 기름기와 자극적인 조미료가 많아 상온에서 부패가 매우 빠릅니다.',
      actionSteps: [
        '치킨을 먹을 때 처음부터 뼈통(일반쓰레기 봉투)을 옆에 두고 뼈를 즉시 분리합니다.',
        '남은 살코기와 튀김옷 잔여물만 긁어모아 1L 소형 봉투에 담습니다.',
        '피자 테두리 빵 등은 다른 음식물의 수분을 흡수하는 용도로 봉투 바닥에 깔아도 좋습니다.'
      ]
    },
    disposalAdvice: {
      recommendedTiming: '주말 배달 후 바로 다음 날 아침/저녁 배출 추천',
      preparation: '플라스틱 용기에 남은 소스는 물로 깨끗이 헹궈 플라스틱으로 분리수거하세요.',
      generalTrashWarning: '주의: 치킨 뼈, 족발 뼈, 나무젓가락, 일회용 소스 비닐팩은 모두 일반쓰레기입니다!'
    },
    keyDoAndDont: {
      dos: ['뼈와 살코기 철저히 분리', '기름기 많은 잔반은 키친타월로 가볍게 닦아내기'],
      donts: ['치킨 뼈를 음식물 쓰레기봉투에 섞어 넣기', '포장 비닐째 통째로 버리기']
    }
  },
  soup_solids: {
    id: 'soup_solids',
    name: '국물 / 찌개 건더기',
    emoji: '🍲',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    odorRisk: '높음',
    bugRisk: '위험',
    summary: '국물은 싱크대 배수구에 버리고 건더기만 100% 탈수하여 배출해야 악취와 침출수를 막습니다.',
    storageTip: {
      bestMethod: '싱크대 거름망 탈수 후 밀폐 보관',
      description: '국물이 섞인 채로 종량제 봉투에 들어가면 봉투가 찢어지거나 엘리베이터 이동 시 악취 액체가 떨어지는 참사가 발생합니다.',
      actionSteps: [
        '라면이나 찌개 국물은 싱크대 거름망을 거쳐 액체만 먼저 하수구로 흘려보냅니다.',
        '거름망에 남은 건더기는 국자나 일회용 장갑으로 꾹 눌러 물기를 95% 이상 뺍니다.',
        '물기를 뺀 건더기만 음식물 쓰레기봉투에 털어 넣습니다.'
      ]
    },
    disposalAdvice: {
      recommendedTiming: '수거 요일 당일 저녁 배출 권장',
      preparation: '봉투에 구멍이 나지 않도록 바닥에 키친타월 1장을 깔아두면 안전합니다.',
      generalTrashWarning: '주의: 홍합 껍데기, 조개 껍데기, 꽃게 껍질은 딱딱하므로 건져서 일반쓰레기로 버리세요.'
    },
    keyDoAndDont: {
      dos: ['국물과 건더기 완벽 분리', '거름망 꾹 짜서 수분 최소화'],
      donts: ['찌개 국물째 음식물 봉투에 들이붓기', '조개껍데기 섞어 넣기']
    }
  },
  other: {
    id: 'other',
    name: '생선 / 해산물 / 육류',
    emoji: '🐟',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    odorRisk: '매우 높음',
    bugRisk: '초파리 급증',
    summary: '단백질 부패균과 트리메틸아민으로 인해 냄새가 가장 치명적입니다. 무조건 배출 직전까지 냉동하세요!',
    storageTip: {
      bestMethod: '배출 당일까지 냉동실 전용 밀폐용기에 밀봉 냉동 (필수)',
      description: '생선 대가리나 내장, 고기 핏물은 상온 24시간만 지나도 온 집안에 비린내와 구더기 원인이 됩니다.',
      actionSteps: [
        '소주나 레몬즙을 생선/고기 잔반 표면에 살짝 뿌려 비린내 휘발을 억제합니다.',
        '비닐봉투를 2중으로 묶거나 락앤락 전용 밀폐용기에 담아 즉시 냉동실에 얼립니다.',
        '수거 차량이 오는 배출일 당일 밤에 꺼내어 배출합니다.'
      ]
    },
    disposalAdvice: {
      recommendedTiming: '동네 쓰레기 배출 요일 당일 저녁 7시 이후에만 꺼내서 배출',
      preparation: '절대 전날 밤 상온에 미리 꺼내두지 마세요. 배출 직전에 봉투째 수거함으로 이동하세요.',
      generalTrashWarning: '주의: 굵은 생선 뼈, 소/돼지 갈비 뼈, 조개 껍데기는 일반쓰레기입니다!'
    },
    keyDoAndDont: {
      dos: ['생선 내장은 발생 즉시 2중 밀봉 후 냉동', '배출 요일 알림에 맞춰 당일 배출'],
      donts: ['원룸 싱크대나 휴지통에 생선 잔반 밤새 두기', '소뼈/돼지뼈 음식물 봉투에 넣기']
    }
  },
  bakery_snacks: {
    id: 'bakery_snacks',
    name: '빵 / 베이커리 / 간식',
    emoji: '🥪',
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    odorRisk: '낮음',
    bugRisk: '보통',
    summary: '수분이 적어 냄새는 적으나 방치 시 곰팡이가 핍니다. 다른 축축한 쓰레기의 수분 흡수재로 유용합니다.',
    storageTip: {
      bestMethod: '상온 밀폐 또는 다른 수분 많은 쓰레기와 함께 배출',
      description: '바게트, 식빵 자투리는 마른 상태에서는 냄새가 거의 나지 않습니다. 축축한 과일 껍질 밑에 깔아두면 천연 스펀지 역할을 합니다.',
      actionSteps: [
        '곰팡이가 피기 전 가급적 빨리 모아 버립니다.',
        '크기가 큰 빵은 손으로 뚝뚝 뜯어 부피를 줄여 넣습니다.'
      ]
    },
    disposalAdvice: {
      recommendedTiming: '다른 잔반과 함께 정기 배출일에 배출',
      preparation: '버터나 크림이 많이 묻은 빵은 기름기가 있으므로 밀폐용기에 보관하세요.',
      generalTrashWarning: '주의: 방부제(실리카겔)나 빵 포장 비닐은 비닐/일반쓰레기로 분리수거하세요.'
    },
    keyDoAndDont: {
      dos: ['식빵 조각을 다른 수분 많은 쓰레기 아래 깔아 수분 잡기'],
      donts: ['포장용 방습제(실리카겔) 함께 버리기']
    }
  }
};
