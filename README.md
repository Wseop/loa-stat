# loa-stat
- 로스트아크 컨텐츠 및 캐릭터 세팅 현황 등을 제공하기 위해 만든 API
# Tech Stack
<img src="https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"><img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"><img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"><img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
# 실행 예시
## 1. 캐릭터 통계 정보
- 서버별
<img src="https://github.com/Wseop/loa-stat/assets/18005580/a1c4d60f-28ff-4538-bb32-62e8643d5a6a" />

- 직업별
<img src="https://github.com/Wseop/loa-stat/assets/18005580/0783f00f-c1db-4e6e-9e00-d75db10a185a" />

- 직업각인 세팅
<img src="https://github.com/Wseop/loa-stat/assets/18005580/844c4480-5160-4a4b-b8eb-e03bdfc32b9e" />

- 직업각인 스킬
<img src="https://github.com/Wseop/loa-stat/assets/18005580/aed15b84-f08c-46a6-92de-ed38de3e4535" />

## 2. 시세 조회
[Desktop-2024.04.18-16.31.57.02.webm](https://github.com/Wseop/loa-stat/assets/18005580/7d90fa71-5e71-4e54-a315-b2b09a169516)

## 3. 카오스던전/가디언토벌 보상 통계
[Desktop-2024.04.18-16.32.26.03.webm](https://github.com/Wseop/loa-stat/assets/18005580/b222d9ba-5248-446e-a023-d096195a347c)
- 실시간 거래소 가격을 기반으로 골드 수익량 계산

# File Tree
```bash
📦src
 ┣ 📂apis
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂guards
 ┃ ┃ ┃ ┗ 📜dynamic-auth.guard.ts
 ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┗ 📜auth.interface.ts
 ┃ ┃ ┣ 📂strategies
 ┃ ┃ ┃ ┣ 📜jwt-access.strategy.ts
 ┃ ┃ ┃ ┣ 📜jwt-google.strategy.ts
 ┃ ┃ ┃ ┗ 📜jwt-refresh.strategy.ts
 ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┣ 📜auth.module.ts
 ┃ ┃ ┗ 📜auth.service.ts
 ┃ ┣ 📂character
 ┃ ┃ ┣ 📂classes
 ┃ ┃ ┃ ┣ 📜character-class-engravings.class.ts
 ┃ ┃ ┃ ┣ 📜character-servers.class.ts
 ┃ ┃ ┃ ┣ 📜character-settings.class.ts
 ┃ ┃ ┃ ┗ 📜character-skills.class.ts
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┣ 📜character-class-engravings.dto.ts
 ┃ ┃ ┃ ┣ 📜character-query.dto.ts
 ┃ ┃ ┃ ┣ 📜character-servers.dto.ts
 ┃ ┃ ┃ ┣ 📜character-settings.dto.ts
 ┃ ┃ ┃ ┣ 📜character-skills.dto.ts
 ┃ ┃ ┃ ┗ 📜character.dto.ts
 ┃ ┃ ┣ 📂functions
 ┃ ┃ ┃ ┗ 📜character.functions.ts
 ┃ ┃ ┣ 📂schemas
 ┃ ┃ ┃ ┗ 📜character.schema.ts
 ┃ ┃ ┣ 📜character.controller.ts
 ┃ ┃ ┣ 📜character.module.ts
 ┃ ┃ ┗ 📜character.service.ts
 ┃ ┣ 📂market-price
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┗ 📜item-price.dto.ts
 ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┗ 📜item-price.interface.ts
 ┃ ┃ ┣ 📜market-price.controller.ts
 ┃ ┃ ┣ 📜market-price.module.ts
 ┃ ┃ ┗ 📜market-price.service.ts
 ┃ ┣ 📂notices
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┗ 📜notice.dto.ts
 ┃ ┃ ┣ 📜notices.controller.ts
 ┃ ┃ ┣ 📜notices.module.ts
 ┃ ┃ ┗ 📜notices.service.ts
 ┃ ┗ 📂rewards
 ┃ ┃ ┣ 📂classes
 ┃ ┃ ┃ ┗ 📜reward.class.ts
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┗ 📜reward.dto.ts
 ┃ ┃ ┣ 📜rewards.controller.ts
 ┃ ┃ ┣ 📜rewards.module.ts
 ┃ ┃ ┗ 📜rewards.service.ts
 ┣ 📂commons
 ┃ ┣ 📂consts
 ┃ ┃ ┣ 📜google-sheet.const.ts
 ┃ ┃ ┣ 📜lostark.const.ts
 ┃ ┃ ┣ 📜market-price.const.ts
 ┃ ┃ ┗ 📜rewards.const.ts
 ┃ ┣ 📂enums
 ┃ ┃ ┣ 📜lostark.enum.ts
 ┃ ┃ ┣ 📜market-price.enum.ts
 ┃ ┃ ┗ 📜rewards.enum.ts
 ┃ ┣ 📂google-sheet (구글 스프레드 시트 연동)
 ┃ ┃ ┣ 📜google-sheet.module.ts
 ┃ ┃ ┗ 📜google-sheet.service.ts
 ┃ ┣ 📂lostark (로스트아크 API Wrapper)
 ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┣ 📜lostark-auction.interface.ts
 ┃ ┃ ┃ ┣ 📜lostark-market.interface.ts
 ┃ ┃ ┃ ┗ 📜lostark-notice.interface.ts
 ┃ ┃ ┣ 📜lostark.module.ts
 ┃ ┃ ┗ 📜lostark.service.ts
 ┃ ┣ 📂notice-informer (로스트아크 공지 알람봇)
 ┃ ┃ ┣ 📜notice-informer.module.ts
 ┃ ┃ ┗ 📜notice-informer.service.ts
 ┃ ┣ 📂users
 ┃ ┃ ┣ 📂schemas
 ┃ ┃ ┃ ┗ 📜user.schema.ts
 ┃ ┃ ┣ 📜users.module.ts
 ┃ ┃ ┗ 📜users.service.ts
 ┃ ┗ 📂utils
 ┃ ┃ ┣ 📜date.ts
 ┃ ┃ ┗ 📜time.ts
 ┣ 📂config
 ┃ ┗ 📜configuration.ts
 ┣ 📜app.module.ts
 ┗ 📜main.ts
```
# References
- [loa-stat-frontend](https://github.com/Wseop/loa-stat-frontend) : Front-End
- [Nest.JS](https://docs.nestjs.com/)
- [Necord](https://necord.org/) : A module for creating Discord bots using NestJS, based on Discord.js
- [LostarkAPI](https://developer-lostark.game.onstove.com/) : 로스트아크 OpenAPI
