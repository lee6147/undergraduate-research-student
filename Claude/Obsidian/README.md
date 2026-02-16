<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,100:38bdf8&height=250&section=header&text=Obsidian%20%C3%97%20React%20HTML&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Obsidian%EC%97%90%EC%84%9C%20React%20HTML%20%EC%95%B1%EC%9D%84%20%EC%8B%A4%ED%96%89%ED%95%98%EB%8A%94%20%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8%20%26%20%EA%B0%80%EC%9D%B4%EB%93%9C&descSize=16&descAlignY=55" width="100%" />

<br/>

[![Obsidian](https://img.shields.io/badge/Obsidian-7C3AED?style=for-the-badge&logo=obsidian&logoColor=white)](https://obsidian.md)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Custom Frames](https://img.shields.io/badge/Custom_Frames-6366f1?style=for-the-badge&logo=windowsterminal&logoColor=white)](https://github.com/Ellpeck/ObsidianCustomFrames)
[![Claude](https://img.shields.io/badge/Claude-cc785c?style=for-the-badge&logo=anthropic&logoColor=white)](https://claude.ai)

<br/>

**React + Babel + CDN 기반 HTML 앱을 Obsidian 노트 안에서 그대로 실행하는 방법**

이 문서는 **바로 복사해서 쓸 수 있는 프롬프트**와, 원리를 이해하기 위한 **과정 설명**으로 구성되어 있습니다.

<br/>

### 🧭 목차

| 섹션 | 내용 |
|:---:|:---|
| [**⚡ Quick Start**](#-quick-start) | 30초 안에 시작하기 |
| [**Part 1 — 프롬프트**](#-part-1--프롬프트) | Claude에게 복사-붙여넣기로 바로 실행시킬 수 있는 프롬프트 |
| [**Part 2 — 과정 이해**](#-part-2--과정-이해) | 왜 이렇게 해야 하는지, 각 단계가 무엇을 하는지 설명 |

</div>

<br/>

---

<br/>

<div align="center">

## ⚡ Quick Start

</div>

```
1️⃣  Obsidian에서 Custom Frames 커뮤니티 플러그인 설치 & 활성화
2️⃣  아래 프롬프트 중 하나를 골라 Claude에게 붙여넣기
3️⃣  끝! Obsidian이 재시작되면 노트에서 HTML 앱이 실행됩니다.
```

### 🤔 어떤 프롬프트를 써야 하나요?

```
HTML 파일이 몇 개인가요?
│
├── 1개 ─── 기존에 Custom Frames를 쓰고 있나요?
│            ├── 아니오 → 프롬프트 A (기본)
│            └── 예    → 프롬프트 C (기존 설정에 추가)
│
├── 여러 개 ──────────→ 프롬프트 B (일괄 등록)
│
└── 경로 입력이 귀찮다 → 프롬프트 D (자동 탐지)
```

> **전제 조건:** Obsidian **데스크톱 앱** (Windows / macOS / Linux). 모바일에서는 Custom Frames의 WebView가 지원되지 않습니다.

<br/>

---

<br/>

<div align="center">

# 📋 Part 1 — 프롬프트

**아래 프롬프트를 Claude에게 그대로 복사-붙여넣기 하면 자동으로 설정됩니다.**

Custom Frames 플러그인만 미리 설치하면 됩니다.

</div>

<br/>

---

### 🔹 프롬프트 A — 기본 (HTML 파일 1개)

> 가장 일반적인 경우. HTML 파일 하나를 Obsidian에서 열고 싶을 때.

```
나는 Obsidian에서 JavaScript가 포함된 HTML 파일을 렌더링하고 싶어.
이 HTML은 React + Babel + 외부 CDN을 사용하기 때문에 HTML Reader 플러그인으로는 안 돼.
Custom Frames 플러그인은 이미 설치했어.

아래 작업을 순서대로 실행해줘:

1. HTML 파일을 Obsidian Vault의 HTML/ 폴더로 복사
2. Custom Frames 플러그인 설정 파일(data.json) 생성
3. 마크다운 임베드 노트(.md) 생성
4. Obsidian 재시작

[필수 정보]
- HTML 파일 경로: (여기에 입력)
- Obsidian Vault 경로: (여기에 입력)
- 표시할 이름: (여기에 입력)

[data.json 규칙]
- 위치: {Vault}/.obsidian/plugins/obsidian-custom-frames/data.json
- url 형식: file:/// + 절대경로 (역슬래시가 아닌 정방향 슬래시 / 사용)
- forceIframe: 반드시 false (Electron WebView 사용해야 JS 실행 가능)
- padding: 0 (frames 배열 바깥, 최상위 속성. 우측 잘림 방지)
- customCss: "body { overflow-x: hidden; }" (가로 스크롤 방지)

[마크다운 노트 규칙]
- custom-frames 코드블록 사용
- frame: 값은 data.json의 displayName과 정확히 일치
- style: height: 800px; width: 100%; overflow: hidden;

[재시작 방법]
- Windows: taskkill //IM "Obsidian.exe" //F 후 obsidian:// URI로 재실행
- macOS: osascript -e 'quit app "Obsidian"' 후 open -a Obsidian
- Linux: pkill -f obsidian 후 obsidian &
- 또는 사용자에게 수동 재시작 안내
```

<br/>

---

### 🔹 프롬프트 B — 여러 HTML 파일 한번에

> HTML 파일이 여러 개일 때. 폴더째 등록하고 싶을 때.

```
Obsidian에서 여러 개의 JavaScript HTML 파일을 Custom Frames로 임베드하고 싶어.
Custom Frames 플러그인은 이미 설치했어.

아래 HTML 파일들을 모두 등록해줘:

1. (파일경로1) → 표시이름: (이름1)
2. (파일경로2) → 표시이름: (이름2)
3. (파일경로3) → 표시이름: (이름3)

Obsidian Vault 경로: (여기에 입력)

[작업 내용]
- 각 HTML 파일을 Vault/HTML/ 폴더로 복사
- data.json의 frames 배열에 모든 파일을 등록
  - forceIframe: false / padding: 0 (최상위 속성) / customCss: "body { overflow-x: hidden; }"
- 각 파일마다 별도의 .md 임베드 노트 생성
- Obsidian 재시작
```

<br/>

---

### 🔹 프롬프트 C — 기존 data.json에 추가

> 이미 Custom Frames에 다른 프레임이 등록되어 있을 때. 기존 설정을 유지하면서 추가.

```
Obsidian Custom Frames에 새 HTML 파일을 추가하고 싶어.
이미 다른 프레임이 등록되어 있으니 기존 data.json을 읽어서 frames 배열에 추가해줘.
절대 기존 프레임을 덮어쓰지 마.

[추가할 파일]
- HTML 파일 경로: (여기에 입력)
- 표시할 이름: (여기에 입력)
- Obsidian Vault 경로: (여기에 입력)

[작업 순서]
1. 기존 data.json 읽기
2. frames 배열에 새 프레임 객체 추가 (forceIframe: false)
3. 최상위 속성 padding이 0인지 확인, 없으면 추가
4. HTML 파일을 Vault/HTML/로 복사
5. .md 임베드 노트 생성
6. Obsidian 재시작
```

<br/>

---

### 🔹 프롬프트 D — 완전 자동 (경로 자동 탐지)

> 경로를 직접 입력하기 귀찮을 때. Claude가 알아서 찾게 하는 버전.

> ⚠️ **주의:** 이 프롬프트는 Claude가 로컬 파일 시스템에 접근할 수 있는 환경(Claude Desktop + MCP, Claude Code 등)에서만 작동합니다. 웹 기반 Claude(claude.ai)에서는 경로 자동 탐지가 불가능하므로 프롬프트 A~C를 사용하세요.

```
내 컴퓨터에서 Obsidian Vault 경로와 Custom Frames 플러그인 설치 여부를 자동으로 확인해줘.

그 다음, 아래 HTML 파일을 Custom Frames로 Obsidian에 임베드해줘:
- HTML 파일: (여기에 경로만 입력)
- 표시할 이름: (여기에 입력)

[자동 확인 사항]
1. Obsidian Vault 위치 탐지 (일반적인 경로 확인)
   - Windows: ~/Documents/Obsidian Vault, ~/OneDrive/Obsidian Vault 등
   - macOS: ~/Documents/Obsidian Vault, ~/Library/Mobile Documents 등
   - Linux: ~/Documents/Obsidian Vault, ~/obsidian-vault 등
2. .obsidian/plugins/obsidian-custom-frames/ 디렉토리 존재 여부 확인
3. 기존 data.json이 있으면 읽어서 추가, 없으면 새로 생성
4. 설정 규칙: forceIframe: false / padding: 0 / customCss: "body { overflow-x: hidden; }"
5. 마크다운 노트 생성 후 Obsidian 재시작
```

<br/>

---

<br/>

<div align="center">

# 📖 Part 2 — 과정 이해

**프롬프트 뒤에서 무슨 일이 일어나는지 알고 싶다면 여기를 읽으세요.**

</div>

<br/>

---

## 1. 왜 Obsidian에서 React HTML이 안 열리는가?

Obsidian은 보안을 위해 HTML 내부의 JavaScript 실행을 차단한다.

```
HTML 파일이 브라우저에서 실행되는 과정:

  HTML 로드 → <script> 태그 발견 → CDN에서 React 다운로드 → Babel이 JSX 변환 → 화면 렌더링
  ────────   ─────────────────   ──────────────────────   ─────────────────   ──────────────
  ✅ 가능      ❌ Obsidian 차단      ❌ 외부 접근 차단          ❌ JS 실행 불가       ❌ 빈 화면
```

| 시도한 방법 | 결과 | 이유 |
|:---|:---:|:---|
| HTML Reader 플러그인 | ❌ | CSP 정책으로 외부 스크립트 차단 |
| `![[file.html]]` 임베드 | ❌ | Obsidian 자체가 스크립트 태그 무시 |
| HTML Reader Unrestricted Mode | ❌ | 단순 JS는 되지만 React+Babel+CDN 조합은 실패 |

<br/>

---

## 2. Custom Frames가 해결하는 방법

**Custom Frames** 플러그인은 Obsidian 내부에 **Electron WebView**(= 진짜 브라우저)를 삽입한다.

```
┌─ Obsidian ─────────────────────────────────────────┐
│                                                     │
│  📝 일반 노트 영역 (마크다운 렌더링)                   │
│                                                     │
│  ┌─ Custom Frames ───────────────────────────────┐  │
│  │                                               │  │
│  │  🌐 Electron WebView (= Chrome 브라우저)       │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  file:///로 로컬 HTML 파일 로드           │  │  │
│  │  │  → CDN 스크립트 정상 다운로드 ✅           │  │  │
│  │  │  → React/Babel 정상 실행 ✅               │  │  │
│  │  │  → 완전한 인터랙티브 앱 렌더링 ✅          │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

> **핵심 원리:** Obsidian의 보안 제한을 우회하는 것이 아니라, 보안 제한이 없는 **별도의 브라우저 창**을 노트 안에 삽입하는 것이다.

<br/>

---

## 3. 실행되는 전체 과정 (Step by Step)

### Step 1 — 사전 준비

```
사용자가 직접 해야 하는 유일한 단계:

Obsidian → 설정(⚙️) → 커뮤니티 플러그인 → "Custom Frames" 검색 → 설치 → 활성화
```

> 이후의 모든 단계는 Claude가 자동으로 처리한다.

<br/>

### Step 2 — 파일 배치

Claude가 HTML 파일을 Vault 내부로 복사한다.

```
📁 Your Obsidian Vault/
│
├── 📁 HTML/                          ← Claude가 생성
│   └── 📄 YourApp.html              ← Claude가 복사
│
├── 📄 Your App.md                    ← Claude가 생성 (Step 4)
│
└── 📁 .obsidian/
    └── 📁 plugins/
        └── 📁 obsidian-custom-frames/
            ├── 📄 main.js            ← 플러그인 파일 (건드리지 않음)
            ├── 📄 manifest.json      ← 플러그인 파일 (건드리지 않음)
            └── 📄 data.json          ← Claude가 생성/수정 (Step 3)
```

> **왜 Vault 안에 복사하는가?**  `file:///` 프로토콜로 접근할 수 있으면 어디든 상관없지만, Vault 안에 두면 관리가 편하고 Git으로 함께 추적할 수 있다.

<br/>

### Step 3 — data.json 프레임 설정

Custom Frames 플러그인이 어떤 URL을 어떤 이름으로 열지 정의하는 파일이다.

```json
{
    "frames": [
        {
            "url": "file:///C:/Users/사용자명/Documents/Vault/HTML/YourApp.html",
            "displayName": "Your App Name",
            "icon": "box",
            "hideOnMobile": true,
            "addRibbonIcon": true,
            "openInCenter": true,
            "zoomLevel": 1,
            "forceIframe": false,
            "customCss": "body { overflow-x: hidden; }",
            "customJs": ""
        }
    ],
    "padding": 0
}
```

> ⚠️ **`padding`은 `frames` 배열 바깥의 최상위 속성이다.** 개별 프레임 객체 안이 아니라 JSON 루트에 위치해야 한다.

각 필드의 의미:

| 필드 | 값 | 왜 이 값인가? |
|:---|:---|:---|
| `url` | `file:///C:/...` | 로컬 파일을 브라우저가 열 수 있는 URI 형식. **슬래시 3개**, **정방향 슬래시만 사용** |
| `displayName` | `"Your App Name"` | 마크다운에서 이 이름으로 참조. **코드블록의 `frame:` 값과 글자 하나까지 일치해야 함** |
| `forceIframe` | `false` | `true`면 제한된 iframe 사용, `false`면 **Electron WebView** 사용. **반드시 false** |
| `customCss` | `"body { overflow-x: hidden; }"` | 우측 콘텐츠 잘림 방지 |
| `padding` | `0` | 프레임 주변 여백 제거. 기본값 5는 콘텐츠를 잘리게 만듦 |

<details>
<summary>🖥️ <b>OS별 URL 경로 형식</b></summary>
<br/>

| OS | URL 형식 | 예시 |
|:---|:---|:---|
| **Windows** | `file:///C:/Users/...` | `file:///C:/Users/Kim/Documents/Vault/HTML/App.html` |
| **macOS** | `file:///Users/...` | `file:///Users/kim/Documents/Vault/HTML/App.html` |
| **Linux** | `file:///home/...` | `file:///home/kim/Documents/Vault/HTML/App.html` |

공통 규칙: 반드시 **정방향 슬래시(`/`)**만 사용. Windows에서도 역슬래시(`\`)를 쓰면 안 된다.

> 경로에 공백이 포함된 경우(예: `Obsidian Vault`) 대부분 그대로 사용 가능하지만, 문제가 생기면 공백을 `%20`으로 치환해볼 것.

</details>

<br/>

### Step 4 — 마크다운 노트 생성

Obsidian 노트 안에 Custom Frames 코드블록을 넣으면 그 자리에 WebView가 렌더링된다.

````markdown
# Your App Name

```custom-frames
frame: Your App Name
style: height: 800px; width: 100%; overflow: hidden;
```
````

**연결 구조:**

```
마크다운 코드블록                   data.json
─────────────────                 ─────────────
frame: Your App Name  ═══════>   "displayName": "Your App Name"
                                         │
                                         ▼
                                 "url": "file:///C:/...html"
                                         │
                                         ▼
                                 Electron WebView가 HTML 로드
```

> `frame:` 값과 `displayName`이 정확히 일치하지 않으면 `"Couldn't find a frame with name ..."` 에러가 발생한다.

<br/>

### Step 5 — Obsidian 재시작

```
⚠️  가장 많이 놓치는 단계

Custom Frames는 Obsidian 시작 시 data.json을 한 번만 읽는다.
data.json을 수정한 후에는 반드시 Obsidian을 완전히 종료하고 다시 열어야 한다.

  수정 후 그냥 노트 전환 → ❌ 반영 안 됨
  수정 후 Ctrl+R 새로고침 → ❌ 반영 안 됨
  수정 후 완전 종료 → 재시작 → ✅ 반영됨
```

<details>
<summary>🖥️ <b>OS별 재시작 명령어 (Claude 자동 실행용)</b></summary>
<br/>

| OS | 종료 명령 | 재실행 명령 |
|:---|:---|:---|
| **Windows** | `taskkill //IM "Obsidian.exe" //F` | `start obsidian://` |
| **macOS** | `osascript -e 'quit app "Obsidian"'` | `open -a Obsidian` |
| **Linux** | `pkill -f obsidian` | `obsidian &` |

</details>

<br/>

---

## 4. 트러블슈팅

<details>
<summary>🔴 <b>"Couldn't find a frame with name ..." 에러</b></summary>
<br/>

| 순서 | 확인 |
|:---:|:---|
| 1 | `data.json` 파일이 `.obsidian/plugins/obsidian-custom-frames/` 안에 있는가? |
| 2 | `displayName` 값과 코드블록의 `frame:` 값이 **완전히 동일**한가? (공백, 대소문자 포함) |
| 3 | Obsidian을 **완전히 종료 후 재시작**했는가? |
| 4 | Custom Frames 플러그인이 **활성화** 상태인가? |

> **가장 흔한 원인:** data.json을 만든 후 Obsidian을 재시작하지 않음. 플러그인은 시작 시에만 설정을 로드한다.

</details>

<details>
<summary>⚪ <b>빈 화면 / 로딩만 되는 경우</b></summary>
<br/>

| 순서 | 확인 |
|:---:|:---|
| 1 | `forceIframe`이 `false`인지 확인 — `true`면 보안 제한된 iframe을 사용해서 로컬 JS가 안 됨 |
| 2 | URL 경로에 역슬래시(`\`) 대신 정방향 슬래시(`/`)를 사용했는지 확인 |
| 3 | HTML 파일이 해당 경로에 실제로 존재하는지 확인 |
| 4 | 인터넷 연결 확인 — CDN에서 React/Babel을 다운로드해야 함 |

</details>

<details>
<summary>📐 <b>우측이 잘리는 경우</b></summary>
<br/>

data.json에서:
- `padding`을 `0`으로 설정 (최상위 속성)
- `customCss`를 `"body { overflow-x: hidden; }"`로 설정

마크다운 코드블록에서:
- `style: height: 800px; width: 100%; overflow: hidden;`

</details>

<details>
<summary>👁️ <b>Reading View에서만 동작하나요?</b></summary>
<br/>

Custom Frames 코드블록은 **Reading View** (Ctrl+E)와 **Live Preview** 모드에서 렌더링됩니다.
Source Mode에서는 코드블록 텍스트만 보입니다.

</details>

<details>
<summary>🔧 <b>data.json의 JSON 문법 오류</b></summary>
<br/>

data.json이 올바른 JSON이 아니면 Custom Frames가 아예 로드되지 않는다. 흔한 실수:

| 실수 | 예시 |
|:---|:---|
| 마지막 쉼표 | `..."customJs": "" } , ]` ← 배열 마지막 객체 `}` 뒤에 쉼표 불필요 |
| 경로 역슬래시 | `"url": "file:///C:\Users\..."` ← JSON에서 `\`는 이스케이프 문자 |
| 따옴표 누락 | `forceIframe: false` ← JSON 키는 반드시 `"forceIframe"` |

> 문법이 의심되면 [jsonlint.com](https://jsonlint.com)에 붙여넣어 검증할 수 있다.

</details>

<br/>

---

## 5. 실제 적용 사례 — BQB Launcher

이 프로젝트에서 실제로 적용한 구성.

**대상:** React 18 + Babel + Google Fonts CDN을 사용하는 BQB 학습 앱 런처 (34KB)

**data.json:**
```json
{
    "frames": [
        {
            "url": "file:///C:/Users/user/Documents/Obsidian Vault/HTML/BQB_Launcher.html",
            "displayName": "BQB Launcher",
            "icon": "box",
            "hideOnMobile": true,
            "addRibbonIcon": true,
            "openInCenter": true,
            "zoomLevel": 1,
            "forceIframe": false,
            "customCss": "body { overflow-x: hidden; }",
            "customJs": ""
        }
    ],
    "padding": 0
}
```

**BQB Launcher.md:**
````markdown
# BQB 학습 앱 런처

```custom-frames
frame: BQB Launcher
style: height: 800px; width: 100%; overflow: hidden;
```
````

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,100:38bdf8&height=120&section=footer" width="100%" />

**Obsidian + Custom Frames + Claude**

Made with 💜 for the Obsidian community

</div>
