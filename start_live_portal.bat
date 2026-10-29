@echo off
REM ============================================================================
REM Student Management System - 1-Click Live Portal Launcher
REM Opens http://localhost:3000 in your browser and starts the server
REM ============================================================================

echo =====================================================================
echo    Launching Student Management System - Live Interactive Portal
echo =====================================================================
echo Opening web interface at: http://localhost:3000 ...

start http://localhost:3000
node server.js
pause
