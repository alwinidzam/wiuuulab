@echo off
title wiuuulab - Cloudflare Tunnel Launcher
color 0B
echo =======================================================
echo    wiuuulab - Cloudflare Public Tunnel (100%% Free)
echo =======================================================
echo.
if not exist "cloudflared.exe" (
    echo Mengunduh cloudflared.exe dari GitHub Cloudflare...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile 'cloudflared.exe'"
)
echo.
echo Menjalankan tunnel publik gratis ke port 8000...
echo Salin URL *.trycloudflare.com yang muncul di bawah ke Vercel!
echo =======================================================
echo.
cloudflared.exe tunnel --url http://127.0.0.1:8000
pause
