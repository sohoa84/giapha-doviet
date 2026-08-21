@echo off
chcp 65001 >nul
title Publish Gia Pha

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0PUBLISH_GITHUB.ps1"

echo.
pause
