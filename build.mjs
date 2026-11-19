import { cp, mkdir, rm } from 'node:fs/promises';
await rm('www', { recursive: true, force: true });
await mkdir('www', { recursive: true });
await cp('index.html', 'www/index.html');
await cp('src', 'www/src', { recursive: true });
await cp('assets', 'www/assets', { recursive: true });
await cp('privacy-policy.html', 'www/privacy-policy.html');
console.log('Web assets prepared in www/');