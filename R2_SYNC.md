# Cloudflare R2 自动镜像

这个仓库包含一个 GitHub Actions 工作流，用来定时跟踪官方 npm 版本，并把官方发布包同步到 Cloudflare R2。

## 同步内容

- `@anthropic-ai/claude-code`
- `@openai/codex`
- `@google/gemini-cli`
- `ccswitch`

同步脚本读取 npm 官方 `latest` 元数据，下载官方 tarball，生成：

- `manifest.json`
- `install.sh`
- `install.ps1`
- `packages/<tool>/<version>/<official-file>.tgz`

## GitHub 配置

在仓库 `Settings -> Secrets and variables -> Actions` 里配置：

Secrets:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

Variables:

- `PUBLIC_MIRROR_BASE_URL`

`PUBLIC_MIRROR_BASE_URL` 应该是 R2 公开访问域名，例如：

```text
https://downloads.example.com
```

## 一键安装

macOS / Linux:

```bash
curl -fsSL https://downloads.example.com/install.sh | bash -s -- codex
curl -fsSL https://downloads.example.com/install.sh | bash -s -- claude-code
curl -fsSL https://downloads.example.com/install.sh | bash -s -- gemini-cli
curl -fsSL https://downloads.example.com/install.sh | bash -s -- ccswitch
```

Windows PowerShell:

```powershell
iwr https://downloads.example.com/install.ps1 -OutFile $env:TEMP\ai-hub-install.ps1
powershell -ExecutionPolicy Bypass -File $env:TEMP\ai-hub-install.ps1 codex
```

## 重要说明

R2 这里镜像的是官方顶层 npm tarball。部分 CLI 的依赖和平台包仍需要 npm registry 解析，安装脚本默认使用 `https://registry.npmmirror.com` 作为 npm registry。

如果要做到完全 R2 自包含，需要额外实现完整 npm registry 代理或按平台生成离线安装包。当前实现优先保证来源是官方包，并降低用户访问 npm 官方源的概率。
