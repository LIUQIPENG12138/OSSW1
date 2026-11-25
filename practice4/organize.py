#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DU-FLEX 7주차 실습 4: 다운로드 폴더 정리 자동화 스크립트 (organize.py)
DU-FLEX 第7周实践 4：下载文件夹自动整理脚本

기능:
1. 확장자별로 하위 폴더(문서, 이미지, 스프레드시트, 압축파일, 미디어 등)로 분류 이동
2. --dry-run 옵션: 실제 파일을 이동하지 않고 계획만 출력
3. 이동 내역을 log.txt에 타임스탬프와 함께 한 줄씩 기록
안전 제약: practice_downloads 내부 파일만 대상 (외부 파일 접근 및 삭제 엄격 금지)
"""

import os
import sys
import shutil
import argparse
from datetime import datetime
from pathlib import Path

# 파일 확장자별 카테고리 매핑 규칙
EXTENSION_CATEGORIES = {
    # 문서 (Documents)
    ".pdf": "문서_Documents",
    ".docx": "문서_Documents",
    ".doc": "문서_Documents",
    ".pptx": "문서_Documents",
    ".ppt": "문서_Documents",
    ".txt": "문서_Documents",
    ".md": "문서_Documents",
    ".hwp": "문서_Documents",
    
    # 스프레드시트 / 데이터 (Spreadsheets)
    ".xlsx": "스프레드시트_Spreadsheets",
    ".xls": "스프레드시트_Spreadsheets",
    ".csv": "스프레드시트_Spreadsheets",
    
    # 이미지 (Images)
    ".jpg": "이미지_Images",
    ".jpeg": "이미지_Images",
    ".png": "이미지_Images",
    ".gif": "이미지_Images",
    ".webp": "이미지_Images",
    ".svg": "이미지_Images",
    
    # 압축 파일 (Archives)
    ".zip": "압축파일_Archives",
    ".tar": "압축파일_Archives",
    ".gz": "압축파일_Archives",
    ".7z": "압축파일_Archives",
    ".rar": "압축파일_Archives",
    
    # 미디어 (Media)
    ".mp3": "미디어_Media",
    ".wav": "미디어_Media",
    ".mp4": "미디어_Media",
    ".mkv": "미디어_Media",
}

# 기본 카테고리 (분류되지 않는 파일)
DEFAULT_CATEGORY = "기타_Others"

def get_category_for_file(filename: str) -> str:
    """파일명의 확장자를 기반으로 분류 폴더명을 반환합니다."""
    lower_name = filename.lower()
    # tar.gz 와 같은 복합 확장자 처리
    if lower_name.endswith(".tar.gz"):
        return "압축파일_Archives"
    
    _, ext = os.path.splitext(lower_name)
    return EXTENSION_CATEGORIES.get(ext, DEFAULT_CATEGORY)

def main():
    parser = argparse.ArgumentParser(
        description="다운로드 폴더(practice_downloads) 자동 정리 스크립트"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="실제 파일을 이동하지 않고 이동 계획만 화면에 출력합니다."
    )
    parser.add_argument(
        "--target-dir",
        type=str,
        default="practice_downloads",
        help="정리할 대상 폴더 경로 (기본값: practice_downloads)"
    )
    args = parser.parse_args()

    # 기준 디렉토리: organize.py가 위치한 폴더
    script_dir = Path(__file__).resolve().parent
    target_path = (script_dir / args.target_dir).resolve()
    log_file_path = script_dir / "log.txt"

    # 안전성 검증: practice_downloads 폴더 내부인지 엄격 확인
    practice_dir_canonical = (script_dir / "practice_downloads").resolve()
    if target_path != practice_dir_canonical:
        print(f"[안전 오류] 허용되지 않은 디렉토리 접근 시도: {target_path}", file=sys.stderr)
        print("본 스크립트는 'practice_downloads' 폴더 내의 파일만 정리할 수 있습니다.", file=sys.stderr)
        sys.exit(1)

    if not target_path.exists() or not target_path.is_dir():
        print(f"[오류] 대상 폴더가 존재하지 않습니다: {target_path}", file=sys.stderr)
        sys.exit(1)

    print("=" * 65)
    print(f"📁 DU-FLEX 파일 정리 자동화 스크립트 실행")
    print(f"📍 대상 폴더: {target_path}")
    print(f"⚙️ 실행 모드: {'[DRY-RUN 모드] (시뮬레이션 - 실제 파일 변경 없음)' if args.dry_run else '[실제 실행 모드] (파일 이동 및 log.txt 기록)'}")
    print("=" * 65)

    # 분류 대상 파일 수집 (하위 폴더 자체는 제외하고 최상위 직속 파일만 대상)
    items_to_move = []
    for item in sorted(target_path.iterdir()):
        if item.is_file():
            # log.txt 나 스크립트 파일이 실수로 들어있는 경우 제외
            if item.name in ["log.txt", "organize.py"]:
                continue
            cat = get_category_for_file(item.name)
            items_to_move.append((item, cat))

    if not items_to_move:
        print("정리할 파일이 없습니다. (이미 정리되었거나 폴더가 비어 있습니다.)")
        return

    print(f"총 {len(items_to_move)}개의 정리 대상 파일을 발견했습니다.\n")

    logs_to_write = []
    moved_count = 0

    for src_file, category in items_to_move:
        dest_dir = target_path / category
        dest_file = dest_dir / src_file.name

        if args.dry_run:
            print(f"  [DRY-RUN 계획] '{src_file.name}' -> [{category}/]")
        else:
            # 실제 실행: 대상 서브폴더 생성
            dest_dir.mkdir(parents=True, exist_ok=True)
            
            # 대상 위치에 동일 파일명이 이미 존재하는 경우 안전 처리
            final_dest = dest_file
            if final_dest.exists():
                stem = src_file.stem
                suffix = src_file.suffix
                counter = 1
                while final_dest.exists():
                    final_dest = dest_dir / f"{stem}_{counter}{suffix}"
                    counter += 1

            # 파일 이동 (절대 삭제 금지)
            shutil.move(str(src_file), str(final_dest))
            moved_count += 1
            print(f"  [이동 완료] '{src_file.name}' -> '{category}/{final_dest.name}'")

            # 로그 기록 준비
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_line = f"[{timestamp}] MOVED: '{src_file.name}' -> '{category}/{final_dest.name}'\n"
            logs_to_write.append(log_line)

    # 실제 실행 시 log.txt에 덧붙여 기록 (append mode)
    if not args.dry_run and logs_to_write:
        with open(log_file_path, "a", encoding="utf-8") as f:
            f.writelines(logs_to_write)
        print(f"\n📝 정리 내역 {len(logs_to_write)}건이 '{log_file_path.name}'에 안전하게 기록되었습니다.")

    print("\n" + "=" * 65)
    if args.dry_run:
        print("✅ [DRY-RUN 완료] 실제 파일은 이동되지 않았습니다. 실제 실행은 --dry-run 없이 실행하세요.")
    else:
        print(f"🎉 [정리 완료] 총 {moved_count}개의 파일이 성공적으로 분류 이동되었습니다.")
    print("=" * 65)

if __name__ == "__main__":
    main()

