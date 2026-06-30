# Cloudflare 部署

这个仓库是纯静态站点，已经同时支持 Cloudflare Workers 静态资源部署和 Cloudflare Pages 部署。

你之前打开的 Cloudflare 控制台链接是 Workers 服务 `aiagentdownload2`，所以默认推荐用 Workers 部署。

## 当前配置

- Workers 服务名：`aiagentdownload2`
- Workers 配置：`wrangler.toml`
- 静态资源目录：`public/`
- Pages 项目名：`aiagentdownload-pages`
- Pages 配置：`wrangler.pages.toml`
- 自定义域名：`elvenzeng.cc.cd`

## 1. Workers 部署

```bash
npm install
npm run deploy
```

这会先执行 `npm run build`，把根目录里的 `index.html`、`styles.css`、`app.js`、`manifest.webmanifest`、`_headers` 和 `assets/` 同步到 `public/`，再执行 `wrangler deploy`。

### Cloudflare Dashboard 里怎么填

如果用 Cloudflare Workers 的 GitHub 自动部署：

```text
Framework preset: None
Install command: npm install
Build command: npm run build
Deploy command: npx wrangler deploy
Root directory: /
```

Workers 会读取根目录的 `wrangler.toml`：

```toml
name = "aiagentdownload2"

[assets]
directory = "./public"
```

## 2. Pages 部署

如果你想继续用 Cloudflare Pages：

```bash
npm install
npm run deploy:pages
```

Cloudflare Pages 的 dashboard 可以这样填：

```text
Framework preset: None
Build command: npm run build
Build output directory: public
Root directory: /
```

## 3. 在 DNSHE 设置解析

在 DNSHE 给 `elvenzeng.cc.cd` 添加一条记录：

```text
记录类型：CNAME
主机记录：@ 或 elvenzeng
记录值：aiagentdownload-pages.pages.dev
TTL：默认
```

如果 DNSHE 当前页面是在管理 `elvenzeng.cc.cd` 这个域名，通常主机记录填 `@`。
如果 DNSHE 当前页面是在管理 `cc.cd`，主机记录填 `elvenzeng`。

## 4. 验证

DNS 生效后执行：

```bash
dig +short CNAME elvenzeng.cc.cd
curl -I https://elvenzeng.cc.cd/
```

期望结果：

- CNAME 返回 `aiagentdownload-pages.pages.dev.`
- `curl` 返回 `HTTP/2 200`
- 响应头里有 `server: cloudflare`

## 注意

`workers.dev` 和 `pages.dev` 域名在中国大陆网络下都不能保证稳定可达。自定义域名只是避开直接访问默认域名，不等于境内 CDN 加速。如果要做真正稳定的中国大陆访问，仍建议使用已备案域名接入境内 CDN，或接入 Cloudflare China Network。
