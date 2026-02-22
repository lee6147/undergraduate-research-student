# Obsidian HTML Viewer

Obsidian에서 HTML 가이드 파일을 바로 열어볼 수 있는 환경입니다.

---

## 핵심 플러그인

| 플러그인 | 역할 | 필수 여부 |
|---------|------|----------|
| **obsidian-html-plugin** (HTML Reader) | `.html` 파일을 파일 탐색기에서 인식 | 필수 |
| **obsidian-custom-frames** | HTML 파일을 localhost 서버를 통해 렌더링 | 필수 |

> React CDN 기반 HTML은 HTML Reader만으로 렌더링되지 않습니다. **Custom Frames에 등록해야** 정상적으로 열립니다.

---

## 시작하기

### 1. 커뮤니티 플러그인 설치

1. **설정** → **커뮤니티 플러그인** → **제한 모드 해제** → **찾아보기**
2. `HTML Reader`, `Custom Frames` 두 개 모두 설치 및 활성화

### 2. 로컬 서버 실행

`Guide_HTML` 폴더에서 Python 서버를 실행합니다:

```bash
cd Guide_HTML
python -m http.server 9876
```

이 서버가 켜져 있어야 Custom Frames에서 HTML이 열립니다.

### 3. HTML 파일 열기

Custom Frames에 등록된 파일은 리본(좌측 사이드바) 아이콘을 클릭하면 열립니다.

---

## ***** Custom Frames에 새 HTML 등록하기

HTML 파일을 새로 만들면 **반드시 Custom Frames에 등록**해야 Obsidian에서 열 수 있습니다.

`.obsidian/plugins/obsidian-custom-frames/data.json`의 `frames` 배열에 추가:

```json
{
    "url": "http://localhost:9876/파일명.html",
    "displayName": "표시 이름",
    "icon": "아이콘명",
    "addRibbonIcon": true,
    "openInCenter": true,
    "zoomLevel": 1,
    "forceIframe": false,
    "customCss": "body { overflow-x: hidden; }",
    "customJs": ""
}
```

등록 후 **Obsidian 재시작** 필요.

> 한글 파일명은 URL 인코딩 필요: `센터` → `%EC%84%BC%ED%84%B0`

---

## ***** 명령어 팔레트로 파일 찾기

`Ctrl + P`를 누르면 명령어 팔레트가 열립니다. 파일명을 검색하면 바로 찾아서 열 수 있습니다.

---

## ***** HTML 가이드 만들기

JSX/TSX 파일을 Obsidian에서 실행 가능한 단일 HTML로 변환할 수 있습니다.
AI에게 [`JSX_Obsidian_변환프롬프트_v4.4.md`](./JSX_Obsidian_변환프롬프트_v4.4.md)를 붙여넣고 JSX 파일을 주면 자동으로 변환해줍니다.

**HTML을 만들 때 반드시 함께 요청할 것:**
1. **HTML 파일** — Obsidian Custom Frames에서 렌더링할 인터랙티브 가이드
2. **마크다운(.md) 파일** — 같은 내용을 기반으로 한 Obsidian 노트용 문서

> 마크다운 파일이 있어야 Obsidian 파일 탐색기와 `Ctrl + P` 검색에서 내용을 바로 확인할 수 있습니다.

---

## 참고 자료

- [obsidian-html-plugin (GitHub)](https://github.com/nuthrash/obsidian-html-plugin) — HTML Reader 플러그인 원본
