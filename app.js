(function () {
  var ua = navigator.userAgent || ''
  var platform = navigator.platform || ''
  var isWindows = /Windows|Win32|Win64/i.test(ua + platform)
  var isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua + platform)
  var label = document.getElementById('detectedPlatform')
  var scriptDownloads = {
    'ccswitch-macos.command': buildMacScript('ccswitch', 'ccswitch'),
    'ccswitch-windows.ps1': buildWindowsScript('ccswitch', 'ccswitch'),
    'gemini-cli-macos.command': buildMacScript('@google/gemini-cli', 'gemini'),
    'gemini-cli-windows.ps1': buildWindowsScript('@google/gemini-cli', 'gemini'),
    'codex-macos.command': buildMacScript('@openai/codex', 'codex'),
    'codex-windows.ps1': buildWindowsScript('@openai/codex', 'codex'),
    'claude-code-macos.command': buildMacScript('@anthropic-ai/claude-code', 'claude'),
    'claude-code-windows.ps1': buildWindowsScript('@anthropic-ai/claude-code', 'claude')
  }

  function buildMacScript(packageName, binaryName) {
    return [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      '',
      'PACKAGE_NAME="' + packageName + '"',
      'BINARY_NAME="' + binaryName + '"',
      'REGISTRY="${NPM_REGISTRY:-https://registry.npmmirror.com}"',
      '',
      'if ! command -v npm >/dev/null 2>&1; then',
      '  echo "未检测到 npm。请先安装 Node.js: https://nodejs.org/"',
      '  exit 1',
      'fi',
      '',
      'echo "Installing ${PACKAGE_NAME} from ${REGISTRY}"',
      'npm install -g "${PACKAGE_NAME}@latest" --registry="${REGISTRY}"',
      '',
      'echo "Verifying ${BINARY_NAME}"',
      '"${BINARY_NAME}" --version || true',
      'echo "完成：${PACKAGE_NAME}"',
      ''
    ].join('\n')
  }

  function buildWindowsScript(packageName, binaryName) {
    return [
      '$ErrorActionPreference = "Stop"',
      '$PackageName = "' + packageName + '"',
      '$BinaryName = "' + binaryName + '"',
      '$Registry = $env:NPM_REGISTRY',
      'if ([string]::IsNullOrWhiteSpace($Registry)) {',
      '  $Registry = "https://registry.npmmirror.com"',
      '}',
      '',
      'if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {',
      '  Write-Host "未检测到 npm。请先安装 Node.js: https://nodejs.org/"',
      '  exit 1',
      '}',
      '',
      'Write-Host "Installing $PackageName from $Registry"',
      'npm install -g "$PackageName@latest" --registry="$Registry"',
      '',
      'Write-Host "Verifying $BinaryName"',
      '& $BinaryName --version',
      'Write-Host "完成：$PackageName"',
      ''
    ].join('\n')
  }

  function getFileName(href) {
    return href.split('/').pop().split('?')[0].split('#')[0]
  }

  function forceDownload(fileName, content) {
    var blob = new Blob([content], { type: 'application/octet-stream' })
    var url = window.URL.createObjectURL(blob)
    var link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.setTimeout(function () {
      window.URL.revokeObjectURL(url)
    }, 1000)
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[href*="downloads/scripts/"]'), function (link) {
    link.addEventListener('click', function (event) {
      var fileName = getFileName(link.getAttribute('href') || '')
      var content = scriptDownloads[fileName]

      if (!content || !window.Blob || !window.URL || !window.URL.createObjectURL) return

      event.preventDefault()
      forceDownload(fileName, content)
    })
  })

  if (isWindows) {
    if (label) label.textContent = '已识别为 Windows。下载对应工具的 Windows 脚本后运行。'
    return
  }

  if (isMac) {
    if (label) label.textContent = '已识别为 macOS。下载对应工具的 macOS 脚本后运行。'
    return
  }

  if (label) label.textContent = '未识别系统，请选择对应工具的 macOS 或 Windows 安装脚本。'
})()
