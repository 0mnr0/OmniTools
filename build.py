import os, sys
import shutil
import time
import subprocess
import json

args = sys.argv
possibleFiles = [
    "Chromium.output.zip", "Chromium.output.zip.tmp",
    "FireFox.output.zip", "FireFox.output.zip.tmp",
    "Safari.output.zip", "Safari.output.zip.tmp"
]
SevenZipExecutable = "C:\\Program Files\\7-Zip\\7z.exe"
isFireFoxStreaming = "--firefox-stream-rebuild" in args
isSafariStreaming = "--safari-stream-rebuild" in args
isSafariOnly = "--safari-only" in args
isFireFoxOnly = "--firefox-only" in args

ChromiumBuildFolder = "OmniTools - Chromium"
FirefoxPatchFolder = "FireFox Patches"
SafariPatchFolder = "Safari Patches"

if isFireFoxStreaming:
    buildCacheFolder = "firefox.run.cache"
elif isSafariStreaming:
    buildCacheFolder = "safari.run.cache"
else:
    buildCacheFolder = "build.cache"

versionBuilding = "Unknown"


def list_files_recursive(start_path='.'):
    filesList = []
    for root, dirs, files in os.walk(start_path):
        for File in files:
            filesList.append(os.path.join(root, File))
    return filesList

def cls():
    if os.name == 'nt':
        os.system("cls")
    else:
        os.system("clear")

def exists(pth):
    return os.path.exists(pth)

def setStatus(text):
    cls()
    print(text + "\n")

