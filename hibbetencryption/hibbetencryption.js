const sjcl = require('sjcl')
const e = require('./hibbete')
const Z = require('./hibbetz')
const forge = require('node-forge')

const et = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
const ct = "0123456789abcdefghijklmnopqrstuvwxyz"
const nt = "="
const pubKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAoUID6FPckCjF4YHm8x7pDfoM0YeDx2ZPfdaVs7neGJWHnwYVZpj6X+hg5r8hqazHmFjonN3/SA0CahnN+MLPr4E6cAdUF1eTQnzVfqNVq3lKxYk0twT4Yv7X4oQ2EHYmisFm1A97ujgRwQ5xsbYRHgACe8US1X5S3c7pJDLcM1Ssjr4R3x3/F2e5T7+pWlG/J+tvLRyTvyPuv21KR/ZePHExO1jQ+HYf3gMh1eZfdj2jAPnfPbUSORbOKZtFms8B8ojuGPiSOr5hmBt7gy4UyJDR6tlxhpodqEOpqTv2WfZ/dRoNukETa65eZ0jnmQKnIdXRsNMFUqEF5A4cNVrLhHujwxsOXm5vIeOOWmG/HM8wnltETOF7Fdjs/cXVOicM3d09xL3ePCLe671YjSSb7T7oo/cCI5nK1xzPkQX9q+Yb3OvhoFlF3Mebf94L8te9GCUqt7Dk5Ukrnfn+G53CwH4jeuln2/8lVbE3XFVYT342IGOHpJ+XNbRd9CUTqIH8ESsK0DFeVR3qVCq4zJfQJ9UAKy6tWOHmijIPhpOijWNVgh+HTKUxoloWs3PSWUkOBJUZX4EYUThphCCf8Cedvf2nY0XNwWAmb4FDele8H4/J/NaNFYm/hWK7+Y+DIrL37rLrIb/hjHL1UqaK8osbXQkfohnFVw/pDCuXNemDvJkCAwEAAQ=="



// **********************************************SJCL CHANGES**********************************************
sjcl.mode.cbc = {
  name: "cbc",
  encrypt: function(t, e, n, i) {
      if (i && i.length)
          throw new sjcl.exception.invalid("cbc can't authenticate data");
      if (128 !== sjcl.bitArray.bitLength(n))
          throw new sjcl.exception.invalid("cbc iv must be 128 bits");
      var o, r = sjcl.bitArray, s = r._xor4, a = r.bitLength(e), c = 0, u = [];
      if (7 & a)
          throw new sjcl.exception.invalid("pkcs#5 padding only works for musjcliples of a byte");
      for (o = 0; a >= c + 128; o += 4,
      c += 128)
          n = t.encrypt(s(n, e.slice(o, o + 4))),
          u.splice(o, 0, n[0], n[1], n[2], n[3]);
      return a = 16843009 * (16 - (a >> 3 & 15)),
      n = t.encrypt(s(n, r.concat(e, [a, a, a, a]).slice(o, o + 4))),
      u.splice(o, 0, n[0], n[1], n[2], n[3]),
      u
  },
  decrypt: function(t, e, n, i) {
      if (i && i.length)
          throw new sjcl.exception.invalid("cbc can't authenticate data");
      if (128 !== sjcl.bitArray.bitLength(n))
          throw new sjcl.exception.invalid("cbc iv must be 128 bits");
      if (127 & sjcl.bitArray.bitLength(e) || !e.length)
          throw new sjcl.exception.corrupt("cbc ciphertext must be a positive musjcliple of the block size");
      var o, r, s, a = sjcl.bitArray, c = a._xor4, u = [];
      for (i = i || [],
      o = 0; o < e.length; o += 4)
          r = e.slice(o, o + 4),
          s = c(n, t.decrypt(r)),
          u.splice(o, 0, s[0], s[1], s[2], s[3]),
          n = r;
      if (r = 255 & u[o - 1],
      0 == r || r > 16)
          throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
      if (s = 16843009 * r,
      !a.equal(a.bitSlice([s, s, s, s], 0, 8 * r), a.bitSlice(u, 32 * u.length - 8 * r, 32 * u.length)))
          throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
      return a.bitSlice(u, 0, 32 * u.length - 8 * r)
  }
}

