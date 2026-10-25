import os, sys
import shutil
import time
import subprocess
import json

args = sys.argv
possibleFiles = ["Chromium.output.zip", "Chromium.output.zip.tmp", "FireFox.output.zip", "FireFox.output.zip.tmp"]
SevenZipExecutable = "C:\\Program Files\\7-Zip\\7z.exe"
isFireFoxStreaming = "--firefox-stream-rebuild" in args

ChromiumBuildFolder = "OmniTools - Chromium"
FirefoxPatchFolder = "FireFox Patches"
buildCacheFolder = "firefox.run.cache" if isFireFoxStreaming else "build.cache"
versionBuilding = "Unknown"


def list_files_recursive(start_path='.'):
    filesList = []
    for root, dirs, files in os.walk(start_path):
        for File in files:
            filesList.append(os.path.join(root, File))
    return filesList

def cls(): os.system("cls")
def exists(pth): return os.path.exists(pth)
def setStatus(text):
    cls()
    print(text+"\n")
cls()

if not exists(SevenZipExecutable):
    raise "7Zip is not installed!"






# Building Chrome patch
def buildFirefox():
    global versionBuilding
    timeScale = 0 if isFireFoxStreaming else 1
    if isFireFoxStreaming and exists(buildCacheFolder):
        shutil.rmtree(buildCacheFolder)

    setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ Cloning Chromium ]")
    shutil.copytree(ChromiumBuildFolder, buildCacheFolder)
    time.sleep(0.75 * timeScale)

    setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ Patching Manifest ]")
    with open(buildCacheFolder + "\\manifest.json", encoding="UTF-8") as f:
        chromium = json.load(f)
    with open(FirefoxPatchFolder + "\\manifest.patch.json", encoding="UTF-8") as f:
        patch = json.load(f)

    for k, v in patch.items():
        if v is None:
            if k in chromium:
                del chromium[k]
        else:
            chromium[k] = v

    with open(buildCacheFolder + "\\manifest.json", "w", encoding="UTF-8") as f:
        versionBuilding = chromium.get("version")
        json.dump(chromium, f, ensure_ascii=False, indent=2)

    time.sleep(1.25 * timeScale)
    setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ Executing Build ]")
    fileList = list_files_recursive(FirefoxPatchFolder)
    for file in fileList:
        file = file.replace(f"{FirefoxPatchFolder}\\", "")
        if file == "manifest.patch.json": continue
        os.remove(f"{buildCacheFolder}\\{file}")
        if not isFireFoxStreaming: time.sleep(0.1 * timeScale)
        shutil.copy(
            f"{FirefoxPatchFolder}\\{file}",
            f"{buildCacheFolder}\\{file}"
        )
    if isFireFoxStreaming: print("FireFox was ReBuilt!")

if isFireFoxStreaming:
    buildFirefox()
    exit(0)







# FILE CLEANING

setStatus("Cleaning Previous Files...")
for file in possibleFiles:
    file = f"output\\{file}"
    try:
        if exists(file): os.remove(file)
    except Exception as e:
        print(e)
if exists("output"): shutil.rmtree("output")
if exists(buildCacheFolder): shutil.rmtree(buildCacheFolder)

os.mkdir("output")
time.sleep(1)



# Building Chromium
setStatus("CHROMIUM - [ Executing Build ]")
subprocess.run(
    f'"{SevenZipExecutable}" a -mx1 -tzip -r "output\\Chromium.zip" "{ChromiumBuildFolder}"',
    shell=True,
)
time.sleep(1)



buildFirefox()


outputFireFoxFile = os.path.abspath(f"output\\Firefox_{versionBuilding}.zip")
subprocess.run(
    f'"{SevenZipExecutable}" a -mx1 -tzip -r "{outputFireFoxFile}" *',
    shell=True,
    cwd=buildCacheFolder
)



try:
    os.rename(
        "output\\Chromium.zip", f"output\\Chromium_{versionBuilding}.zip"
    )
except Exception as e:
    print(e)

time.sleep(1)


setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ DONE ]\nCleaning build cache...")
shutil.rmtree(buildCacheFolder)
time.sleep(0.25)
setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ DONE ]\nBuild Cache cleaned!")
print("Done.")

