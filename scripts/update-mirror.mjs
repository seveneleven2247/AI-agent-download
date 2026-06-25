import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = process.env.MIRROR_DIR
  ? resolve(process.cwd(), process.env.MIRROR_DIR)
  : join(rootDir, 'mirror')

const mirrorBaseUrl = normalizeBaseUrl(
  process.env.PUBLIC_MIRROR_BASE_URL || 'https://example.com/ai-hub-mirror'
)

const tools = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    npm: '@anthropic-ai/claude-code',
    command: 'claude',
    officialUrl: 'https://docs.anthropic.com/en/docs/claude-code/setup'
  },
  {
    id: 'codex',
    label: 'Codex',
    npm: '@openai/codex',
    command: 'codex',
    officialUrl: 'https://github.com/openai/codex/releases/latest'
  },
  {
    id: 'gemini-cli',
    label: 'Gemini CLI',
    npm: '@google/gemini-cli',
    command: 'gemini',
    officialUrl: 'https://github.com/google-gemini/gemini-cli/releases/latest'
  },
  {
    id: 'ccswitch',
    label: 'CCSwitch',
    npm: 'ccswitch',
    command: 'ccswitch',
    officialUrl: 'https://github.com/TomokiMatsubuchi/ccswitch'
  }
]

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const manifest = {
  generatedAt: new Date().toISOString(),
  baseUrl: mirrorBaseUrl,
  source: 'npmjs.org official package metadata',
  tools: []
}

for (const tool of tools) {
  const meta = await readNpmLatest(tool.npm)
  const tarballUrl = meta.dist?.tarball
  if (!tarballUrl) throw new Error(`Missing npm tarball URL for ${tool.npm}`)

  const fileName = decodeURIComponent(tarballUrl.split('/').pop())
  const objectPath = `packages/${tool.id}/${meta.version}/${fileName}`
  const absolutePath = join(outDir, objectPath)
  await downloadFile(tarballUrl, absolutePath)

  const bytes = await readFile(absolutePath)
  const sha256 = createHash('sha256').update(bytes).digest('hex')

  manifest.tools.push({
    id: tool.id,
    label: tool.label,
    npm: tool.npm,
    command: tool.command,
    version: meta.version,
    officialUrl: tool.officialUrl,
    package: {
      fileName,
      path: objectPath,
      url: `${mirrorBaseUrl}/${objectPath}`,
      officialTarball: tarballUrl,
      bytes: bytes.length,
      sha1: meta.dist?.shasum || null,
      sha512: meta.dist?.integrity || null,
      sha256
    },
    engines: meta.engines || null,
    dependencies: Object.keys(meta.dependencies || {}).sort(),
    optionalDependencies: Object.keys(meta.optionalDependencies || {}).sort()
  })
}

await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
await writeFile(join(outDir, 'install.sh'), buildInstallSh(mirrorBaseUrl), { mode: 0o755 })
await writeFile(join(outDir, 'install.ps1'), buildInstallPs1(mirrorBaseUrl))

console.log(`Mirror prepared at ${outDir}`)
for (const tool of manifest.tools) {
  console.log(`${tool.id}: ${tool.version} -> ${tool.package.path}`)
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '')
}

async function readNpmLatest(packageName) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'ai-hub-web-mirror-sync'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

