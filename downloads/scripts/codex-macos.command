#!/usr/bin/env bash
set -euo pipefail

PACKAGE_NAME="@openai/codex"
BINARY_NAME="codex"
REGISTRY="${NPM_REGISTRY:-https://registry.npmmirror.com}"

if ! command -v npm >/dev/null 2>&1; then
  echo "未检测到 npm。请先安装 Node.js: https://nodejs.org/"
  exit 1
fi

echo "Installing ${PACKAGE_NAME} from ${REGISTRY}"
npm install -g "${PACKAGE_NAME}@latest" --registry="${REGISTRY}"

echo "Verifying ${BINARY_NAME}"
"${BINARY_NAME}" --version || true
echo "完成：${PACKAGE_NAME}"
