echo off
rmdir /s /q firefox.run.cache
cls
echo Starting Change Streaming
timeout /t 1 > nul
python build.py --firefox-stream-rebuild --rebuild-manifest
timeout /t 1 > nul
cls

powershell -ExecutionPolicy Bypass -File watch.ps1
rmdir /s /q firefox.run.cache