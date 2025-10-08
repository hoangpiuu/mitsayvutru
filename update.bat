@echo off
title Cap nhat website GitHub tu dong
echo ===========================================
echo 🔄 Dang cap nhat web len GitHub Pages...
echo ===========================================

:: Chuyen den thu muc hien tai (du phong)
cd /d "%~dp0"

:: Them toan bo thay doi
git add .

:: Tao commit kem thoi gian hien tai
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (set ngay=%%a-%%b-%%c)
for /f "tokens=1 delims= " %%a in ('time /t') do (set gio=%%a)
git commit -m "Auto update luc %ngay% %gio%"

:: Day len GitHub
git push origin main

echo ===========================================
echo ✅ Da day thanh cong! Web se tu cap nhat sau ~1 phut.
echo ===========================================
exit