def zipDirectory(src_dir, dest_zip):
    dest_zip_abs = os.path.abspath(dest_zip)
    if exists(SevenZipExecutable):
        subprocess.run(
            f'"{SevenZipExecutable}" a -mx1 -tzip -r "{dest_zip_abs}" *',
            shell=True,
            cwd=src_dir
        )
    elif shutil.which("7z"):
        subprocess.run(
            f'7z a -mx1 -tzip -r "{dest_zip_abs}" *',
            shell=True,
            cwd=src_dir
        )
    elif shutil.which("zip"):
        subprocess.run(
            f'zip -qr "{dest_zip_abs}" .',
            shell=True,
            cwd=src_dir
        )
    else:
        import zipfile
        with zipfile.ZipFile(dest_zip_abs, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(src_dir):
                for file in files:
                    fullPath = os.path.join(root, file)
                    relPath = os.path.relpath(fullPath, src_dir)
                    zipf.write(fullPath, relPath)


def applyPatch(targetName, patchFolder, cacheFolder, isStreaming=False):
    global versionBuilding
    timeScale = 0 if isStreaming else 1
    if isStreaming and exists(cacheFolder):
        shutil.rmtree(cacheFolder)

    setStatus(f"TARGET - [ {targetName} ]\nCloning Chromium...")
    shutil.copytree(ChromiumBuildFolder, cacheFolder)
    time.sleep(0.75 * timeScale)

    setStatus(f"TARGET - [ {targetName} ]\nPatching Manifest...")
    manifest_path = os.path.join(cacheFolder, "manifest.json")
    patch_path = os.path.join(patchFolder, "manifest.patch.json")

    with open(manifest_path, encoding="UTF-8") as f:
        manifest = json.load(f)

    if exists(patch_path):
        with open(patch_path, encoding="UTF-8") as f:
            patch = json.load(f)

        for k, v in patch.items():
            if v is None:
                if k in manifest:
                    del manifest[k]
            else:
                manifest[k] = v

    with open(manifest_path, "w", encoding="UTF-8") as f:
        versionBuilding = manifest.get("version", "Unknown")
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    time.sleep(1.25 * timeScale)
    setStatus(f"TARGET - [ {targetName} ]\nApplying Patched Files...")
    if exists(patchFolder):
        fileList = list_files_recursive(patchFolder)
        for file in fileList:
            relFile = os.path.relpath(file, patchFolder)
            if relFile == "manifest.patch.json":
                continue
            destFile = os.path.join(cacheFolder, relFile)
            if exists(destFile):
                os.remove(destFile)
            if not isStreaming:
                time.sleep(0.1 * timeScale)
            os.makedirs(os.path.dirname(destFile), exist_ok=True)
            shutil.copy(file, destFile)

    if isStreaming:
        print(f"{targetName} was ReBuilt!")


def buildFirefox(cache=buildCacheFolder, isStreaming=isFireFoxStreaming):
    applyPatch("FIREFOX", FirefoxPatchFolder, cache, isStreaming=isStreaming)

def buildSafari(cache=buildCacheFolder, isStreaming=isSafariStreaming):
    applyPatch("SAFARI", SafariPatchFolder, cache, isStreaming=isStreaming)


if isFireFoxStreaming:
    buildFirefox()
    sys.exit(0)

if isSafariStreaming:
    buildSafari()
    sys.exit(0)

if isSafariOnly:
    setStatus("SAFARI - [ Executing Build ]")
    os.makedirs("output", exist_ok=True)
    safariCache = "build.cache.safari"
    if exists(safariCache):
        shutil.rmtree(safariCache)
    buildSafari(cache=safariCache, isStreaming=False)

    outputSafariDir = os.path.join("output", "Safari")
    if exists(outputSafariDir):
        shutil.rmtree(outputSafariDir)
    shutil.copytree(safariCache, outputSafariDir)

    outputSafariFile = os.path.join("output", f"Safari_{versionBuilding}.zip")
    if exists(outputSafariFile):
        os.remove(outputSafariFile)
    zipDirectory(safariCache, outputSafariFile)
    shutil.rmtree(safariCache)
    print(f"Safari build complete: {outputSafariFile} and {outputSafariDir}")
    sys.exit(0)

if isFireFoxOnly:
    setStatus("FIREFOX - [ Executing Build ]")
    os.makedirs("output", exist_ok=True)
    firefoxCache = "build.cache.firefox"
    if exists(firefoxCache):
        shutil.rmtree(firefoxCache)
    buildFirefox(cache=firefoxCache, isStreaming=False)
    outputFireFoxFile = os.path.join("output", f"Firefox_{versionBuilding}.zip")
    if exists(outputFireFoxFile):
        os.remove(outputFireFoxFile)
    zipDirectory(firefoxCache, outputFireFoxFile)
    shutil.rmtree(firefoxCache)
    print(f"Firefox build complete: {outputFireFoxFile}")
    sys.exit(0)


# FILE CLEANING
setStatus("Cleaning Previous Files...")
for file in possibleFiles:
    filePath = os.path.join("output", file)
    try:
        if exists(filePath):
            os.remove(filePath)
    except Exception as e:
        print(e)

if exists("output"):
    shutil.rmtree("output")
if exists(buildCacheFolder):
    shutil.rmtree(buildCacheFolder)

os.makedirs("output", exist_ok=True)
time.sleep(1)


# 1. Building Chromium
setStatus("CHROMIUM - [ Executing Build ]")
with open(os.path.join(ChromiumBuildFolder, "manifest.json"), encoding="UTF-8") as f:
    chromium_manifest = json.load(f)
versionBuilding = chromium_manifest.get("version", "Unknown")

outputChromiumFile = os.path.join("output", f"Chromium_{versionBuilding}.zip")
zipDirectory(ChromiumBuildFolder, outputChromiumFile)
time.sleep(1)


# 2. Building Firefox
setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ Executing Build ]")
buildFirefox()
outputFireFoxFile = os.path.join("output", f"Firefox_{versionBuilding}.zip")
zipDirectory(buildCacheFolder, outputFireFoxFile)
shutil.rmtree(buildCacheFolder)
time.sleep(1)


# 3. Building Safari
setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ DONE ]\nSAFARI - [ Executing Build ]")
buildSafari()
outputSafariFile = os.path.join("output", f"Safari_{versionBuilding}.zip")
zipDirectory(buildCacheFolder, outputSafariFile)

outputSafariDir = os.path.join("output", "Safari")
if exists(outputSafariDir):
    shutil.rmtree(outputSafariDir)
shutil.copytree(buildCacheFolder, outputSafariDir)
shutil.rmtree(buildCacheFolder)

setStatus("CHROMIUM - [ DONE ]\nFIREFOX - [ DONE ]\nSAFARI - [ DONE ]\nAll builds complete!")
print("Done.")
