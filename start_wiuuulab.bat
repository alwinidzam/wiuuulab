@echo off
title wiuuulab - All-in-One AI Studio Launcher
color 0B

echo =======================================================
echo          wiuuulab - Studio AI Suara 100%% FREE
echo =======================================================
echo.
echo 1. Memeriksa dependensi AI Gateway...
python -m pip install -q fastapi uvicorn httpx edge-tts pydantic
echo    [OK] AI Gateway dependencies siap!
echo.
echo 2. Menjalankan Backend Gateway (Port 8000)...
start "wiuuulab - AI Gateway (Port 8000)" cmd /k "cd /d c:\elevenlab feels && python -m uvicorn gateway:app --host 0.0.0.0 --port 8000"

echo 3. Menjalankan Frontend Web Studio (Port 3000)...
start "wiuuulab - Web Studio (Port 3000)" cmd /k "cd /d c:\elevenlab feels\elevenlabs-clone-frontend && npm run dev"

echo.
echo Menunggu server siap...
timeout /t 5 /nobreak >nul

echo 4. Membuka browser ke wiuuulab Studio...
start http://localhost:3000

echo.
echo =======================================================
echo  wiuuulab BERHASIL BERJALAN!
echo  - Studio Web: http://localhost:3000
echo  - AI Gateway: http://localhost:8000
echo  - Dokumentasi API: http://localhost:8000/docs
echo =======================================================
echo.
echo Biarkan jendela terminal ini tetap terbuka selama menggunakan wiuuulab.
pause
