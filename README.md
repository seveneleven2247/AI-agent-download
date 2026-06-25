# AI Hub Web

这是一个可以直接发布到 GitHub Pages 的纯静态下载网站，用来分发 CCSwitch、Gemini CLI、Codex 和 Claude Code 的 macOS / Windows 安装脚本。

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

网页 `#downloads` 区域为每个工具提供两个独立下载按钮：

- CCSwitch：macOS 脚本 / Windows 脚本
- Gemini CLI：macOS 脚本 / Windows 脚本
- Codex：macOS 脚本 / Windows 脚本
- Claude Code：macOS 脚本 / Windows 脚本

每个脚本默认使用 `https://registry.npmmirror.com`。用户不需要下载 ZIP，也不需要解压。

## 浏览器

页面不依赖 Google CDN、外部脚本或外部字体，支持 Chrome、Edge、Safari、Firefox、360、QQ、搜狗、百度、UC 等常见浏览器。
