# loa-stat
- 로스트아크 컨텐츠 및 캐릭터 세팅 현황 등을 제공하기 위해 만든 API
- ~~[Loa-Stat](http://34.64.181.235:8942/)~~
- ~~[Loa-Stat API](http://34.64.181.235:7942/api)~~
## Tech Stack
<img src="https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"><img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"><img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"><img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
## File Tree
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
## References
- [loa-stat-frontend](https://github.com/Wseop/loa-stat-frontend) : Front-End
- [Nest.JS](https://docs.nestjs.com/)
- [Necord](https://necord.org/) : A module for creating Discord bots using NestJS, based on Discord.js
- [LostarkAPI](https://developer-lostark.game.onstove.com/) : 로스트아크 OpenAPI
