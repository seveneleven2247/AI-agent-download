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

## R2 自动镜像

仓库包含 `.github/workflows/sync-r2.yml` 和 `scripts/update-mirror.mjs`，可以自动跟踪官方 npm 最新版本，并同步到 Cloudflare R2。

配置方式见 [R2_SYNC.md](./R2_SYNC.md)。

## 浏览器

页面不依赖 Google CDN、外部脚本或外部字体，支持 Chrome、Edge、Safari、Firefox、360、QQ、搜狗、百度、UC 等常见浏览器。
