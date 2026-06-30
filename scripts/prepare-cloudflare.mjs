import { cp, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'public')
const assetEntries = ['index.html', 'styles.css', 'app.js', 'manifest.webmanifest', '_headers', 'assets']

await mkdir(publicDir, { recursive: true })

for (const entry of assetEntries) {
  const source = path.join(rootDir, entry)
  const target = path.join(publicDir, entry)

  try {
    await stat(source)
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new Error(`Missing required Cloudflare asset: ${entry}`)
    }
    throw error
  }

  await cp(source, target, { recursive: true, force: true })
}

console.log(`Prepared Cloudflare assets in ${path.relative(rootDir, publicDir)}/`)
