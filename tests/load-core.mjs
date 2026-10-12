// Laboratorio Karnaugh · Copyright (c) 2026 andresdasugo · Licencia MIT (ver LICENSE)
// SPDX-License-Identifier: MIT
//
// Carga el núcleo lógico (objeto K) directamente desde index.html,
// para que las pruebas usen exactamente el mismo código que ve el estudiante.
// Busca el <script> que contiene el núcleo y lo ejecuta en un contexto aislado
// de Node.js (vm), donde el núcleo se exporta con module.exports.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const html = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const core = scripts.find(s => s.includes('Núcleo lógico del Laboratorio Karnaugh'));
if (!core) throw new Error('No se encontró el núcleo lógico en index.html');

const sandbox = { module: { exports: {} }, TextEncoder };
vm.runInNewContext(core, sandbox, { filename: 'index.html#core' });

export const K = sandbox.module.exports;
