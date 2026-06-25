# CCSwitch 安装包

这个包用于安装 CCSwitch。

## macOS

双击或终端运行：

```bash
./install-macos.command
```

## Windows

右键 `install-windows.ps1`，选择“使用 PowerShell 运行”。

## 下载源

默认使用：

```text
https://registry.npmmirror.com
```

如果要改成官方 npm：

macOS:

```bash
NPM_REGISTRY=https://registry.npmjs.org ./install-macos.command
```

Windows PowerShell:

```powershell
$env:NPM_REGISTRY="https://registry.npmjs.org"; .\install-windows.ps1
```
