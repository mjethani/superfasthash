/*
 * Copyright 2019 Manish Jethani
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

'use strict';

let crypto = require('crypto');

let { test } = require('tape');

let jsImpl = require('..');
let wasmImpl = require('../wasm');

let randomMessage = () => crypto.randomBytes(Math.ceil(Math.random() * 1000));

(async function () {
  await wasmImpl.initialize();

  test('Benchmark', t => {
    let messages = [];
    for (let i = 0; i < 1e6; i++)
      messages.push(randomMessage());

    let toAlgo =
      label => label.replace(/-/g, '').replace(/ .*/, '').toLowerCase();

    function runBenchmark(label) {
      let hash = null;

      switch (label) {
      case 'SuperFastHash (js)':
        hash = jsImpl.hash;
        break;
      case 'SuperFastHash (wasm)':
        hash = wasmImpl.hash;
        break;
      default:
        hash = message => crypto.Hash(toAlgo(label)).update(message).digest();
      }

      console.time(label);

      for (let message of messages)
        hash(message);

      console.timeEnd(label);

      t.pass('1,000,000 hashes');
    }

    runBenchmark('SuperFastHash (js)');
    runBenchmark('SuperFastHash (wasm)');
    runBenchmark('MD5 (native)');
    runBenchmark('SHA-1 (native)');
    runBenchmark('SHA-256 (native)');
    runBenchmark('RIPEMD-160 (native)');

    t.end();
  });
})();

// vim: et ts=2 sw=2
