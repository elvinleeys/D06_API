# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 이 폴더는

수업(D6: 무료 API로 나만의 서비스 만들기) 실습 폴더다. 빌드·린트·테스트 도구가 없고 git 저장소도 아니다.

- `D06_1021.html` — D6 워크북(수업 자료). 과제 문구와 커밋 메시지 형식(`"[직군] D6: …"`)이 여기서 나온다.
- `d6-api/` — 실습 결과물. 화면 하나당 HTML 파일 하나(`weather`, `rate`, `city`, `morning`).
- `.claude/rules/api.md` — API 화면 규칙. **API 화면을 만들거나 고칠 때 반드시 따른다.** "실수에서 배운 규칙" 절은 AI 실수를 찾을 때마다 한 줄씩 채우는 칸이다.
- `.claude/skills/api-check` — `/api-check @파일` 로 위 규칙을 검사만 한다(고치지 않고 표로 보고).

## 실행

빌드 없음. HTML 파일을 더블클릭해서 브라우저로 연다. 파일 하나에 CSS와 JS를 함께 넣고, 외부 파일·서버·설치에 의존하지 않는다.

## 쓰는 API (모두 키 없음)

- Open-Meteo: 날씨(`api.open-meteo.com`), 지오코딩(`geocoding-api.open-meteo.com`), 대기질(`air-quality-api.open-meteo.com`, `pm10`·`pm2_5`)
- Frankfurter: `api.frankfurter.dev/v1/latest` — 유럽중앙은행 기준 환율, 하루 한 번 발표. 화면에 "실시간"이라고 쓰지 않고 `date`를 기준 날짜로 보여 준다.
- Nager.Date: `date.nager.at/api/v3/NextPublicHolidays/KR`
- Dog CEO: `dog.ceo/api/breeds/image/random`

키가 필요한 API는 만들지 말고 "D8 방식이 필요해요"라고 알려 준다.

## 화면 파일의 공통 구조 (여러 파일을 읽어야 보이는 것)

- 주소는 `<script>` 맨 위 `const API = {…}` 한 곳에 모으고 줄마다 `// 🔌`, `fetch` 줄에는 `// 🔌 API 호출`을 단다.
- 맨 아래 "🔌 이 화면이 쓰는 API" 상자에 실제로 부른 주소와 원본 JSON 링크를 JS로 채운다.
- 카드마다 따로 `fetch`하고 각자 try/catch + `r.ok` 검사로 로딩 문구·실패 문구를 갖는다. 한 카드가 실패해도 다른 카드는 보여야 한다. (`morning.html`의 `load()` 참고)
- 미세먼지 등급은 환경부 기준(㎍/㎥, 넘으면 한 단계 위): PM10 30/80/150, PM2.5 15/35/75. `city.html`과 `morning.html`에 같은 표가 복사돼 있으니 고치면 둘 다 고친다.
- 커밋·푸시는 하지 말고 메시지만 제안한다.
