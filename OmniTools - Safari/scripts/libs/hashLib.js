
function serialize(value, seen = new WeakSet()) {
  if (value === null) return 'null';
  switch (typeof value) {
    case 'undefined': return 'undef';
    case 'number':    return 'n:' + (Object.is(value, -0) ? '-0' : value); // NaN, Infinity тоже ок
    case 'bigint':    return 'b:' + value;
    case 'string':    return 's:' + JSON.stringify(value);
    case 'boolean':   return 'bool:' + value;
    case 'symbol':    return 'sym:' + value.toString();
    case 'function':  return 'f:' + value.toString();
  }

  if (seen.has(value)) return '[Circular]';
  seen.add(value);

  let out;
  if (value instanceof Date)            out = 'd:' + value.getTime();
  else if (value instanceof RegExp)     out = 'r:' + value;
  else if (ArrayBuffer.isView(value))   out = 'ta:' + value.constructor.name + ':' +
                                              Array.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)).join(',');
  else if (value instanceof ArrayBuffer) out = 'ab:' + Array.from(new Uint8Array(value)).join(',');
  else if (Array.isArray(value))        out = '[' + value.map(v => serialize(v, seen)).join(',') + ']';
  else if (value instanceof Set)        out = 'Set{' + [...value].map(v => serialize(v, seen)).sort().join(',') + '}';
  else if (value instanceof Map)        out = 'Map{' + [...value].map(([k, v]) => serialize(k, seen) + '=>' + serialize(v, seen)).sort().join(',') + '}';
  else out = '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + serialize(value[k], seen)).join(',') + '}';

  seen.delete(value); // повторные (не циклические) ссылки допустимы
  return out;
}

// Асинхронный, криптостойкий (SHA-256). Работает в браузере и Node 18+
async function hashAll(...args) {
  const data = new TextEncoder().encode(serialize(args));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Синхронный, быстрый, НЕ криптостойкий (cyrb53, 53 бита)
function hashAllSync(...args) {
  const str = serialize(args);
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}