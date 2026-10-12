// Laboratorio Karnaugh · Copyright (c) 2026 andresdasugo · Licencia MIT (ver LICENSE)
// SPDX-License-Identifier: MIT
//
// Pruebas de la exportación a VHDL, Verilog, C y Python: genera el diseño y su banco
// de prueba (testbench) y los ejecuta con la herramienta real de cada lenguaje.
// Si una herramienta no está instalada, sus pruebas se omiten.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { K } from './load-core.mjs';

const has = (cmd, flag = '--version') => spawnSync(cmd, [flag], { encoding: 'utf8' }).status === 0;
const TOOLS = { vhdl: has('ghdl'), v: has('iverilog', '-V') && has('vvp', '-V'), c: has('gcc'), py: has('python3') };

/* ejecuta diseño + testbench; devuelve { ok, out } */
function simulate(lang, spec) {
  const dir = mkdtempSync(join(tmpdir(), 'karnaugh-')), e = spec.entity;
  const run = (cmd, args) => spawnSync(cmd, args, { cwd: dir, encoding: 'utf8', timeout: 60000 });
  try {
    let r;
    if (lang === 'vhdl') {
      writeFileSync(join(dir, `${e}.vhd`), K.designCode('vhdl', spec));
      writeFileSync(join(dir, `${e}_tb.vhd`), K.testbench('vhdl', spec));
      for (const args of [['-a', `${e}.vhd`, `${e}_tb.vhd`], ['-e', `${e}_tb`], ['-r', `${e}_tb`]]) {
        r = run('ghdl', args);
        if (r.status !== 0) return { ok: false, out: r.stdout + r.stderr };
      }
    } else if (lang === 'v') {
      writeFileSync(join(dir, `${e}.v`), K.designCode('v', spec));
      writeFileSync(join(dir, `${e}_tb.v`), K.testbench('v', spec));
      r = run('iverilog', ['-Wall', '-o', 'sim', `${e}.v`, `${e}_tb.v`]);
      if (r.status !== 0) return { ok: false, out: r.stdout + r.stderr };
      r = run('vvp', ['-n', 'sim']);
    } else if (lang === 'c') {
      writeFileSync(join(dir, `${e}_tb.c`), K.testbench('c', spec));
      r = run('gcc', ['-std=c99', '-Wall', '-Werror', `${e}_tb.c`, '-o', 'tb']);
      if (r.status !== 0) return { ok: false, out: r.stdout + r.stderr };
      r = run(join(dir, 'tb'), []);
    } else {
      writeFileSync(join(dir, `${e}_tb.py`), K.testbench('py', spec));
      r = run('python3', [`${e}_tb.py`]);
    }
    const out = r.stdout + r.stderr;
    return { ok: r.status === 0 && out.includes('Prueba superada') && !out.includes('ERROR'), out };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
const NAMES = ['A', 'B', 'C', 'D', 'E', 'F'];
const single = (n, vals, pos, names = NAMES) => ({ n, entity: 'funcion_k', title: 'Prueba', ins: names.slice(0, n),
  outs: [{ name: 'F', sol: K.minimize(n, vals, pos), vals }] });

/* casos: funciones aleatorias de 2 a 6 variables con X, en SOP y POS */
const r = rng(99), CASES = [];
for (let n = 2; n <= 6; n++) for (const pos of [false, true]) {
  const vals = Array.from({ length: 1 << n }, () => { const x = r(); return x < 0.12 ? 2 : x < 0.55 ? 1 : 0; });
  CASES.push({ label: `${n} variables, ${pos ? 'POS' : 'SOP'}`, spec: single(n, vals, pos) });
}
/* 6 variables: la entrada F choca con el nombre de la salida */
CASES.push({ label: 'entrada llamada F (6 variables)', spec: single(6, Array.from({ length: 64 }, (_, i) => (i * 7) % 3 === 0 ? 1 : 0), false) });
/* nombres que son palabras reservadas en algún lenguaje */
CASES.push({ label: 'nombres reservados (in, end, int, def)', spec: single(4, K.exprToVals("in·end + int'·def", 4, ['in', 'end', 'int', 'def']), false, ['in', 'end', 'int', 'def']) });
/* funciones constantes */
CASES.push({ label: 'constante 1', spec: single(3, Array(8).fill(1), false) });
CASES.push({ label: 'constante 0', spec: single(3, Array(8).fill(0), true) });
/* varias salidas: sumador completo y BCD a 7 segmentos (10 a 15 son X) */
const S = [0, 1, 1, 0, 1, 0, 0, 1], Co = [0, 0, 0, 1, 0, 1, 1, 1];
CASES.push({ label: 'sumador completo (2 salidas)', spec: { n: 3, entity: 'circuito_k', title: 'Sumador completo', ins: ['A', 'B', 'Ci'],
  outs: [{ name: 'S', sol: K.minimize(3, S, false), vals: S }, { name: 'Co', sol: K.minimize(3, Co, false), vals: Co }] } });
const SEG7 = ['1111110', '0110000', '1101101', '1111001', '0110011', '1011011', '1011111', '1110000', '1111111', '1111011'];
const segOuts = 'abcdefg'.split('').map((name, k) => { const vals = [...Array(16)].map((_, i) => i < 10 ? +SEG7[i][k] : 2); return { name, sol: K.minimize(4, vals, true), vals }; });
CASES.push({ label: 'BCD a 7 segmentos (7 salidas, POS)', spec: { n: 4, entity: 'circuito_k', title: 'BCD a 7 segmentos (cátodo común)', ins: ['A', 'B', 'C', 'D'], outs: segOuts } });

const LANGS = { vhdl: 'VHDL (GHDL)', v: 'Verilog (Icarus)', c: 'C (gcc)', py: 'Python' };
for (const [lang, tool] of Object.entries(LANGS)) {
  test(`${tool}: el testbench pasa con el diseño exportado`, { skip: !TOOLS[lang] && `${tool} no está instalado` }, () => {
    for (const c of CASES) {
      const res = simulate(lang, c.spec);
      assert.ok(res.ok, `${c.label}\n${res.out}`);
    }
  });
  test(`${tool}: el testbench detecta un error en la tabla esperada`, { skip: !TOOLS[lang] && `${tool} no está instalado` }, () => {
    const vals = K.exprToVals("A'B + CD", 4, NAMES);
    const spec = single(4, vals, false);
    spec.outs[0].vals = vals.map((v, i) => i === 5 ? 1 - v : v);   // fila 5 alterada
    const res = simulate(lang, spec);
    assert.ok(!res.ok, 'el testbench debió fallar');
    assert.match(res.out, /Fila 5/);
  });
}

test('identificadores válidos y únicos en cada lenguaje', () => {
  const ids = K.idents(['in', 'F', 'end', 'k_i', 'F'], 'vhdl');
  assert.deepEqual(JSON.parse(JSON.stringify(ids)), ['in_s', 'F', 'end_s', 'k_i_s', 'F_out']);
  assert.deepEqual(JSON.parse(JSON.stringify(K.idents(['Ñu', '2x', 'not'], 'py'))), ['Nu', 'X2x', 'not_s']);
});

test('vector de prueba de Logisim', () => {
  const vals = [1, 0, 2, 1];
  const v = K.logisimVector({ n: 2, title: 'x', outs: [{ name: 'F', vals }] }, ['A', 'B'], ['F']);
  const lines = v.trim().split('\n').filter(l => !l.startsWith('#'));
  assert.deepEqual(lines, ['A B F', '0 0 1', '0 1 0', '1 0 x', '1 1 1']);
});
