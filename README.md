# AI Hub Web

这是一个可以直接发布到 GitHub Pages 的纯静态下载网站，用来提供 CCSwitch、Gemini CLI、Codex 和 Claude Code 的官方正版下载入口。

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

网页 `#downloads` 区域为每个工具提供官方来源按钮：

- CCSwitch：官方 npm 包 / 官方页面
- Gemini CLI：官方 npm 包 / 官方 Release
- Codex：官方 npm 包 / 官方 Release
- Claude Code：官方 npm 包 / 官方说明

网页本身不安装软件，也不提供自制脚本。点击下载按钮会跳转到官方源下载原始发布包。

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
