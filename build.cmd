@echo off
chcp 1251 > nul
cls

echo Cleaning previous files...
echo.

if exist build.zip (
	del /f /q build.zip
	timeout /t 2 > nul
)

if exist build.zip.tmp (
	del /f /q build.zip.tmp
)
timeout /t 1 > nul

cls
echo Building ZIP...
echo.

setlocal enabledelayedexpansion
set "SEVENZIP_PATH=C:\Program Files\7-Zip\7z.exe"
if not exist "%SEVENZIP_PATH%" (
    powershell -command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('7-Zip [%SEVENZIP_PATH%] not detected','Error',[System.Windows.MessageBoxButton]::OK,[System.Windows.MessageBoxImage]::Error)"
    exit /b 1
)

"%SEVENZIP_PATH%" a -tzip -r "build.zip" .

timeout /t 1 > nul

cls
echo Removing cached files...
echo.

"%SEVENZIP_PATH%" d "build.zip" "build.cmd" ".gitattributes" ".git"

timeout /t 1 > nul
cls 
echo.
echo [OK] Build is done