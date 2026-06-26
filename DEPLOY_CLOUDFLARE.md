# Cloudflare 自定义域名部署

`ai.ziikoo.com` 能在国内直接打开，关键做法是使用自己的域名接入 Cloudflare，而不是直接暴露默认的 `*.workers.dev` 域名。

本项目已经配置为 Cloudflare Workers 静态资源项目：

- 发布目录：`public/`
- Wrangler 配置：`wrangler.toml`
- 默认 Worker 名称：`aiagentdownload`

## 1. 准备域名

你需要一个真实域名，并且这个域名要已经添加到 Cloudflare。例如：

```text
aiagentdownload.example.com
```

如果你还没有域名，不能复制 `ai.ziikoo.com` 的方式；`aiagentdownload.elvenzeng.workers.dev` 仍然是默认 `workers.dev` 地址，在中国大陆不能保证稳定可达。

## 2. 登录 Cloudflare

```bash
npx wrangler login
```

登录成功后确认账号：

```bash
npx wrangler whoami
```

## 3. 绑定自定义域名

打开 `wrangler.toml`，把最后的示例改成你的真实域名：

```toml
[[routes]]
pattern = "aiagentdownload.example.com"
custom_domain = true
```

注意：这个域名不能已有冲突的 CNAME 记录。

## 4. 部署

```bash
npx wrangler deploy
```

部署成功后，Cloudflare 会自动创建 DNS 记录并签发证书。

## 5. 验证

```bash
curl -I https://aiagentdownload.example.com/
dig +short aiagentdownload.example.com
```

如果返回头里有 `server: cloudflare`，并且 DNS 返回 Cloudflare IP，说明部署方式已经和 `ai.ziikoo.com` 类似。

## 当前验证结果

我检查到：

- `ai.ziikoo.com` 返回 `server: cloudflare`、`cf-cache-status: HIT`。
- `ai.ziikoo.com` DNS 返回 Cloudflare Anycast IP。
- `aiagentdownload.elvenzeng.workers.dev` 在当前网络下请求超时。

结论：需要换成 Cloudflare 自定义域名，不能继续依赖 `workers.dev`。
