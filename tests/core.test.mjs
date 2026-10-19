// Laboratorio Karnaugh · Copyright (c) 2026 Andres David Suarez Gomez · Licencia MIT (ver LICENSE)
// SPDX-License-Identifier: MIT
//
// Pruebas del núcleo lógico: código Gray y geometría del mapa, minimización
// (correcta en funciones aleatorias y mínima en las 256 funciones de 3
// variables), analizador de ecuaciones, circuitos AND-OR/NAND/NOR/XOR y de
// varias salidas, asignación a integrados, riesgos estáticos y exportación a
// Logisim. Se ejecutan con:  npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { K } from './load-core.mjs';

/* ---------- utilidades ---------- */
// los arreglos creados dentro del sandbox de vm tienen otro prototipo: se copian antes de comparar
const plain = x => JSON.parse(JSON.stringify(x));
const N = n => 1 << n;
const lits = (n, res) => res.constant !== undefined ? 0 : res.terms.reduce((s, p) => s + n - K.popcount(p.m), 0);
const fromList = (n, ones, dcs = []) => { const v = Array(N(n)).fill(0); ones.forEach(i => v[i] = 1); dcs.forEach(i => v[i] = 2); return v; };
/* evalúa la SOP o POS obtenida y la compara con la tabla (las X se ignoran) */
function realizes(n, vals, res) {
  for (let i = 0; i < N(n); i++) {
    if (vals[i] === 2) continue;
    let f;
    if (res.constant !== undefined) f = res.constant;
    else {
      const hit = res.terms.some(p => K.inCube(i, p));
      f = res.form === 'pos' ? (hit ? 0 : 1) : (hit ? 1 : 0);
    }
    if (f !== vals[i]) return false;
  }
  return true;
}
/* generador pseudoaleatorio reproducible */
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
function randomVals(n, r, pX = 0.1) { return Array.from({ length: N(n) }, () => { const x = r(); return x < pX ? 2 : x < 0.55 ? 1 : 0; }); }

/* ---------- código Gray y geometría ---------- */
test('el código Gray cambia un solo bit entre vecinos, incluso al dar la vuelta', () => {
  for (const bits of [1, 2, 3, 4]) {
    const L = N(bits);
    for (let i = 0; i < L; i++) assert.equal(K.popcount(K.gray(i) ^ K.gray((i + 1) % L)), 1);
    for (let i = 0; i < L; i++) assert.equal(K.invGray(K.gray(i)), i);
  }
});

test('cellIndex y cellPos son inversas para mapas de 2 a 6 variables', () => {
  for (let n = 2; n <= 6; n++) {
    const seen = new Set();
    for (let i = 0; i < N(n); i++) {
      const q = K.cellPos(n, i);
      assert.equal(K.cellIndex(n, q.sub, q.r, q.c), i);
      seen.add(`${q.sub},${q.r},${q.c}`);
    }
    assert.equal(seen.size, N(n));
  }
});

/* ---------- minimización ---------- */
test('ejemplo con trampa: ∑m(1,5,6,7,11,12,13,15) no usa el grupo central', () => {
  const vals = fromList(4, [1, 5, 6, 7, 11, 12, 13, 15]);
  const r = K.minimize(4, vals, false);
  assert.ok(realizes(4, vals, r));
  assert.equal(r.terms.length, 4);
  assert.equal(lits(4, r), 12);
  assert.ok(!r.terms.some(p => p.cov.length === 4), 'el bloque m(5,7,13,15) es redundante');
});

test('las condiciones de no importa agrandan los grupos', () => {
  const conX = K.minimize(4, fromList(4, [1, 3, 7, 11, 15], [0, 2, 5]), false);
  const sinX = K.minimize(4, fromList(4, [1, 3, 7, 11, 15]), false);
  assert.ok(lits(4, conX) < lits(4, sinX));
});

test('funciones constantes', () => {
  assert.equal(K.minimize(3, Array(8).fill(0), false).constant, 0);
  assert.equal(K.minimize(3, Array(8).fill(1), false).constant, 1);
  assert.equal(K.minimize(3, Array(8).fill(0), true).constant, 0);
  assert.equal(K.minimize(3, Array(8).fill(1), true).constant, 1);
  assert.equal(K.minimize(3, [1, 2, 2, 1, 2, 1, 1, 2], false).constant, 1);
});

test('SOP y POS reproducen la tabla en funciones aleatorias de 2 a 6 variables', () => {
  const r = rng(2024);
  for (let n = 2; n <= 6; n++) for (let k = 0; k < (n <= 4 ? 80 : 25); k++) {
    const vals = randomVals(n, r);
    for (const pos of [false, true]) {
      const res = K.minimize(n, vals, pos);
      assert.ok(realizes(n, vals, res), `n=${n} ${pos ? 'POS' : 'SOP'} ${vals.join('')}`);
    }
  }
});

test('la cobertura es mínima: comparación exhaustiva con las 256 funciones de 3 variables', () => {
  for (let f = 0; f < 256; f++) {
    const vals = Array.from({ length: 8 }, (_, i) => (f >> i) & 1);
    const res = K.minimize(3, vals, false);
    if (res.constant !== undefined) continue;
    const P = res.primes, req = res.req;
    let best = Infinity;
    for (let mask = 1; mask < (1 << P.length); mask++) {
      const sel = P.filter((_, i) => mask & (1 << i));
      if (!req.every(m => sel.some(p => p.cov.includes(m)))) continue;
      best = Math.min(best, sel.length * 1000 + sel.reduce((s, p) => s + 3 - K.popcount(p.m), 0));
    }
    assert.equal(res.terms.length * 1000 + lits(3, res), best, `f=${f}`);
  }
});

