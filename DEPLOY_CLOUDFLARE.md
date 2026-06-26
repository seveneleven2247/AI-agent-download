# Cloudflare Pages 自定义域名部署

`workers.dev` 在中国大陆网络下不稳定。当前项目改用 Cloudflare Pages 发布静态文件，再用 DNSHE 的 CNAME 把 `elvenzeng.cc.cd` 指向 Pages 项目域名。

## 当前配置

- Pages 项目名：`aiagentdownload-pages`
- 发布目录：`public/`
- Pages 默认域名：`aiagentdownload-pages.pages.dev`
- 自定义域名：`elvenzeng.cc.cd`
- Wrangler 配置：`wrangler.toml`

## 1. 发布到 Cloudflare Pages

```bash
npx wrangler pages deploy --branch=main
```

如果需要显式指定项目：

```bash
npx wrangler pages deploy public --project-name=aiagentdownload-pages --branch=main
```

## 2. 在 DNSHE 设置解析

在 DNSHE 给 `elvenzeng.cc.cd` 添加一条记录：

```text
记录类型：CNAME
主机记录：@ 或 elvenzeng
记录值：aiagentdownload-pages.pages.dev
TTL：默认
```

如果 DNSHE 当前页面是在管理 `elvenzeng.cc.cd` 这个域名，通常主机记录填 `@`。
如果 DNSHE 当前页面是在管理 `cc.cd`，主机记录填 `elvenzeng`。

## 3. 验证

DNS 生效后执行：

```bash
dig +short CNAME elvenzeng.cc.cd
curl -I https://elvenzeng.cc.cd/
```

期望结果：

- CNAME 返回 `aiagentdownload-pages.pages.dev.`
- `curl` 返回 `HTTP/2 200`
- 响应头里有 `server: cloudflare`

## 当前状态

Cloudflare Pages 已经发布成功，并且 `elvenzeng.cc.cd` 已经添加到 Pages 自定义域名里。

现在还差 DNSHE 的 CNAME 记录。Cloudflare 当前给出的状态是：

```text
CNAME record not set
```
