@echo off
cd /d "%~dp0"
where git >nul 2>nul || set "PATH=%PATH%;C:\Program Files\Git\cmd"
echo [1/3] 식단표.html -^> index.html 복사
copy /Y "식단표.html" "index.html" >nul
echo [2/3] 변경사항 커밋
git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo 변경된 내용이 없습니다.
  pause
  exit /b
)
git commit -m "업데이트 %date% %time:~0,5%"
echo [3/3] GitHub에 업로드
git push
if %errorlevel%==0 (
  echo.
  echo 완료! 1~2분 뒤 반영됩니다: https://lynqook-gif.github.io/food/
) else (
  echo.
  echo 업로드 실패 - 인터넷 연결이나 GitHub 로그인 상태를 확인하세요.
)
pause
