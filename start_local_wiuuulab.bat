@echo off
title wiuuulab - Unified AI Audio Gateway
color 0A
echo =======================================================
echo    wiuuulab - 100%% FREE AI Audio Gateway (Local Mode)
echo =======================================================
echo.
echo Memastikan dependensi terpasang...
python -m pip install -q fastapi uvicorn httpx edge-tts pydantic
echo.
echo Menjalankan Gateway di port 8000...
echo Endpoint lokal: http://127.0.0.1:8000
echo.
python -m uvicorn gateway:app --host 0.0.0.0 --port 8000 --reload
pause
