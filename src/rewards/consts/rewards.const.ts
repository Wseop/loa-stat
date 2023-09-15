export const DataRange: {
  readonly [key: string]: string;
} = {
  카오스던전: 'chaos!E:L',
  가디언토벌: 'guardian!A:E',
} as const;

export const ChaosDungeonRewardMap: {
  readonly [key: string]: readonly string[];
} = {
  절망1: [
    '실링',
    '명예의 파편 주머니(소)',
    '파괴강석',
    '수호강석',
    '경이로운 명예의 돌파석',
    '1레벨 멸화의 보석',
  ],
  절망2: [
    '실링',
    '명예의 파편 주머니(소)',
    '파괴강석',
    '수호강석',
    '경이로운 명예의 돌파석',
    '1레벨 멸화의 보석',
  ],
  천공1: [
    '실링',
    '명예의 파편 주머니(소)',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 멸화의 보석',
  ],
  천공2: [
    '실링',
    '명예의 파편 주머니(소)',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 멸화의 보석',
  ],
  계몽1: [
    '실링',
    '명예의 파편 주머니(소)',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 멸화의 보석',
  ],
  계몽2: [
    '실링',
    '명예의 파편 주머니(소)',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 멸화의 보석',
  ],
} as const;

export const GuardianRewardMap: {
  readonly [key: string]: readonly string[];
} = {
  하누마탄: ['파괴강석', '수호강석', '경이로운 명예의 돌파석'],
  소나벨: ['정제된 파괴강석', '정제된 수호강석', '찬란한 명예의 돌파석'],
  가르가디스: ['정제된 파괴강석', '정제된 수호강석', '찬란한 명예의 돌파석'],
  베스칼: ['정제된 파괴강석', '정제된 수호강석', '찬란한 명예의 돌파석'],
} as const;

export const RewardItemKey: { readonly [key: string]: readonly string[] } = {
  절망1: [
    '실링',
    '명예의 파편',
    '파괴강석',
    '수호강석',
    '경이로운 명예의 돌파석',
    '1레벨 보석',
  ],
  절망2: [
    '실링',
    '명예의 파편',
    '파괴강석',
    '수호강석',
    '경이로운 명예의 돌파석',
    '1레벨 보석',
  ],
  천공1: [
    '실링',
    '명예의 파편',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 보석',
  ],
  천공2: [
    '실링',
    '명예의 파편',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 보석',
  ],
  계몽1: [
    '실링',
    '명예의 파편',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 보석',
  ],
  계몽2: [
    '실링',
    '명예의 파편',
    '정제된 파괴강석',
    '정제된 수호강석',
    '찬란한 명예의 돌파석',
    '1레벨 보석',
  ],
  하누마탄: ['파괴강석', '수호강석', '경이로운 명예의 돌파석'],
  소나벨: ['정제된 파괴강석', '정제된 수호강석', '찬란한 명예의 돌파석'],
  가르가디스: ['정제된 파괴강석', '정제된 수호강석', '찬란한 명예의 돌파석'],
  베스칼: ['정제된 파괴강석', '정제된 수호강석', '찬란한 명예의 돌파석'],
} as const;
