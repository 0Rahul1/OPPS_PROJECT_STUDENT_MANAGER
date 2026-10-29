# ============================================================================
# Student Management System - Environment Setup Script (Windows PowerShell)
# ============================================================================

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  Student Management System - Automated Dependency Inspector     " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Winget
$hasWinget = Get-Command winget -ErrorAction SilentlyContinue
if (-not $hasWinget) {
    Write-Warning "winget is not available on this system. Please install software manually."
} else {
    Write-Host "[OK] Windows Package Manager (winget) detected." -ForegroundColor Green
}

# 2. Check CMake
$hasCMake = Get-Command cmake -ErrorAction SilentlyContinue
if ($hasCMake) {
    Write-Host "[OK] CMake is installed: $(cmake --version | Select-Object -First 1)" -ForegroundColor Green
} else {
    Write-Host "[MISSING] CMake is not installed." -ForegroundColor Yellow
    Write-Host "  Run: winget install Kitware.CMake --accept-package-agreements --accept-source-agreements" -ForegroundColor White
}

# 3. Check C++ Compiler
$hasGxx = Get-Command g++ -ErrorAction SilentlyContinue
$hasCl = Get-Command cl -ErrorAction SilentlyContinue

if ($hasGxx) {
    Write-Host "[OK] GCC/MinGW C++ compiler detected: $(g++ --version | Select-Object -First 1)" -ForegroundColor Green
} elseif ($hasCl) {
    Write-Host "[OK] Microsoft Visual C++ compiler (cl.exe) detected." -ForegroundColor Green
} else {
    Write-Host "[MISSING] No C++ compiler detected on PATH." -ForegroundColor Yellow
    Write-Host "  Option A (Recommended for Visual Studio users):" -ForegroundColor White
    Write-Host "    Install Visual Studio Community with 'Desktop development with C++':" -ForegroundColor Gray
    Write-Host "    https://visualstudio.microsoft.com/vs/community/" -ForegroundColor Gray
    Write-Host "  Option B (MinGW / GCC users):" -ForegroundColor White
    Write-Host "    winget install MSYS2.MSYS2" -ForegroundColor Gray
    Write-Host "    In MSYS2 UCRT64 shell: pacman -S mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-cmake" -ForegroundColor Gray
}

# 4. Check MySQL Server
$mysqlService = Get-Service *mysql* -ErrorAction SilentlyContinue
if ($mysqlService) {
    Write-Host "[OK] MySQL Service detected: $($mysqlService.Name) (Status: $($mysqlService.Status))" -ForegroundColor Green
    if ($mysqlService.Status -ne 'Running') {
        Write-Host "  -> To start service, run: Start-Service $($mysqlService.Name)" -ForegroundColor Yellow
    }
} else {
    Write-Host "[MISSING] MySQL Server service not detected." -ForegroundColor Yellow
    Write-Host "  Install via winget:" -ForegroundColor White
    Write-Host "    winget install Oracle.MySQL --accept-package-agreements --accept-source-agreements" -ForegroundColor Gray
    Write-Host "  Or download MySQL Community Server 8.4 LTS Installer:" -ForegroundColor White
    Write-Host "    https://dev.mysql.com/downloads/installer/" -ForegroundColor Gray
}

# 5. Check MySQL Connector/C++
$connectorPaths = @(
    "C:\Program Files\MySQL\Connector C++ 8.4",
    "C:\Program Files\MySQL\Connector C++ 8.0",
    "C:\Program Files\MySQL\MySQL Connector C++ 8.4",
    "C:\Program Files\MySQL\MySQL Connector C++ 8.0",
    "C:\Program Files\MySQL\Connector C++ 9.0"
)

$foundConnector = $false
foreach ($path in $connectorPaths) {
    if (Test-Path $path) {
        Write-Host "[OK] MySQL Connector/C++ detected at: $path" -ForegroundColor Green
        $foundConnector = $true
        break
    }
}

if (-not $foundConnector) {
    Write-Host "[MISSING] MySQL Connector/C++ not detected in default directories." -ForegroundColor Yellow
    Write-Host "  Download MySQL Connector/C++ (Windows MSI Installer, x64):" -ForegroundColor White
    Write-Host "    https://dev.mysql.com/downloads/connector/cpp/" -ForegroundColor Gray
    Write-Host "  (Ensure you select the stable 8.4 LTS or 8.0 release)" -ForegroundColor Gray
}

# 6. Check MongoDB Server
$mongoService = Get-Service *mongo* -ErrorAction SilentlyContinue
$hasMongosh = Get-Command mongosh, mongod -ErrorAction SilentlyContinue
if ($mongoService -or $hasMongosh) {
    Write-Host "[OK] MongoDB detected on system." -ForegroundColor Green
} else {
    Write-Host "[OPTIONAL] MongoDB not detected." -ForegroundColor Gray
    Write-Host "  To install MongoDB Community Server & Shell via winget:" -ForegroundColor White
    Write-Host "    winget install MongoDB.Server --accept-package-agreements --accept-source-agreements" -ForegroundColor Gray
    Write-Host "    winget install MongoDB.Shell --accept-package-agreements --accept-source-agreements" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  Summary & Next Steps:                                          " -ForegroundColor Cyan
Write-Host "  1. Install any missing components listed above.                " -ForegroundColor White
Write-Host "  2. For MySQL: import schema: mysql -u root -p < database/schema.sql" -ForegroundColor White
Write-Host "  3. For MongoDB: run setup: mongosh database/mongo_setup.js     " -ForegroundColor White
Write-Host "  4. Copy .env.example to .env and configure DB_TYPE and credentials." -ForegroundColor White
Write-Host "  5. Run build.bat to compile the project.                       " -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
