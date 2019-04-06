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

export function hash(messageLength: u32): u32 {
  let index = 0;
  let digest = messageLength;

  for (let n = messageLength >> 2; n > 0; n--) {
    let value = load<u32>(index);
    index += 4;
    digest += value & 0xFFFF;
    digest ^= digest << 16 ^ (value >> 16) << 11;
    digest += digest >> 11;
  }

  switch (messageLength & 3) {
    case 3:
      digest += load<u16>(index);
      index += 2;
      digest ^= digest << 16;
      digest ^= load<u8>(index++) << 18;
      digest += digest >> 11;
      break;
    case 2:
      digest += load<u16>(index);
      index += 2;
      digest ^= digest << 11;
      digest += digest >> 17;
      break;
    case 1:
      digest += load<u8>(index++);
      digest ^= digest << 10;
      digest += digest >> 1;
  }

  digest ^= digest << 3;
  digest += digest >> 5;
  digest ^= digest << 4;
  digest += digest >> 17;
  digest ^= digest << 25;
  digest += digest >> 6;

  return digest;
}

// vim: et ts=2 sw=2
