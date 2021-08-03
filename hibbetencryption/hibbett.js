function t(e, n) {
    e instanceof t ? (this.enc = e.enc,
    this.pos = e.pos) : (this.enc = e,
    this.pos = n)
}

t.prototype.get = function(t) {
    if (void 0 == t && (t = this.pos++),
    t >= this.enc.length)
        throw "Requesting byte offset " + t + " on a stream of length " + this.enc.length;
    return this.enc[t]
}
,
t.prototype.hexDigits = "0123456789ABCDEF",
t.prototype.hexByte = function(t) {
    return this.hexDigits.charAt(t >> 4 & 15) + this.hexDigits.charAt(15 & t)
}
,
t.prototype.hexDump = function(t, e) {
    for (var n = "", i = t; e > i; ++i)
        switch (n += this.hexByte(this.get(i)),
        15 & i) {
        case 7:
            n += "  ";
            break;
        case 15:
            n += "\n";
            break;
        default:
            n += " "
        }
    return n
}
,
t.prototype.parseStringISO = function(t, e) {
    for (var n = "", i = t; e > i; ++i)
        n += String.fromCharCode(this.get(i));
    return n
}
,
t.prototype.parseStringUTF = function(t, e) {
    for (var n = "", i = 0, o = t; e > o; ) {
        var i = this.get(o++);
        n += String.fromCharCode(128 > i ? i : i > 191 && 224 > i ? (31 & i) << 6 | 63 & this.get(o++) : (15 & i) << 12 | (63 & this.get(o++)) << 6 | 63 & this.get(o++))
    }
    return n
}
,
t.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/,
t.prototype.parseTime = function(t, e) {
    var n = this.parseStringISO(t, e)
      , i = this.reTime.exec(n);
    return i ? (n = i[1] + "-" + i[2] + "-" + i[3] + " " + i[4],
    i[5] && (n += ":" + i[5],
    i[6] && (n += ":" + i[6],
    i[7] && (n += "." + i[7]))),
    i[8] && (n += " UTC",
    "Z" != i[8] && (n += i[8],
    i[9] && (n += ":" + i[9]))),
    n) : "Unrecognized time: " + n
}
,
t.prototype.parseInteger = function(t, e) {
    var n = e - t;
    if (n > 4) {
        n <<= 3;
        var i = this.get(t);
        if (0 == i)
            n -= 8;
        else
            for (; 128 > i; )
                i <<= 1,
                --n;
        return "(" + n + " bit)"
    }
    for (var o = 0, r = t; e > r; ++r)
        o = o << 8 | this.get(r);
    return o
}
,
t.prototype.parseBitString = function(t, e) {
    var n = this.get(t)
      , i = (e - t - 1 << 3) - n
      , o = "(" + i + " bit)";
    if (20 >= i) {
        var r = n;
        o += " ";
        for (var s = e - 1; s > t; --s) {
            for (var a = this.get(s), c = r; 8 > c; ++c)
                o += a >> c & 1 ? "1" : "0";
            r = 0
        }
    }
    return o
}
,
t.prototype.parseOctetString = function(t, e) {
    var n = e - t
      , i = "(" + n + " byte) ";
    n > 20 && (e = t + 20);
    for (var o = t; e > o; ++o)
        i += this.hexByte(this.get(o));
    return n > 20 && (i += String.fromCharCode(8230)),
    i
}
,
t.prototype.parseOID = function(t, e) {
    for (var n, i = 0, o = 0, r = t; e > r; ++r) {
        var s = this.get(r);
        i = i << 7 | 127 & s,
        o += 7,
        128 & s || (void 0 == n ? n = parseInt(i / 40) + "." + i % 40 : n += "." + (o >= 31 ? "bigint" : i),
        i = o = 0),
        n += String.fromCharCode()
    }
    return n
}

module.exports = t