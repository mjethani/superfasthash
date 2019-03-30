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

/**
 * Returns a 32-bit digest of the given message using the
 * {@link http://www.azillionmonkeys.com/qed/hash.html SuperFastHash}
 * algorithm.
 *
 * @param {Array.<number>|Uint8Array|Uint8ClampedArray} message The message.
 *
 * @returns {number} The 32-bit digest.
 */
function hash(message) {
  let { length } = message;

  if (length == 0)
    return 0;

  let index = 0;
  let digest = length;

  for (let n = length >> 2; n > 0; n--) {
    digest = digest + (message[index++] | message[index++] << 8) >>> 0;
    digest ^= digest << 16 >>> 0 ^
              (message[index++] | message[index++] << 8) << 11;
    digest = digest + (digest >>> 11) >>> 0;
  }

  switch (length & 3) {
  case 3:
    digest = digest + (message[index++] | message[index++] << 8) >>> 0;
    digest ^= digest << 16 >>> 0;
    digest ^= message[index++] << 18;
    digest = digest + (digest >>> 11) >>> 0;
    break;
  case 2:
    digest = digest + (message[index++] | message[index++] << 8) >>> 0;
    digest ^= digest << 11 >>> 0;
    digest = digest + (digest >>> 17) >>> 0;
    break;
  case 1:
    digest = digest + message[index++] >>> 0;
    digest ^= digest << 10 >>> 0;
    digest = digest + (digest >>> 1) >>> 0;
  }

  digest ^= digest << 3 >>> 0;
  digest = digest + (digest >>> 5) >>> 0;
  digest ^= digest << 4 >>> 0;
  digest = digest + (digest >>> 17) >>> 0;
  digest ^= digest << 25 >>> 0;
  digest = digest + (digest >>> 6) >>> 0;

  return digest | 0;
}

exports.hash = hash;

// vim: et ts=2 sw=2
