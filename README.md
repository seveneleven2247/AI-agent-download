# AI Hub Web

这是一个可以直接发布到 GitHub Pages、Cloudflare Pages 或 Cloudflare Workers 静态资源的纯静态下载网站，用来提供 CCSwitch、Gemini CLI、Codex 和 Claude Code 的下载入口。

页面不依赖外部 CDN、外部字体或外部脚本；下载和安装命令优先使用 `https://registry.npmmirror.com`，官方 npm 源作为备用。

## 上传到 GitHub

1. 在 GitHub 新建一个仓库，例如 `ai-hub-web`。
2. 把这个 `github-pages/` 目录里的所有文件上传到仓库根目录。
3. 打开仓库的 `Settings` -> `Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main` 和 `/root`，然后保存。

发布后，GitHub 会生成一个网址，通常是：

```text
https://你的用户名.github.io/仓库名/
```

## 下载区

网页 `#downloads` 区域为每个工具提供国内镜像优先按钮：

- CCSwitch：npmmirror npm 包 / 官方 npm 备用
- Gemini CLI：npmmirror npm 包 / 官方 npm 备用
- Codex：npmmirror npm 包 / 官方 npm 备用
- Claude Code：npmmirror npm 包 / 官方 npm 备用

网页本身不安装软件，也不提供自制脚本。点击国内镜像按钮会跳转到 npmmirror 下载 npm 发布包。

## 中国大陆优先安装

推荐直接在终端使用国内 npm 源安装：

```bash
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com
npm install -g @openai/codex --registry=https://registry.npmmirror.com
npm install -g @google/gemini-cli --registry=https://registry.npmmirror.com
npm install -g ccswitch --registry=https://registry.npmmirror.com
```

这些命令只能解决 npm 下载问题。Claude、Codex、Gemini 登录和模型调用仍取决于对应官方服务在用户当前网络下是否可访问。

## Cloudflare 国内访问说明

如果使用 `https://aiagentdownload.elvenzeng.workers.dev/`，代码层面已经做到：

- 静态 HTML/CSS/JS，无外部 CDN 依赖。
- 下载链接优先指向 `registry.npmmirror.com`。
- 安装命令显式指定 `--registry=https://registry.npmmirror.com`。

但 `workers.dev` 域名本身在中国大陆网络下不能保证稳定可达。要做真正稳定的中国大陆访问，建议二选一：

- 使用已备案域名接入 Cloudflare China Network；这是 Cloudflare 面向中国大陆节点交付的正式方案。
- 同步部署一份到境内静态托管/CDN，例如阿里云 OSS + CDN、腾讯云 COS + CDN、七牛云 CDN，并使用备案域名访问。

如果必须继续使用同一个 `workers.dev` 地址，只能优化页面资源和下载源，不能保证所有中国大陆运营商都能打开这个域名。

## 在终端输入什么打开

安装完成后，打开终端，先进入你要处理的项目文件夹：

```bash
cd ~/你的项目目录
```

然后输入对应命令打开：

| 工具 | 启动命令 | 说明 |
| --- | --- | --- |
| Claude Code | `claude` | 进入项目目录后运行，首次启动按提示登录 |
| Codex | `codex` | 进入代码仓库后运行，按提示登录或配置账号 |
| Gemini CLI | `gemini` | 进入项目目录后运行，也可以用 `gemini -p` 发送一次性问题 |
| CCSwitch | `ccswitch init` / `ccswitch switch` | 不是 AI Agent，用于初始化和切换 Claude Code 配置 |

Windows PowerShell 进入项目目录的示例：

```powershell
cd "C:\Users\你的用户名\你的项目目录"
```

如果终端提示 `command not found` 或“不是内部或外部命令”，说明工具还没有安装成功，或 npm 全局命令目录没有加入 PATH。

## R2 自动镜像

仓库包含 `.github/workflows/sync-r2.yml` 和 `scripts/update-mirror.mjs`，可以自动跟踪官方 npm 最新版本，并同步到 Cloudflare R2。

配置方式见 [R2_SYNC.md](./R2_SYNC.md)。

## 浏览器

页面不依赖 Google CDN、外部脚本或外部字体，支持 Chrome、Edge、Safari、Firefox、360、QQ、搜狗、百度、UC 等常见浏览器。
