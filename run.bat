@echo off
REM ============================================================================
REM Student Management System - C++ Native Console Application Launcher
REM ============================================================================

setlocal
set PATH=C:\Users\yashp\AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin;%PATH%

echo =====================================================================
echo    Launching C++ Native Console Application (StudentManagementSystem)
echo =====================================================================
echo.

if exist "StudentManagementSystem.exe" (
    StudentManagementSystem.exe
) else (
    echo [ERROR] StudentManagementSystem.exe not found!
    echo Running build.bat first to compile...
    call build.bat
    if exist "StudentManagementSystem.exe" (
        StudentManagementSystem.exe
    )
)

echo.
pause
