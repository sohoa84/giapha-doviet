param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       PUBLISH GIA PHA TO GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ==========================================
# CHECK PROJECT
# ==========================================

if (-not (Test-Path "package.json")) {
    Write-Host "Khong tim thay package.json." -ForegroundColor Red
    Write-Host "Hay chay file nay tai thu muc goc cua project." -ForegroundColor Yellow
    exit 1
}

# ==========================================
# CHECK GIT
# ==========================================

try {
    git --version | Out-Null
}
catch {
    Write-Host "May chua cai Git hoac Git chua nam trong PATH." -ForegroundColor Red
    exit 1
}

# ==========================================
# VALIDATE + BUILD LOCAL
# ==========================================

Write-Host "[1/5] Kiem tra cau hinh deploy..." -ForegroundColor Yellow
npm run deploy:check
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "[2/5] Kiem tra va build website..." -ForegroundColor Yellow
npm run genealogy:build
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

# ==========================================
# GIT REPOSITORY
# ==========================================

if (-not (Test-Path ".git")) {

    Write-Host ""
    Write-Host "Thu muc nay chua duoc khoi tao Git." -ForegroundColor Yellow
    Write-Host "Dang chay: git init" -ForegroundColor Yellow

    git init
    git branch -M main
}

# ==========================================
# REMOTE
# ==========================================

$origin = ""
try {
    $origin = git remote get-url origin 2>$null
}
catch {
    $origin = ""
}

if (-not $origin) {

    Write-Host ""
    Write-Host "CHUA CO GITHUB REMOTE ORIGIN" -ForegroundColor Red
    Write-Host ""
    Write-Host "Lan dau tien, tao repository tren GitHub roi chay:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host 'git remote add origin https://github.com/TEN-TAI-KHOAN/TEN-REPO.git'
    Write-Host 'git branch -M main'
    Write-Host ""
    Write-Host "Sau do chay lai PUBLISH_GITHUB.bat."
    Write-Host ""

    exit 1
}

# Check again after origin is known.
npm run deploy:check
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

# ==========================================
# COMMIT
# ==========================================

Write-Host ""
Write-Host "[3/5] Them cac thay doi vao Git..." -ForegroundColor Yellow

git add .

$changes = git status --porcelain

if (-not $changes) {

    Write-Host "Khong co thay doi moi de commit." -ForegroundColor Green

}
else {

    if (-not $Message) {
        $Message =
            "Update genealogy " +
            (Get-Date -Format "yyyy-MM-dd HH:mm")
    }

    Write-Host ""
    Write-Host "[4/5] Commit: $Message" -ForegroundColor Yellow

    git commit -m "$Message"

}

# ==========================================
# PUSH
# ==========================================

Write-Host ""
Write-Host "[5/5] Push len GitHub..." -ForegroundColor Yellow

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " PUBLISH THANH CONG" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "GitHub Actions se tu build va deploy Pages." -ForegroundColor Cyan
Write-Host "Vao tab Actions tren GitHub de xem tien trinh." -ForegroundColor Cyan
Write-Host ""
