(function () {
  var ua = navigator.userAgent || ''
  var platform = navigator.platform || ''
  var isWindows = /Windows|Win32|Win64/i.test(ua + platform)
  var isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua + platform)
  var label = document.getElementById('detectedPlatform')

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