sjcl.bitArray._xor4 = function(t, e) {
  return [t[0] ^ e[0], t[1] ^ e[1], t[2] ^ e[2], t[3] ^ e[3]]
}


// **********************************************HELPER FUNCTIONS**********************************************

function o(t) {
  var e, n = i(t), o = new Array;
  for (e = 0; 2 * e < n.length; ++e)
      o[e] = parseInt(n.substring(2 * e, 2 * e + 2), 16);
  return o
}

function i(t) {
  var e, n, i, o = "", r = 0;
  for (e = 0; e < t.length && t.charAt(e) != nt; ++e)
      i = et.indexOf(t.charAt(e)),
      0 > i || (0 == r ? (o += ct.charAt(i >> 2),
      n = 3 & i,
      r = 1) : 1 == r ? (o += ct.charAt(n << 2 | i >> 4),
      n = 15 & i,
      r = 2) : 2 == r ? (o += ct.charAt(n),
      o += ct.charAt(i >> 2),
      n = 3 & i,
      r = 3) : (o += ct.charAt(n << 2 | i >> 4),
      o += ct.charAt(15 & i),
      r = 0));
  return 1 == r && (o += ct.charAt(n << 2)),
  o
}

c = function(t) {
    var e, n, i, o, r = [];
    if ("INTEGER" === t.typeName() && (e = t.posContent(),
    n = t.posEnd(),
    i = t.stream.hexDump(e, n).replace(/[ \n]/g, ""),
    r.push(i)),
    null !== t.sub)
        for (o = 0; o < t.sub.length; o++)
            r = r.concat(c(t.sub[o]));
    return r
}

function n(t) {
  var e, n, i = "";
  for (e = 0; e + 3 <= t.length; e += 3)
      n = parseInt(t.substring(e, e + 3), 16),
      i += et.charAt(n >> 6) + et.charAt(63 & n);
  for (e + 1 == t.length ? (n = parseInt(t.substring(e, e + 1), 16),
  i += et.charAt(n << 2)) : e + 2 == t.length && (n = parseInt(t.substring(e, e + 2), 16),
  i += et.charAt(n >> 2) + et.charAt((3 & n) << 4)); (3 & i.length) > 0; )
      i += nt;
  return i
}


// **********************************************MAIN FUNCTIONS**********************************************

generateAesKey = function() {
  return {
      key: sjcl.random.randomWords(8, 0),
      encrypt: function(t) {
          return this.encryptWithIv(t, sjcl.random.randomWords(4, 0))
      },
      encryptWithIv: function(t, e) {
          var n = new sjcl.cipher.aes(this.key)
            , i = sjcl.codec.utf8String.toBits(t)
            , o = sjcl.mode.cbc.encrypt(n, i, e)
            , r = sjcl.bitArray.concat(e, o);
          return sjcl.codec.base64.fromBits(r)
      }
  }
}

l = function(pubKey) {
  var n, i, r, s, a, u;
  try {
    a = o(pubKey)  
    n = e.decode(a)
  } catch (l) {
    console.log(l)
    // throw "Invalid encryption key. Please use the key labeled 'Client-Side Encryption Key'"
  }
  if (r = c(n),
  2 !== r.length)
      throw "Invalid encryption key. Please use the key labeled 'Client-Side Encryption Key'";
  return s = r[0],
  i = r[1],
  u = new Z,
  u.setPublic(s, i),
  u
}

h = function() {
  return {
      key: sjcl.random.randomWords(8, 0),
      sign: function(t) {
          var e = new sjcl.misc.hmac(this.key,sjcl.hash.sha256)
            , n = e.encrypt(t);
          return sjcl.codec.base64.fromBits(n)
      }
  }
}

encrypt = function(t) {
  var e = l(pubKey)
    , o = generateAesKey()
    , r = h()
    , s = o.encrypt(t)
    , a = r.sign(sjcl.codec.base64.toBits(s))
    , c = sjcl.bitArray.concat(o.key, r.key)
    , u = sjcl.codec.base64.fromBits(c)
    , p = e.encrypt(u)
    , f = "$bt4|javascript_" + '1_3_10' + "$"
    , d = null;
  return p && (d = n(p)),
  f + d + "$" + s + "$" + a
}

const f = encrypt("4111111111111")      

console.log(f)