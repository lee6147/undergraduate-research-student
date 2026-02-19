# Obsidian HTML/React Prompt

> JSX/TSX 파일을 Obsidian에서 실행 가능한 HTML로 변환하고 삽입하는 전체 워크플로우 문서입니다.
> 환경 구성 → 변환 → 삽입까지 하나의 문서에서 다룹니다.

---

## 목차

1. [환경 구성](#1-환경-구성)
2. [전체 워크플로우](#2-전체-워크플로우)
3. [JSX → HTML 변환 규칙](#3-jsx--html-변환-규칙)
4. [Obsidian 삽입 방법](#4-obsidian-삽입-방법)
5. [파일 크기별 권장 방식](#5-파일-크기별-권장-방식)
6. [오프라인 환경 대응](#6-오프라인-환경-대응)
7. [트러블슈팅](#7-트러블슈팅)
8. [Git 동기화](#8-git-동기화)
9. [부록: AI 변환 프롬프트 (PART A)](#9-부록-ai-변환-프롬프트-part-a)

---

## 1. 환경 구성

### 기본 정보

| 항목 | 경로 / 값 |
|------|-----------|
| Obsidian Vault | `C:\Users\user\Documents\Obsidian Vault\` |
| Custom Frames 설정 | `.obsidian/plugins/obsidian-custom-frames/data.json` |
| Git 원격 저장소 | `https://github.com/lee6147/obsidian-vault` (Private) |
| Git 플러그인 | `obsidian-git` (lee6147/obsidian-git 포크 빌드) |

### 설치된 플러그인

| 플러그인 | 용도 |
|----------|------|
| Custom Frames | HTML/React 앱을 WebView로 렌더링 (JS 실행 가능) |
| obsidian-git | Vault 자동 백업 & GitHub 동기화 |
| HTML Reader | 기본 HTML 뷰어 (JS 미지원) |

> **핵심**: HTML/React 앱 실행에는 **Custom Frames** 플러그인의 WebView가 필요합니다.
> HTML Reader는 JS를 지원하지 않으므로 React 앱에는 사용 불가합니다.

---

## 2. 전체 워크플로우

```
JSX/TSX 파일
     │
     ▼
[AI에게 변환 요청]  ← 9번 부록의 프롬프트 사용
     │
     ▼
변환된 .html 파일
     │
     ├─── [방법 A] Custom Frames WebView로 직접 열기  ← 권장
     │         └─ data.json에 file:/// URL 등록
     │
     └─── [방법 B] 노트 안에 iframe으로 삽입
               ├─ 파일 참조 방식 (100KB 이상)
               └─ base64 인라인 방식 (100KB 이하)
```

---

## 3. JSX → HTML 변환 규칙

### AI를 사용한 자동 변환 (권장)

9번 부록의 프롬프트를 AI에게 전달하고, 변환할 JSX/TSX 파일을 첨부해 요청합니다.
AI가 아래 규칙을 모두 적용하여 변환된 HTML 파일을 출력합니다.

### 수동 변환 핵심 규칙

**구문 변환:**

| 원본 | 변환 |
|------|------|
| `import { useState } from 'react'` | 삭제 (상단 const 선언으로 대체) |
| `import React from 'react'` | 삭제 |
| `export default function App()` | `function App()` |
| `export default App` | 삭제 |
| TypeScript 타입 어노테이션 (`: string`, `interface` 등) | 모두 제거 |

**HTML 래퍼 구조:**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>앱 이름</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { min-height: 100vh; }
    body { background: #030712; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    /* 정적 @keyframes만 여기에 선언 */
  </style>
  <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
  <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useMemo, useRef, useCallback } = React;

    /* 여기에 모든 컴포넌트 코드 */

    ReactDOM.render(React.createElement(App), document.getElementById("root"));
  </script>
</body>
</html>
```

> **참고**: CDN은 인터넷 연결이 필요합니다. 오프라인 대응은 [6번 섹션](#6-오프라인-환경-대응)을 참조하세요.

### 스타일링 규칙

- ❌ `className` 사용 금지 → 옵시디언 CSS와 충돌
- ❌ 외부 CSS 파일, Tailwind, Google Fonts 등 금지
- ✅ 인라인 `style={{}}` 사용
- ✅ 시스템 폰트 스택: `'-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif'`

### 색상 테마 객체

```javascript
const T = {
  bg: "#030712",
  bgSub: "#0a0e1a",
  card: "#0d1321",
  surface: "#1a2236",
  accent: "#6366f1",
  accentCyan: "#22d3ee",
  accentPink: "#e879f9",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#475569",
  border: "#1e293b",
  borderLight: "#334155",
};
```

---

## 4. Obsidian 삽입 방법

### 방법 A — Custom Frames WebView (권장, 모든 크기)

JS 실행이 완전히 지원됩니다. `.html` 파일이 Vault 밖에 있어도 됩니다.

**1. `data.json`에 항목 추가:**

```json
{
  "url": "file:///C:/Users/user/Documents/Obsidian Vault/apps/앱이름.html",
  "displayName": "표시 이름",
  "icon": "rocket",
  "hideOnMobile": true,
  "addRibbonIcon": true,
  "openInCenter": true,
  "zoomLevel": 1,
  "forceIframe": false,
  "customCss": "body { overflow-x: hidden; }",
  "customJs": ""
}
```

**핵심 설정:**
- `forceIframe: false` → WebView 사용 (JS 실행 가능)
- `padding: 0` → 잘림 방지

**2. Obsidian 재시작:**

```bash
taskkill //IM "Obsidian.exe" //F
start "" "obsidian://open?vault=Obsidian%20Vault"
```

**3. 실행:** `Ctrl + P` → 등록한 `displayName` 검색 → 열기

---

### 방법 B — 노트 안에 iframe 삽입

#### B-1. HTML 파일 직접 참조 (100KB 이상 권장)

`.html` 파일을 Vault 폴더에 저장하고, 노트에 아래를 삽입합니다:

```html
<div style="width:100%;height:800px;border-radius:12px;overflow:hidden;
     box-shadow:0 4px 12px rgba(0,0,0,0.2);">
  <iframe src="앱이름.html"
          style="width:100%;height:100%;border:none;"></iframe>
</div>
```

#### B-2. Base64 인라인 (약 100KB 이하 소형 파일)

**base64 인코딩 (터미널):**

```bash
# macOS
base64 -w 0 앱이름.html | pbcopy

# Linux
base64 -w 0 앱이름.html | xclip

# Windows
certutil -encode 앱이름.html tmp.b64 && type tmp.b64 | clip
```

**노트에 삽입:**

```html
<div style="width:100%;height:800px;border-radius:12px;overflow:hidden;
     box-shadow:0 4px 12px rgba(0,0,0,0.2);">
  <iframe src="data:text/html;base64,[여기에 붙여넣기]"
          style="width:100%;height:100%;border:none;"></iframe>
</div>
```

---

### file:/// URL 규칙

- 정방향 슬래시(`/`) 사용: `file:///C:/Users/user/Desktop/app.html`
- 공백은 `%20`으로 인코딩: `file:///C:/My%20Folder/app.html`
- Vault 안에 없어도 절대경로로 지정 가능

---

## 5. 파일 크기별 권장 방식

| 원본 JSX 크기 | 변환 HTML 예상 | 권장 삽입 방식 |
|---------------|---------------|---------------|
| ~100줄 | ~15KB | 방법 B-2 (base64 인라인) |
| 100~1000줄 | 15~150KB | 방법 B-1 (파일 참조) 또는 방법 A |
| 1000~3000줄 | 150~500KB | 방법 A (Custom Frames) 또는 B-1 |
| 3000줄 이상 | 500KB+ | 기능 분할 후 각각 변환 → 방법 A |

> **참고**: base64는 원본 대비 약 33% 크기 증가. 200KB HTML → 약 270KB base64.
> 옵시디언 내부 WebView의 data URI 제한이 낮을 수 있으므로 대형 파일은 방법 A를 사용하세요.

---

## 6. 오프라인 환경 대응

기본 변환 결과물은 React CDN에 의존하므로 인터넷 연결이 필요합니다.

### 옵션 1: CDN 파일 로컬 저장

다음 파일을 다운로드하여 Vault 내 `assets/` 폴더에 저장합니다:
- `react.production.min.js`
- `react-dom.production.min.js`
- `babel.min.js`

그리고 HTML의 `script src`를 상대 경로로 변경합니다.

### 옵션 2: Vanilla JS 변환 요청

AI에게 변환 요청 시, 9번 부록 프롬프트의 ① 아키텍처 부분을 아래로 교체합니다:

> "React CDN을 사용하지 말고, 모든 useState를 순수 자바스크립트 이벤트 리스너와 DOM 조작으로 변환해."

⚠️ 복잡한 컴포넌트는 변환 오류율이 높아질 수 있습니다.

---

## 7. 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| iframe 빈 화면 (흰색) | CDN 로드 실패 | 인터넷 연결 확인 / 오프라인 옵션 적용 |
| iframe 빈 화면 (검정) | JS 에러 | 브라우저 개발자 도구(F12)로 콘솔 에러 확인 |
| 스타일 깨짐 | `className` 잔존 | HTML에서 `className` 검색 후 인라인으로 교체 |
| 한글 깨짐 | 인코딩 문제 | `meta charset="UTF-8"` 확인 |
| base64 삽입 후 안 보임 | 인코딩 불완전 | 방법 A 또는 B-1(파일 참조)로 전환 |
| 클릭/탭 안 됨 | sandbox 속성 | iframe에 `sandbox` 속성이 있으면 제거 |
| 스크롤 안 됨 | 높이 부족 | iframe `height` 값 증가 (800px → 1200px) |
| 애니메이션 끊김 | 과다 파티클 | 파티클 수 줄이기 (25개 → 12개) |
| 수식 렌더링 안 됨 | KaTeX 의존 | 유니코드 수학 기호로 교체 (Δ, ℏ, ≥ 등) |

---

## 8. Git 동기화

| 방식 | 방법 |
|------|------|
| 자동 | obsidian-git 플러그인 설정에서 자동 백업 간격 지정 |
| 수동 | `Ctrl + P` → `Git: Commit-and-sync` |
| 원격 | https://github.com/lee6147/obsidian-vault |

---

## 9. 부록: AI 변환 프롬프트 (PART A)

아래 내용을 AI 대화의 첫 메시지로 붙여넣고, 변환할 JSX/TSX 파일을 첨부한 뒤 "이 파일을 변환해줘"라고 요청합니다.

---

### [프롬프트 시작]

#### Role
너는 Senior 프론트엔드 엔지니어이자 학술적 시각화 전문가야.

#### Mission
첨부된 JSX(또는 TSX) 파일의 모든 기능·디자인·애니메이션을 유지하면서, 옵시디언(Obsidian) 노트에 삽입 가능한 Self-contained HTML 파일 하나로 변환해.

#### 출력 규칙
- 변환 결과는 완성된 HTML 파일 하나를 그대로 출력해.
- base64 인코딩은 하지 마.
- 코드 외의 설명은 최소화하고, 변환 중 판단이 필요했던 부분만 간략히 메모해.

---

#### ① 아키텍처 (필수 준수)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[앱 제목]</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { min-height: 100vh; }
  body { background: #030712; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  /* 정적 @keyframes만 여기에 선언 */
</style>
</head>
<body>
<div id="root"></div>
<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ═══ 여기에 모든 컴포넌트 코드 ═══ */

ReactDOM.render(React.createElement(App), document.getElementById("root"));
</script>
</body>
</html>
```

---

#### ② 구문 변환 규칙

**import 변환표:**

| 원본 | 변환 |
|------|------|
| `import { useState, useEffect } from 'react'` | 삭제 |
| `import React from 'react'` | 삭제 |
| `import { LineChart } from 'recharts'` | ③ 라이브러리 표 참조 |
| `import { Camera } from 'lucide-react'` | 이모지 또는 인라인 SVG로 교체 |
| `import { motion } from 'framer-motion'` | CSS @keyframes + transition |
| `import styles from './App.module.css'` | 인라인 `style={{}}` |
| `import './globals.css'` | head style로 이식 |
| `import image from './image.png'` | SVG 또는 CSS gradient |

**export 변환표:**

| 원본 | 변환 |
|------|------|
| `export default function App()` | `function App()` |
| `export function Component()` | `function Component()` |
| `export const value = ...` | `const value = ...` |
| `export default App` | 삭제 |

**TypeScript 처리:** 모든 타입 어노테이션(`: string`, `interface`, `type`, `<T>`, `as`) 제거

---

#### ③ 외부 라이브러리 대응표

| 라이브러리 | 처리 방법 |
|------------|-----------|
| recharts / chart.js | SVG로 직접 구현 |
| d3 | 핵심 연산만 순수 JS로 이식, DOM 조작은 React로 |
| lucide-react / heroicons | 이모지 또는 인라인 SVG |
| framer-motion | CSS @keyframes + transition |
| react-router / react-router-dom | useState 기반 탭 네비게이션 |
| zustand / redux | useState/useReducer로 병합 |
| tailwindcss | 인라인 `style={{}}` 1:1 변환 |
| shadcn/ui / @radix-ui | 순수 JSX+인라인 스타일로 재작성 |
| clsx / classnames | 삭제, 조건부 style 객체로 교체 |
| axios | 삭제 (네트워크 요청 불가 환경) |
| next/image | SVG 또는 CSS로 교체 |
| next/link | `button onClick`으로 교체 |
| katex | HTML+CSS로 수식 직접 렌더 또는 유니코드 기호 |

처리 방법이 불확실한 라이브러리는 변환하지 말고 주석으로 표시한 뒤 질문할 것.

---

#### ④ 색상 시스템

```javascript
const T = {
  bg: "#030712", bgSub: "#0a0e1a", card: "#0d1321", cardHover: "#131b2e",
  surface: "#1a2236", accent: "#6366f1", accentCyan: "#22d3ee", accentPink: "#e879f9",
  text: "#e2e8f0", textDim: "#94a3b8", textMuted: "#475569",
  border: "#1e293b", borderLight: "#334155", glow: "#6366f1",
};
```

- CSS 변수(`var(--background-primary)`) 사용 금지 — iframe 내부에서 접근 불가
- 반투명: `${color}15` (~8%), `${color}30` (~19%), `${color}80` (~50%)

---

#### ⑤ 스타일링 규칙

- ❌ `className` 사용 금지
- ❌ 외부 CSS 파일, Tailwind, Google Fonts 금지
- ✅ 인라인 `style={{}}`
- ✅ 시스템 폰트: `'-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif'`
- ✅ 모노 폰트: `'"SF Mono", "Fira Code", "Consolas", monospace'`

---

#### ⑥ 애니메이션 이식

**@keyframes 선언 위치:**
- 동적 값 없는 정적 → `head` 내 `style` 태그
- 동적 값 포함(`${size}`, `${color}`) → 해당 컴포넌트의 `return` 내부 `style` 태그

**안정적 의사 랜덤 (Math.random() 대신):**

```javascript
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}
```

**애니메이션 누락 체크 키워드:** `@keyframes`, `animation:`, `transition:`, `transform`, `animate`, `animateTransform`

---

#### ⑦ SVG 인라인 규칙

- `viewBox` 반드시 명시
- `width="100%"` 또는 고정 px
- SMIL 애니메이션(`animate`, `animateTransform`) 사용 가능
- 차트/프로파일 등 수학 함수 기반 SVG는 순수 JS로 좌표 계산 후 `polyline`/`polygon`으로 렌더

---

#### ⑧ 변환 절차

**Step 1: 소스 분석**
- 모든 React 훅 목록
- 컴포넌트 트리
- 외부 의존성 전체 목록
- @keyframes 전체 수집
- SVG 컴포넌트 식별

**Step 2: 의존성 제거 및 변환**

**Step 3: 단일 파일 조립**

**Step 4: 자기 검증 체크리스트**
- [ ] 모든 import 제거/변환
- [ ] 모든 export 제거
- [ ] `className` 없음
- [ ] 모든 useState/useEffect 보존
- [ ] 모든 @keyframes 이식
- [ ] 모든 SVG 인라인 포함
- [ ] 외부 이미지/폰트 참조 없음
- [ ] `Math.random()` → `seededRandom()` 교체
- [ ] TypeScript 타입 어노테이션 모두 제거
- [ ] `ReactDOM.render(...)` 마지막에 있음

---

#### ⑨ 금지 사항

1. `className` 사용 금지
2. `window.localStorage` / `sessionStorage` 사용 금지
3. `fetch()` / `XMLHttpRequest` 데이터 API 호출 금지
4. 외부 이미지(`img src="http..."`) 금지
5. `window.open` / `window.location` 변경 금지
6. `console.log` 남발 금지
7. 파일 상단에 원본 파일명과 변환 일시를 주석으로 기록

### [프롬프트 끝]

---

## 버전 이력

| 버전 | 주요 변경 |
|------|-----------|
| v1 (문서 2) | 초기 환경 구성 + Custom Frames 등록 절차 |
| v2 (문서 1 v1~v2) | AI 변환 프롬프트 초안 — Vanilla JS 기반 → React CDN 유지 전략으로 전환 |
| v3 (통합) | 두 문서 합병 — 환경 구성~변환~삽입 전체 워크플로우 단일 문서화. import/export 변환 규칙, 라이브러리 대응표, 오프라인 대응, 트러블슈팅 통합. |
