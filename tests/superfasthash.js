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

let useWasm = false;

let hash = message => (useWasm ? wasmImpl : jsImpl).hash(message);
let hashText = text => hash(new Uint8ClampedArray([...Buffer.from(text)]));

let randomMessage = () => crypto.randomBytes(Math.ceil(Math.random() * 1000));

(async function () {
  await wasmImpl.initialize();

  test('Hash text', t => {
    function runTests() {
      t.equal(hashText(''), 0);

      t.equal(hashText('Hello, world!'), 1609733543);
      t.equal(hashText('The quick brown fox jumps over the lazy dog.'), -1533272743);

      t.equal(
        hashText(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        ),
        -245091007
      );
    }

    useWasm = false;
    runTests();

    useWasm = true;
    runTests();

    t.end();
  });

  test('Check collisions', t => {
    function runTests() {
      t.ok(hashText('s11000') == hashText('s10018'));
      t.ok(hashText('s99999') == hashText('s98981'));
    }

    useWasm = false;
    runTests();

    useWasm = true;
    runTests();

    t.end();
  });

  test('Compare implementations', t => {
    let failed = false;

    for (let i = 0; i < 1000; i++) {
      let message = randomMessage();

      useWasm = false;
      let jsDigest = hash(message);

      useWasm = true;
      let wasmDigest = hash(message);

      if (jsDigest != wasmDigest) {
        failed = true;
        t.fail(`should match for message ${message.toString('hex')}`);
      }
    }

    if (!failed)
      t.pass('should match');

    t.end();
  });
})();

// vim: et ts=2 sw=2
