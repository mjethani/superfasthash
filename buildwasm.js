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

let { readFileSync, writeFileSync } = require('fs');

let { main: asc } = require('assemblyscript/cli/asc');
let { minify } = require('uglify-js');

function generateCode(data) {
  return `
    (function () {
      'use strict';

      var binary = ${JSON.stringify([...data])};

      var wasmMemory = null;
      var wasmHash = null;

      var initialized = false;

      Object.defineProperty(exports, "initialized", {
        get: function () {
          return initialized;
        }
      });

      function initialize(options) {
        options = Object.assign({}, { memory: 1 }, options);

        return new Promise(function (resolve, reject) {
          if (initialized) {
            resolve();
            return;
          }

          var memory = new WebAssembly.Memory({ initial: options.memory });
          WebAssembly.instantiate(new Uint8ClampedArray(binary),
                                  { env: { memory: memory } })
          .then(function (module) {
            var instance = module.instance;

            if (instance.exports.memory)
              memory = instance.exports.memory;

            memory.grow(options.memory);

            wasmMemory = new Uint8ClampedArray(memory.buffer);
            wasmHash = instance.exports.hash;

            initialized = true;

            resolve();
          })
          .catch(reject);
        });
      }

      exports.initialize = initialize;

      function hash(message) {
        wasmMemory.set(message);
        return wasmHash(message.length);
      }

      exports.hash = hash;
    })();

    // a75a9bf5a4d15b1bc44cfcd5feede493cfd85b4ba5873c26aa5a3f0fc9cec7a1
  `;
}

(function () {
  let source = readFileSync('src/wasm/superfasthash.ts');

  asc([
    'src/wasm/superfasthash.ts',
    '-b',
    'dist/wasm/superfasthash.wasm',
    '-t',
    'dist/wasm/superfasthash.wat',
    '--validate',
    '-O3'
  ]);

  let data = readFileSync('dist/wasm/superfasthash.wasm');
  let {error, code} = minify(generateCode(data),
                             { output: { comments: 'all' } });

  if (error)
    throw error;

  writeFileSync('dist/wasm/superfasthash.js', code);
})();

// vim: et ts=2 sw=2
