$ErrorActionPreference = "Stop"
$PackageName = "@google/gemini-cli"
$BinaryName = "gemini"
$Registry = $env:NPM_REGISTRY
if ([string]::IsNullOrWhiteSpace($Registry)) {
  $Registry = "https://registry.npmmirror.com"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "未检测到 npm。请先安装 Node.js: https://nodejs.org/"
  exit 1
}

Write-Host "Installing $PackageName from $Registry"
npm install -g "$PackageName@latest" --registry="$Registry"

Write-Host "Verifying $BinaryName"
& $BinaryName --version
Write-Host "完成：$PackageName"
