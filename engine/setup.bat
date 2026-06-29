@echo off
chcp 65001 >nul
title Formula Recognizer - Engine Setup
echo ========================================
echo   Formula Recognizer - Engine Setup
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.11 from:
    echo   https://www.microsoft.com/store/productId/9NRWMJP3717K
    echo Or from: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python found
python --version

REM Install pip packages
echo.
echo [1/2] Installing Python packages (this may take 5-10 minutes)...
python -m pip install --upgrade pip -q
python -m pip install -r "%~dp0engine\requirements.txt" -i https://pypi.tuna.tsinghua.edu.cn/simple
if %errorlevel% neq 0 (
    echo [WARN] Install from mirror failed, trying default source...
    python -m pip install -r "%~dp0engine\requirements.txt"
)

echo.
echo [2/2] Verifying installation...
python -c "from pix2tex.cli import LatexOCR; print("[OK] Pix2Tex ready")" 2>nul
if %errorlevel% neq 0 (
    echo [WARN] Pix2Tex check failed - will auto-download on first use
)

echo.
echo ========================================
echo   Setup complete! You can now run:
echo   "Formula Recognizer.exe"
echo ========================================
pause
