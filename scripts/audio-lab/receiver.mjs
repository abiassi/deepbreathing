#!/usr/bin/env node
// Audio lab receiver. Saves WAV uploads from tap.init.js into one directory.
// Usage: node scripts/audio-lab/receiver.mjs <output-dir> [port]
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve(process.argv[2] ?? '');
const port = Number(process.argv[3] ?? 4329);
if (!process.argv[2]) throw Error('Usage: receiver.mjs <output-dir> [port]');
mkdirSync(outputDir, { recursive: true });

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

createServer((request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, cors).end();
    return;
  }
  const name = new URL(request.url, 'http://localhost').searchParams.get('name') ?? '';
  if (request.method !== 'POST' || !/^[a-z0-9-]+\.wav$/.test(name)) {
    response.writeHead(400, cors).end('bad request');
    return;
  }
  const chunks = [];
  request.on('data', (chunk) => chunks.push(chunk));
  request.on('end', () => {
    const file = path.join(outputDir, name);
    writeFileSync(file, Buffer.concat(chunks));
    console.log(`saved ${file}`);
    response.writeHead(200, cors).end('ok');
  });
}).listen(port, '127.0.0.1', () => console.log(`receiver on 127.0.0.1:${port} -> ${outputDir}`));
