"""
Custom Frames 자동 등록 스크립트
─────────────────────────────────
html/ 폴더의 *.html 파일을 스캔해서
Custom Frames data.json에 자동 등록/정리 + Obsidian 재시작

사용법:
  python register_html.py          # 등록 + Obsidian 재시작
  python register_html.py --dry    # 미리보기 (실제 변경 없음)
"""

import json, os, re, sys, subprocess, time, urllib.parse

# ── 경로 설정 ──
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_DIR = os.path.join(SCRIPT_DIR, "html")
DATA_JSON = os.path.join(SCRIPT_DIR, ".obsidian", "plugins", "obsidian-custom-frames", "data.json")

# ── 자동 등록 항목 식별 마커 ──
AUTO_MARKER = "auto-registered"

# ── 아이콘 매핑 (파일명 키워드 → Lucide 아이콘) ──
ICON_MAP = {
    "git": "git-branch",
    "guide": "book-open",
    "doc": "file-text",
    "test": "flask-conical",
    "api": "plug",
    "setup": "settings",
    "intro": "info",
    "readme": "book",
}
DEFAULT_ICON = "file-text"


def get_title(html_path):
    """HTML <title> 태그에서 제목 추출, 없으면 파일명 사용"""
    try:
        with open(html_path, "r", encoding="utf-8") as f:
            head = f.read(4096)
        m = re.search(r"<title[^>]*>(.*?)</title>", head, re.IGNORECASE | re.DOTALL)
        if m and m.group(1).strip():
            return m.group(1).strip()
    except Exception:
        pass
    return os.path.splitext(os.path.basename(html_path))[0].replace("_", " ")


def guess_icon(filename):
    """파일명으로 아이콘 추측"""
    name = filename.lower()
    for keyword, icon in ICON_MAP.items():
        if keyword in name:
            return icon
    return DEFAULT_ICON


def to_file_url(path):
    """로컬 경로 → file:/// URL (정방향 슬래시, 퍼센트 인코딩)"""
    abs_path = os.path.abspath(path)
    url_path = abs_path.replace("\\", "/")
    parts = url_path.split("/", 1)
    if len(parts) == 2:
        encoded = "/".join(
            urllib.parse.quote(seg, safe="") for seg in parts[1].split("/")
        )
        return f"file:///{parts[0]}/{encoded}"
    return f"file:///{urllib.parse.quote(url_path, safe='/:')}"


def make_frame(html_path):
    """HTML 파일 → Custom Frames 항목 생성"""
    filename = os.path.basename(html_path)
    return {
        "url": to_file_url(html_path),
        "displayName": get_title(html_path),
        "icon": guess_icon(filename),
        "hideOnMobile": True,
        "addRibbonIcon": True,
        "openInCenter": True,
        "zoomLevel": 1,
        "forceIframe": False,
        "customCss": "body { overflow-x: hidden; }",
        "customJs": AUTO_MARKER,
    }


def sync(dry_run=False):
    """html/ 폴더와 data.json 동기화. 변경 있으면 True 반환"""
    if not os.path.isdir(HTML_DIR):
        os.makedirs(HTML_DIR)

    html_files = sorted(
        f for f in os.listdir(HTML_DIR) if f.lower().endswith(".html")
    )

    with open(DATA_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    frames = data.get("frames", [])
    manual_frames = [fr for fr in frames if fr.get("customJs") != AUTO_MARKER]
    auto_urls = {fr["url"] for fr in frames if fr.get("customJs") == AUTO_MARKER}

    new_frames = []
    for fname in html_files:
        fpath = os.path.join(HTML_DIR, fname)
        new_frames.append(make_frame(fpath))

    new_urls = {fr["url"] for fr in new_frames}
    added = new_urls - auto_urls
    removed = auto_urls - new_urls

    if not added and not removed:
        return False

    for fr in new_frames:
        if fr["url"] in added:
            print(f"  + {fr['displayName']}  ({fr['icon']})")
    for url in removed:
        print(f"  - {urllib.parse.unquote(url.split('/')[-1])}")

    if dry_run:
        print("  [DRY RUN] 실제 변경 없음.")
        return False

    data["frames"] = manual_frames + new_frames
    with open(DATA_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return True


def restart_obsidian():
    """Obsidian 종료 후 재시작"""
    print("  Obsidian 재시작 중...")
    subprocess.run(["taskkill", "/IM", "Obsidian.exe", "/F"], capture_output=True)
    time.sleep(2)
    subprocess.Popen(["cmd", "/c", "start", "", "obsidian://open"],
                     creationflags=0x00000008)


def main():
    dry_run = "--dry" in sys.argv
    print()
    if sync(dry_run):
        restart_obsidian()
        print("  완료!\n")
    else:
        print("  변경 없음 — 이미 최신 상태입니다.\n")


if __name__ == "__main__":
    main()
