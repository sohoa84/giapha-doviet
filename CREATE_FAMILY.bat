@echo off
chcp 65001 >nul
title Tao Gia Pha Moi

echo.
echo ========================================
echo        TAO CAU HINH GIA PHA MOI
echo ========================================
echo.

node scripts/create-family.js

echo.
pause
