(function () {
  var ua = navigator.userAgent || ''
  var platform = navigator.platform || ''
  var isWindows = /Windows|Win32|Win64/i.test(ua + platform)
  var isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua + platform)
  var label = document.getElementById('detectedPlatform')

  if (isWindows) {
    if (label) label.textContent = '已识别为 Windows。下载任意工具 ZIP 后运行 install-windows.ps1。'
    return
  }

  if (isMac) {
    if (label) label.textContent = '已识别为 macOS。下载任意工具 ZIP 后运行 install-macos.command。'
    return
  }

  if (label) label.textContent = '未识别系统，请选择要下载的工具安装包。'
})()
