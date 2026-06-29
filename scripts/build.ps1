$ErrorActionPreference="SilentlyContinue"
Write-Output "=== Step 1: Build renderer ==="
Set-Location 'D:\×ÀÃæ\Codex\Workspace\formula-recognizer'
& "npx.cmd" tsc -p tsconfig.json 2>&1
Write-Output "Renderer exit: $LASTEXITCODE"
& "npx.cmd" tsc -p tsconfig.electron.json 2>&1
Write-Output "Electron exit: $LASTEXITCODE"
Copy-Item "src/index.html" "dist/renderer/index.html" -Force
Copy-Item "src/style.css" "dist/renderer/style.css" -Force
Copy-Item "electron/overlay.html" "dist/electron/overlay.html" -Force
Write-Output "=== DONE ==="

