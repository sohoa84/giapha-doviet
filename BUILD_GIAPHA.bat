@echo off
chcp 65001 >nul
title Gia Pha Builder

echo.
echo ========================================
echo        GIA PHA TEMPLATE BUILDER
echo ========================================
echo.

echo [1/3] Kiem tra du lieu...
call npm run genealogy:validate
if errorlevel 1 goto error

echo.
echo [2/3] Chuyen Excel sang JSON...
call npm run genealogy:convert
if errorlevel 1 goto error

echo.
echo [3/3] Build website...
call npm run build
if errorlevel 1 goto error

echo.
echo ========================================
echo  HOAN THANH
echo  Website nam trong thu muc: dist
echo ========================================
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo  BUILD THAT BAI - HAY KIEM TRA LOI PHIA TREN
echo ========================================
echo.
pause
exit /b 1
