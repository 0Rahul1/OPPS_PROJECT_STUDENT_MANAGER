@echo off
REM ============================================================================
REM Student Management System - Automated C++ Build Script (Windows)
REM ============================================================================

echo =====================================================================
echo       Building Student Management System (C++ OOP + Polyglot DB)
echo =====================================================================

REM Add WinLibs MinGW toolchain to PATH if present
set "WINLIBS_BIN=C:\Users\yashp\AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin"
if exist "%WINLIBS_BIN%" set "PATH=%WINLIBS_BIN%;%PATH%"

where g++ >nul 2>&1
if errorlevel 1 (
    echo [ERROR] C++ compiler g++ was not found!
    pause
    exit /b 1
)

echo [STEP 1/2] Compiling standalone C++17 binary using g++...
g++ -std=c++17 -static -static-libgcc -static-libstdc++ -Isrc src\main.cpp src\Person.cpp src\Student.cpp src\UndergraduateStudent.cpp src\DatabaseConfig.cpp src\DatabaseConnection.cpp src\StudentRepository.cpp src\MongoStudentRepository.cpp src\Menu.cpp -o StudentManagementSystem.exe

if errorlevel 1 (
    echo [ERROR] Compilation failed! Review the error messages above.
    pause
    exit /b 1
)

echo [STEP 2/2] Verifying generated binary...
if exist "StudentManagementSystem.exe" (
    echo [SUCCESS] StudentManagementSystem.exe compiled successfully!
    echo Binary Location: %CD%\StudentManagementSystem.exe
)

echo =====================================================================
echo [BUILD COMPLETE]
echo To run the native console application: double-click run.bat
echo To run the live interactive browser portal: double-click start_live_portal.bat
echo =====================================================================
