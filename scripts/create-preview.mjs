import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const width = 1120
const height = 720
const data = Buffer.alloc((width * 4 + 1) * height)

function color(hex) {
  const value = hex.replace('#', '')
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
    255
  ]
}

function setPixel(x, y, rgba) {
  if (x < 0 || y < 0 || x >= width || y >= height) return
  const row = y * (width * 4 + 1)
  const index = row + 1 + x * 4
  data[index] = rgba[0]
  data[index + 1] = rgba[1]
  data[index + 2] = rgba[2]
  data[index + 3] = rgba[3]
}

function rect(x, y, w, h, fill) {
  const rgba = color(fill)
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      setPixel(xx, yy, rgba)
    }
  }
}

function roundedRect(x, y, w, h, r, fill) {
  const rgba = color(fill)
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      const left = xx - x
      const right = x + w - 1 - xx
      const top = yy - y
      const bottom = y + h - 1 - yy
      const dx = Math.max(r - Math.min(left, right), 0)
      const dy = Math.max(r - Math.min(top, bottom), 0)
      if (dx * dx + dy * dy <= r * r) setPixel(xx, yy, rgba)
    }
  }
}

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, payload) {
  const typeBuffer = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(payload.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, payload])))
  return Buffer.concat([length, typeBuffer, payload, crc])
}

rect(0, 0, width, height, '#eef2f6')
roundedRect(64, 48, 992, 624, 24, '#ffffff')
roundedRect(64, 48, 992, 58, 24, '#f8fafc')
rect(64, 102, 992, 1, '#dbe3ec')

roundedRect(92, 72, 12, 12, 6, '#c24132')
roundedRect(116, 72, 12, 12, 6, '#f6c945')
roundedRect(140, 72, 12, 12, 6, '#1e8a73')
roundedRect(190, 66, 420, 24, 12, '#eef2f6')
roundedRect(208, 73, 260, 8, 4, '#9fb0c1')

roundedRect(98, 130, 88, 42, 8, '#1e8a73')
roundedRect(208, 140, 148, 12, 6, '#18202a')
roundedRect(208, 158, 86, 8, 4, '#697789')
for (let i = 0; i < 5; i += 1) {
  roundedRect(570 + i * 74, 142, 48, 10, 5, '#697789')
}

roundedRect(98, 224, 130, 12, 6, '#1e8a73')
roundedRect(98, 258, 360, 30, 8, '#18202a')
roundedRect(98, 304, 420, 12, 6, '#697789')
roundedRect(98, 326, 360, 12, 6, '#9fb0c1')
roundedRect(98, 374, 152, 42, 8, '#1e8a73')
roundedRect(266, 374, 136, 42, 8, '#f8fafc')
for (let i = 0; i < 6; i += 1) {
  roundedRect(98 + i * 64, 446, 48, 28, 14, '#ffffff')
  roundedRect(110 + i * 64, 456, 24, 8, 4, i % 2 === 0 ? '#1e8a73' : '#697789')
}

roundedRect(604, 182, 382, 310, 16, '#f4f7fa')
roundedRect(632, 212, 140, 14, 7, '#18202a')
roundedRect(632, 244, 230, 10, 5, '#697789')

const cards = [
  [632, 286, '#ffe6e2'],
  [808, 286, '#e6f0ff'],
  [632, 394, '#e7f6ef'],
  [808, 394, '#f3eadf']
]

for (const [x, y, accent] of cards) {
  roundedRect(x, y, 148, 78, 8, '#ffffff')
  roundedRect(x + 16, y + 16, 54, 10, 5, '#18202a')
  roundedRect(x + 16, y + 36, 102, 8, 4, accent)
  roundedRect(x + 16, y + 54, 76, 14, 7, '#1e8a73')
}

roundedRect(98, 536, 888, 86, 12, '#fbfcfd')
for (let i = 0; i < 4; i += 1) {
  const x = 122 + i * 216
  roundedRect(x, 562, 176, 34, 8, '#ffffff')
  roundedRect(x + 18, 574, 92, 10, 5, i === 0 ? '#c24132' : i === 1 ? '#1d5fd1' : i === 2 ? '#1e8a73' : '#8b5e3c')
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(width, 0)
ihdr.writeUInt32BE(height, 4)
ihdr[8] = 8
ihdr[9] = 6
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(data)),
  chunk('IEND', Buffer.alloc(0))
])

writeFileSync(new URL('../assets/web-preview.png', import.meta.url), png)
