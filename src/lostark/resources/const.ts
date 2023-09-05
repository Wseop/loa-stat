export const servers: readonly string[] = [
  '루페온',
  '아만',
  '카단',
  '카제로스',
  '카마인',
  '아브렐슈드',
  '실리안',
  '니나브',
] as const;

export const classMap: { [key: string]: readonly string[] } = {
  버서커: ['광기', '광전사의 비기'],
  디스트로이어: ['분노의 망치', '중력 수련'],
  워로드: ['전투 태세', '고독한 기사'],
  홀리나이트: ['축복의 오라', '심판자'],
  슬레이어: ['처단자', '포식자'],
  배틀마스터: ['오의 강화', '초심'],
  인파이터: ['극의: 체술', '충격 단련'],
  기공사: ['세맥타통', '역천지체'],
  창술사: ['절정', '절제'],
  스트라이커: ['일격필살', '오의난무'],
  블레이드: ['잔재된 기운', '버스트'],
  데모닉: ['완벽한 억제', '멈출 수 없는 충동'],
  리퍼: ['갈증', '달의 소리'],
  소울이터: ['만월의 집행자', '그믐의 경계'],
  호크아이: ['두 번째 동료', '죽음의 습격'],
  데빌헌터: ['핸드거너', '강화 무기'],
  블래스터: ['화력 강화', '포격 강화'],
  스카우터: ['아르데타인의 기술', '진화의 유산'],
  건슬링어: ['피스메이커', '사냥의 시간'],
  아르카나: ['황후의 은총', '황제의 칙령'],
  서머너: ['상급 소환사', '넘치는 교감'],
  바드: ['절실한 구원', '진실된 용맹'],
  소서리스: ['점화', '환류'],
  도화가: ['만개', '회귀'],
  기상술사: ['질풍노도', '이슬비'],
} as const;

export const engravings: readonly string[] = [
  '원한',
  '중갑 착용',
  '실드 관통',
  '굳은 의지',
  '강령술',
  '안정된 상태',
  '강화 방패',
  '기습의 대가',
  '마나의 흐름',
  '분쇄의 주먹',
  '최대 마나 증가',
  '결투의 대가',
  '질량 증가',
  '저주받은 인형',
  '위기 모면',
  '달인의 저력',
  '부러진 뼈',
  '승부사',
  '돌격대장',
  '약자 무시',
  '구슬동자',
  '바리케이드',
  '마나 효율 증가',
  '긴급구조',
  '정기 흡수',
  '에테르 포식자',
  '슈퍼 차지',
  '예리한 둔기',
  '여신의 가호',
  '폭발물 전문가',
  '타격의 대가',
  '속전속결',
  '전문의',
  '정밀 단도',
  '각성',
  '불굴',
  '선수필승',
  '급소 타격',
  '번개의 분노',
  '탈출의 명수',
  '추진력',
  '시선 집중',
  '아드레날린',
] as const;

export const classEngravingMap: { [key: string]: string } = {
  피스메이커: '건슬링어',
  '사냥의 시간': '건슬링어',
  세맥타통: '기공사',
  역천지체: '기공사',
  질풍노도: '기상술사',
  이슬비: '기상술사',
  '완벽한 억제': '데모닉',
  '멈출 수 없는 충동': '데모닉',
  '강화 무기': '데빌헌터',
  핸드거너: '데빌헌터',
  회귀: '도화가',
  만개: '도화가',
  '분노의 망치': '디스트로이어',
  '중력 수련': '디스트로이어',
  갈증: '리퍼',
  '달의 소리': '리퍼',
  '진실된 용맹': '바드',
  '절실한 구원': '바드',
  '오의 강화': '배틀마스터',
  초심: '배틀마스터',
  광기: '버서커',
  '광전사의 비기': '버서커',
  '화력 강화': '블래스터',
  '포격 강화': '블래스터',
  '잔재된 기운': '블레이드',
  버스트: '블레이드',
  '상급 소환사': '서머너',
  '넘치는 교감': '서머너',
  점화: '소서리스',
  환류: '소서리스',
  '만월의 집행자': '소울이터',
  '그믐의 경계': '소울이터',
  '아르데타인의 기술': '스카우터',
  '진화의 유산': '스카우터',
  일격필살: '스트라이커',
  오의난무: '스트라이커',
  포식자: '슬레이어',
  처단자: '슬레이어',
  '황후의 은총': '아르카나',
  '황제의 칙령': '아르카나',
  '전투 태세': '워로드',
  '고독한 기사': '워로드',
  '극의: 체술': '인파이터',
  '충격 단련': '인파이터',
  절정: '창술사',
  절제: '창술사',
  '두 번째 동료': '호크아이',
  '죽음의 습격': '호크아이',
  심판자: '홀리나이트',
  '축복의 오라': '홀리나이트',
} as const;

// 유효 세트만 사용
export const sets: readonly string[] = [
  '구원',
  '악몽',
  '사멸',
  '지배',
  '갈망',
  '환각',
];