/* ---------- parser de ecuaciones ---------- */
test('el parser acepta las distintas notaciones', () => {
  const names = ['A', 'B', 'C'];
  const same = (a, b) => assert.deepEqual(plain(K.exprToVals(a, 3, names)), plain(K.exprToVals(b, 3, names)), `${a} ≡ ${b}`);
  same("A'B + C", '!A*B + C');
  same("A'B + C", '~a b | c');
  same("A'B + C", 'NOT A AND B OR C');
  same('A ^ B', "AB' + A'B");
  same('A ↑ B', "(AB)'");
  same('A ↓ B', "(A + B)'");
  same('A ⊙ B', "AB + A'B'");
  same("(A + B)'", "A'B'");
  same('A·B', 'AB');
  assert.deepEqual(plain(K.exprToVals('1', 2, ['A', 'B'])), [1, 1, 1, 1]);
});

test('el parser informa errores comprensibles', () => {
  assert.throws(() => K.parseExpr('A + ', ['A', 'B']), /termina antes de tiempo/);
  assert.throws(() => K.parseExpr('(A + B', ['A', 'B']), /paréntesis/);
  assert.throws(() => K.parseExpr('A + Z', ['A', 'B']), /No reconozco/);
  assert.throws(() => K.parseExpr('', ['A']), /Escribe una expresión/);
});

test('parseList ordena, quita repetidos y valida el rango', () => {
  assert.deepEqual(plain(K.parseList('7, 1 3,3; 5', 8)), [1, 3, 5, 7]);
  assert.throws(() => K.parseList('1, 9', 8), /de 0 a 7/);
});

/* ---------- circuitos ---------- */
test('los circuitos AND-OR, NAND y NOR reproducen la tabla de verdad', () => {
  const r = rng(7);
  for (let n = 2; n <= 5; n++) for (let k = 0; k < 20; k++) {
    const vals = randomVals(n, r);
    for (const pos of [false, true]) for (const fam of ['aon', 'nand', 'nor']) for (const maxIn of [2, 4]) {
      const net = K.buildNetlist(n, K.minimize(n, vals, pos), fam, maxIn);
      assert.ok(K.verifyNet(net, n, vals), `n=${n} ${fam} ${maxIn} ${pos ? 'POS' : 'SOP'}`);
    }
  }
});

test('cada compuerta se asigna a un integrado 74xx existente', () => {
  const vals = fromList(4, [0, 1, 2, 5, 6, 7, 8, 9, 10, 14]);
  for (const fam of ['aon', 'nand', 'nor']) for (const maxIn of [2, 4]) {
    const net = K.buildNetlist(4, K.minimize(4, vals, false), fam, maxIn);
    const al = K.allocate(net);
    al.gates.forEach(g => assert.ok(al.where.has(g.id), `compuerta ${g.t} sin integrado`));
    al.chips.forEach(c => assert.ok(K.CHIPS[c.type]));
  }
});

test('detección de XOR y circuito con 74LS86', () => {
  const vals = Array.from({ length: 8 }, (_, i) => K.popcount(i) & 1);
  const x = K.xorForm(3, vals);
  assert.deepEqual([x.mask, x.inv, x.k], [7, 0, 3]);
  assert.ok(K.verifyNet(K.buildXor(3, x.mask, x.inv), 3, vals));
  assert.equal(K.xorForm(3, fromList(3, [0, 1])), null);
});

test('varias salidas: el sumador completo comparte compuertas y se verifica', () => {
  const S = [0, 1, 1, 0, 1, 0, 0, 1], Co = [0, 0, 0, 1, 0, 1, 1, 1];
  const sols = [S, Co].map(v => K.minimize(3, v, false));
  for (const fam of ['aon', 'nand', 'nor']) {
    const net = K.buildMulti(3, sols, fam, 4);
    assert.equal(net.outs.length, 2);
    assert.ok(K.verifyMulti(net, 3, [S, Co]), fam);
  }
});

test('riesgos estáticos: F = AB\' + BC necesita el consenso AC', () => {
  const vals = K.exprToVals("AB' + BC", 3, ['A', 'B', 'C']);
  const res = K.minimize(3, vals, false);
  const h = K.hazards(3, vals, res, res.primes);
  assert.deepEqual(plain(h.pairs), [[5, 7]]);
  assert.equal(K.pattern(3, h.fix[0]), '1–1');
});

/* ---------- exportación ---------- */
test('exportación a Logisim y empaquetado .zip', () => {
  const vals = fromList(4, [0, 1, 2, 5, 6, 7, 8, 9, 10, 14]);
  const net = K.buildNetlist(4, K.minimize(4, vals, false), 'aon', 4);
  const r = K.toLogisim(net, 4, ['A', 'B', 'C', 'D'], ['F']);
  assert.ok(r.ok, 'todas las conexiones se trazaron');
  assert.match(r.xml, /^<\?xml/);
  assert.match(r.xml, /<circuit name="main">/);
  assert.equal((r.xml.match(/name="Pin"/g) || []).length, 5);
  const zip = K.zipStore([{ name: 'f.circ', data: r.xml }]);
  assert.deepEqual([...zip.slice(0, 4)], [0x50, 0x4b, 3, 4]);
});
