# loa-stat
- 로스트아크 컨텐츠 및 캐릭터 세팅 현황 등을 제공하기 위해 만든 API
## Tech Stack
<img src="https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"><img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"><img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"><img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
## API Specification
- [Loa-Stat API](http://34.64.181.235:7942/api)
## File Tree
```bash
📦src
 ┣ 📂character ------------------------------------- 로스트아크 캐릭터 DB 관리
 ┃ ┣ 📂classes
 ┃ ┃ ┣ 📜character-classengravings.class.ts
 ┃ ┃ ┣ 📜character-servers.class.ts
 ┃ ┃ ┣ 📜character-settings.class.ts
 ┃ ┃ ┗ 📜character-skills.class.ts
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜character-classengravings.dto.ts
 ┃ ┃ ┣ 📜character-query.dto.ts
 ┃ ┃ ┣ 📜character-servers.dto.ts
 ┃ ┃ ┣ 📜character-settings.dto.ts
 ┃ ┃ ┣ 📜character-skills.dto.ts
 ┃ ┃ ┗ 📜character.dto.ts
 ┃ ┣ 📂functions
 ┃ ┃ ┗ 📜character.functions.ts
 ┃ ┣ 📂schemas
 ┃ ┃ ┗ 📜character.schema.ts
 ┃ ┣ 📜character.controller.ts
 ┃ ┣ 📜character.module.ts
 ┃ ┗ 📜character.service.ts
 ┣ 📂google-sheet ---------------------------------- 구글 스프레드 시트 연동 (GoogleSheet API 사용)
 ┃ ┣ 📂consts
 ┃ ┃ ┗ 📜sheet.const.ts
 ┃ ┣ 📜google-sheet.module.ts
 ┃ ┗ 📜google-sheet.service.ts
 ┣ 📂lostark --------------------------------------- 로스트아크 API Wrapper (API key 관리 등)
 ┃ ┣ 📂consts
 ┃ ┃ ┣ 📜class.const.ts
 ┃ ┃ ┣ 📜engraving.const.ts
 ┃ ┃ ┣ 📜equipment.const.ts
 ┃ ┃ ┗ 📜server.const.ts
 ┃ ┣ 📂enums
 ┃ ┃ ┣ 📜auction.enum.ts
 ┃ ┃ ┗ 📜market.enum.ts
 ┃ ┣ 📂interfaces
 ┃ ┃ ┣ 📜lostark-auction.interface.ts
 ┃ ┃ ┣ 📜lostark-market.interface.ts
 ┃ ┃ ┗ 📜lostark-notice.interface.ts
 ┃ ┣ 📜lostark.module.ts
 ┃ ┗ 📜lostark.service.ts
 ┣ 📂market-price ---------------------------------- 아이템 시세 관리
 ┃ ┣ 📂consts
 ┃ ┃ ┗ 📜market-price.const.ts
 ┃ ┣ 📂dtos
 ┃ ┃ ┗ 📜item-price.dto.ts
 ┃ ┣ 📂enums
 ┃ ┃ ┗ 📜market-price.enum.ts
 ┃ ┣ 📂interfaces
 ┃ ┃ ┗ 📜item-price.interface.ts
 ┃ ┣ 📜market-price.controller.ts
 ┃ ┣ 📜market-price.module.ts
 ┃ ┗ 📜market-price.service.ts
 ┣ 📂rewards --------------------------------------- 컨텐츠 보상 관리
 ┃ ┣ 📂classes
 ┃ ┃ ┗ 📜reward.class.ts
 ┃ ┣ 📂consts
 ┃ ┃ ┗ 📜rewards.const.ts
 ┃ ┣ 📂dtos
 ┃ ┃ ┗ 📜reward.dto.ts
 ┃ ┣ 📂enums
 ┃ ┃ ┗ 📜rewards.enum.ts
 ┃ ┣ 📜rewards.controller.ts
 ┃ ┣ 📜rewards.module.ts
 ┃ ┗ 📜rewards.service.ts
 ┣ 📂utils
 ┃ ┗ 📜date.ts
 ┣ 📂workers --------------------------------------- 원활한 서비스 제공을 위해 주기적으로 실행되는 모듈들
 ┃ ┣ 📂cache-warmer -------------------------------- Redis cache warming
 ┃ ┃ ┣ 📜cache-warmer.module.ts
 ┃ ┃ ┗ 📜cache-warmer.service.ts
 ┃ ┣ 📂character-update ---------------------------- Character database의 데이터를 주기적으로 갱신
 ┃ ┃ ┣ 📜character-update.module.ts
 ┃ ┃ ┗ 📜character-update.service.ts
 ┃ ┣ 📂item-price ---------------------------------- MarketPriceModule의 아이템 가격을 주기적으로 갱신
 ┃ ┃ ┣ 📜item-price.module.ts
 ┃ ┃ ┗ 📜item-price.service.ts
 ┃ ┣ 📂notice-informer ----------------------------- 로스트아크 신규 공지 등록시 디스코드 채널로 알림 (Necord 모듈 사용)
 ┃ ┃ ┣ 📜notice-inform.module.ts
 ┃ ┃ ┗ 📜notice-inform.service.ts
 ┃ ┗ 📜workers.module.ts
 ┣ 📜app.module.ts
 ┗ 📜main.ts
```
## References
- [Nest.JS](https://docs.nestjs.com/)
- [Necord](https://necord.org/) : A module for creating Discord bots using NestJS, based on Discord.js
- [LostarkAPI](https://developer-lostark.game.onstove.com/) : 로스트아크 OpenAPI
