@echo off
REM ============================================================================
REM Student Management System - Automated GitHub Push Script
REM ============================================================================

echo =====================================================================
echo       Push Student Management System to Your GitHub Repository
echo =====================================================================
echo.

git remote -v | findstr "origin" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Remote 'origin' is currently set to:
    git remote -v
    echo.
    echo Pushing existing branch 'main' to GitHub...
    git push -u origin main
    goto end
)

echo Please enter your GitHub repository HTTPS or SSH URL.
echo (e.g. https://github.com/YourUsername/StudentManagementSystem.git)
echo.
set /p REPO_URL="Enter GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Push cancelled.
    pause
    exit /b 1
)

echo.
echo [STEP 1/2] Adding remote origin: %REPO_URL%
git remote add origin %REPO_URL%

echo [STEP 2/2] Pushing branch 'main' to GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================================
    echo [SUCCESS] Your project has been pushed to GitHub!
    echo Repository Link: %REPO_URL%
    echo =====================================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check your GitHub permissions or credentials.
)

:end
echo.
pause
