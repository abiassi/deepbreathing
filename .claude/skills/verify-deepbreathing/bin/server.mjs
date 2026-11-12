#!/usr/bin/env node
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, openSync, rmSync, existsSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const dir = '.claude/skills/verify-deepbreathing';
const run = `${dir}/run`;
const stateFile = `${run}/server.json`;
const port = 4317;
const command = process.argv[2];
const state = () => JSON.parse(readFileSync(stateFile, 'utf8'));
const identity = pid => { try { return execFileSync('ps', ['-p', String(pid), '-o', 'lstart=', '-o', 'command='], { encoding: 'utf8' }).trim(); } catch { return ''; } };
const owned = s => identity(s.pid) === s.identity && s.identity.includes('next/dist/bin/next');
async function health() {
  const s = state();
  if (!owned(s)) throw Error('Recorded server is no longer the process started by this skill');
  const response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  console.log(`healthy: pid ${s.pid}, port ${port}, HTTP ${response.status}`);
}
if (command === 'launch') {
  mkdirSync(run, { recursive: true });
  if (existsSync(stateFile)) throw Error('Run cleanup before launching again');
  const probe = await import('node:net');
  await new Promise((resolve, reject) => { const server = probe.createServer(); server.once('error', reject); server.listen(port, '127.0.0.1', () => server.close(resolve)); });
  const log = openSync(`${run}/server.log`, 'a');
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-H', '127.0.0.1', '-p', String(port)], { cwd: process.cwd(), detached: true, stdio: ['ignore', log, log], env: { ...process.env, DATABASE_URL: 'postgres://localhost:5432/deepbreathing', BETTER_AUTH_SECRET: 'local-verification-only-secret-32-characters', BETTER_AUTH_URL: `http://localhost:${port}`, NEXT_TELEMETRY_DISABLED: '1' } });
  child.unref();
  await delay(200);
  const id = identity(child.pid);
  if (!id.includes('next/dist/bin/next')) throw Error(`Server failed to start; see ${run}/server.log`);
  writeFileSync(stateFile, JSON.stringify({ pid: child.pid, identity: id }));
  console.log(`launched: pid ${child.pid}, port ${port}`);
  for (let i = 0; i < 60; i++) { try { await health(); process.exit(0); } catch { await delay(1000); } }
  throw Error(`Server did not become healthy; run cleanup and inspect ${run}/server.log`);
} else if (command === 'health') {
  await health();
} else if (command === 'cleanup') {
  if (existsSync(stateFile)) {
    const s = state();
    if (owned(s)) {
      process.kill(-s.pid, 'SIGTERM');
      for (let i = 0; i < 50 && identity(s.pid); i++) await delay(100);
      if (identity(s.pid)) throw Error(`Server ${s.pid} did not exit`);
      console.log(`stopped: pid ${s.pid}`);
    } else if (identity(s.pid)) throw Error(`PID ${s.pid} changed; refusing cleanup`);
    else console.log(`server already stopped: pid ${s.pid}`);
    rmSync(stateFile);
  } else console.log('no recorded server');
} else throw Error('Use launch, health, or cleanup');
