$base = "OmniTools - Chromium"
$global:buildPy = Join-Path $PSScriptRoot 'build.py'
$global:pythonExe = "python"

# Дебаунс (мс)
$global:debounceMs = 1000
$global:lastRun = Get-Date "01.01.2000"

# Флаг состояния сборки
$global:isBuilding = $false

function Log($msg) {
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "[$time] $msg"
}

$fsw = New-Object System.IO.FileSystemWatcher
$fsw.Path = $base
$fsw.IncludeSubdirectories = $true
$fsw.NotifyFilter = [System.IO.NotifyFilters]'LastWrite, FileName, DirectoryName'
$fsw.EnableRaisingEvents = $true

Register-ObjectEvent -InputObject $fsw -EventName Changed -Action {
    # 1. Если сборка уже идет - игнорируем событие сразу
    if ($global:isBuilding) {
        return
    }

    try {
        $now = Get-Date

        # 2. Проверка дебаунса (для отсечения мгновенных дублей до запуска процесса)
        if (($now - $global:lastRun).TotalMilliseconds -lt $global:debounceMs) {
            return
        }

        # Блокируем новые запуски
        $global:isBuilding = $true
        
        $fullPath = $Event.SourceEventArgs.FullPath

        if ($fullPath -like "*manifest.json") {
            Log "manifest.json changed -> rebuild manifest"
            Start-Process -FilePath $global:pythonExe -ArgumentList @("$global:buildPy","--firefox-stream-rebuild","--rebuild-manifest") -NoNewWindow -Wait -PassThru | Out-Null
        }
        else {
            Log "files changed -> normal rebuild"
            Start-Process -FilePath $global:pythonExe -ArgumentList @("$global:buildPy","--firefox-stream-rebuild") -NoNewWindow -Wait -PassThru | Out-Null
        }
        
        Log "Waiting for any changes..."
    }
    catch {
        Write-Host "Error in event handler: $_"
    }
    finally {
        # 3. Важно: Обновляем время ПОСЛЕ сборки и снимаем флаг.
        # Это предотвратит запуск событий, которые скопились в очереди, 
        # пока шла сборка.
        $global:lastRun = Get-Date
        $global:isBuilding = $false
    }
} | Out-Null

Log "Watching... (Ctrl+C to stop)"
while ($true) { Start-Sleep 1 }