async function downloadFile(url, targetPath) {
  await mkdir(dirname(targetPath), { recursive: true })
  const response = await fetch(url, {
    headers: {
      'user-agent': 'ai-hub-web-mirror-sync'
    }
  })

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`)
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(targetPath))
}

function buildInstallSh(baseUrl) {
  return `#!/usr/bin/env bash
set -euo pipefail

TOOL="\${1:-}"
BASE_URL="\${AI_HUB_MIRROR_BASE_URL:-${baseUrl}}"
REGISTRY="\${NPM_REGISTRY:-https://registry.npmmirror.com}"

if [ -z "\${TOOL}" ]; then
  echo "Usage: curl -fsSL \${BASE_URL}/install.sh | bash -s -- <claude-code|codex|gemini-cli|ccswitch>"
  exit 1
fi

for command in curl node npm; do
  if ! command -v "\${command}" >/dev/null 2>&1; then
    echo "Missing required command: \${command}"
    exit 1
  fi
done

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "\${TMP_DIR}"' EXIT

MANIFEST="\${TMP_DIR}/manifest.json"
curl -fsSL "\${BASE_URL}/manifest.json" -o "\${MANIFEST}"

INFO="$(node - "\${MANIFEST}" "\${TOOL}" "\${BASE_URL}" <<'NODE'
const fs = require('fs')
const path = process.argv[2]
const query = process.argv[3]
const baseUrl = process.argv[4].replace(/\\/+$/, '')
const manifest = JSON.parse(fs.readFileSync(path, 'utf8'))
const tool = manifest.tools.find((item) => item.id === query || item.command === query || item.npm === query)
if (!tool) {
  console.error('Unknown tool: ' + query)
  process.exit(1)
}
console.log(JSON.stringify({
  id: tool.id,
  label: tool.label,
  command: tool.command,
  version: tool.version,
  npm: tool.npm,
  url: baseUrl + '/' + tool.package.path,
  fileName: tool.package.fileName
}))
NODE
)"

PACKAGE_URL="$(node -e "console.log(JSON.parse(process.argv[1]).url)" "\${INFO}")"
FILE_NAME="$(node -e "console.log(JSON.parse(process.argv[1]).fileName)" "\${INFO}")"
LABEL="$(node -e "console.log(JSON.parse(process.argv[1]).label)" "\${INFO}")"
VERSION="$(node -e "console.log(JSON.parse(process.argv[1]).version)" "\${INFO}")"
COMMAND_NAME="$(node -e "console.log(JSON.parse(process.argv[1]).command)" "\${INFO}")"

PACKAGE_PATH="\${TMP_DIR}/\${FILE_NAME}"
echo "Downloading \${LABEL} \${VERSION} from mirror"
curl -fL "\${PACKAGE_URL}" -o "\${PACKAGE_PATH}"

echo "Installing with npm registry: \${REGISTRY}"
npm install -g "\${PACKAGE_PATH}" --registry="\${REGISTRY}"

echo "Installed. Try: \${COMMAND_NAME} --version"
`
}

function buildInstallPs1(baseUrl) {
  return `param(
  [string]$Tool = ""
)

$ErrorActionPreference = "Stop"

$BaseUrl = if ($env:AI_HUB_MIRROR_BASE_URL) { $env:AI_HUB_MIRROR_BASE_URL.TrimEnd("/") } else { "${baseUrl}" }
$Registry = if ($env:NPM_REGISTRY) { $env:NPM_REGISTRY } else { "https://registry.npmmirror.com" }

if ([string]::IsNullOrWhiteSpace($Tool)) {
  Write-Host "Usage: powershell -ExecutionPolicy Bypass -File install.ps1 <claude-code|codex|gemini-cli|ccswitch>"
  exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Missing required command: node"
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "Missing required command: npm"
  exit 1
}

$ManifestUrl = "$BaseUrl/manifest.json"
$Manifest = Invoke-RestMethod -Uri $ManifestUrl
$Entry = $Manifest.tools | Where-Object { $_.id -eq $Tool -or $_.command -eq $Tool -or $_.npm -eq $Tool } | Select-Object -First 1

if (-not $Entry) {
  Write-Host "Unknown tool: $Tool"
  exit 1
}

$TempDir = Join-Path $env:TEMP ("ai-hub-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $TempDir | Out-Null

try {
  $PackageUrl = "$BaseUrl/$($Entry.package.path)"
  $PackagePath = Join-Path $TempDir $Entry.package.fileName

  Write-Host "Downloading $($Entry.label) $($Entry.version) from mirror"
  Invoke-WebRequest -Uri $PackageUrl -OutFile $PackagePath

  Write-Host "Installing with npm registry: $Registry"
  npm install -g $PackagePath --registry=$Registry

  Write-Host "Installed. Try: $($Entry.command) --version"
}
finally {
  Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
}
`
}
