const forge = require('node-forge')
const sjcl = require('sjcl')

function Z() {
    this.n = null,
    this.e = 0,
    this.d = null,
    this.p = null,
    this.q = null,
    this.dmp1 = null,
    this.dmq1 = null,
    this.coeff = null
}

function X(t, e) {
    if (!(null != t && null != e && t.length > 0 && e.length > 0))
        throw new Error("Invalid RSA public key");
    this.n = K(t, 16),
    this.e = parseInt(e, 16)
}

function K(t, e) {
    return new forge.jsbn.BigInteger(t,e)
}

function $(t) {
    return t.modPowInt(this.e, this.n)
}
function J(t) {
    var e = Q(t, this.n.bitLength() + 7 >> 3);
    if (null == e)
        return null;
    var n = this.doPublic(e);
    if (null == n)
        return null;
    var i = n.toString(16);
    return 0 == (1 & i.length) ? i : "0" + i
}

function Q(t, e) {
    if (e < t.length + 11)
        throw new Error("Message too long for RSA");
    for (var n = new Array, i = t.length - 1; i >= 0 && e > 0; ) {
        var o = t.charCodeAt(i--);
        128 > o ? n[--e] = o : o > 127 && 2048 > o ? (n[--e] = 63 & o | 128,
        n[--e] = o >> 6 | 192) : (n[--e] = 63 & o | 128,
        n[--e] = o >> 6 & 63 | 128,
        n[--e] = o >> 12 | 224)
    }
    n[--e] = 0;
    for (var s = 0, a = 0, c = 0; e > 2; )
        0 == c && (a = sjcl.random.randomWords(1, 0)[0]),
        s = a >> c & 255,
        c = (c + 8) % 32,
        0 != s && (n[--e] = s);
    return n[--e] = 2,
    n[--e] = 0,
    new forge.jsbn.BigInteger(n)
  }

Z.prototype.doPublic = $,
Z.prototype.setPublic = X,
Z.prototype.encrypt = J;


module.exports = Z