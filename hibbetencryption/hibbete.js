const t = require('./hibbett')

function e(t, e, n, i, o) {
    this.stream = t,
    this.header = e,
    this.length = n,
    this.tag = i,
    this.sub = o
  }
e.prototype.typeName = function() {
    if (void 0 == this.tag)
        return "unknown";
    var t = this.tag >> 6
      , e = (this.tag >> 5 & 1,
    31 & this.tag);
    switch (t) {
    case 0:
        switch (e) {
        case 0:
            return "EOC";
        case 1:
            return "BOOLEAN";
        case 2:
            return "INTEGER";
        case 3:
            return "BIT_STRING";
        case 4:
            return "OCTET_STRING";
        case 5:
            return "NULL";
        case 6:
            return "OBJECT_IDENTIFIER";
        case 7:
            return "ObjectDescriptor";
        case 8:
            return "EXTERNAL";
        case 9:
            return "REAL";
        case 10:
            return "ENUMERATED";
        case 11:
            return "EMBEDDED_PDV";
        case 12:
            return "UTF8String";
        case 16:
            return "SEQUENCE";
        case 17:
            return "SET";
        case 18:
            return "NumericString";
        case 19:
            return "PrintableString";
        case 20:
            return "TeletexString";
        case 21:
            return "VideotexString";
        case 22:
            return "IA5String";
        case 23:
            return "UTCTime";
        case 24:
            return "GeneralizedTime";
        case 25:
            return "GraphicString";
        case 26:
            return "VisibleString";
        case 27:
            return "GeneralString";
        case 28:
            return "UniversalString";
        case 30:
            return "BMPString";
        default:
            return "Universal_" + e.toString(16)
        }
    case 1:
        return "Application_" + e.toString(16);
    case 2:
        return "[" + e + "]";
    case 3:
        return "Private_" + e.toString(16)
    }
  }
  ,
  e.prototype.content = function() {
    if (void 0 == this.tag)
        return null;
    var t = this.tag >> 6;
    if (0 != t)
        return null == this.sub ? null : "(" + this.sub.length + ")";
    var e = 31 & this.tag
      , n = this.posContent()
      , i = Math.abs(this.length);
    switch (e) {
    case 1:
        return 0 == this.stream.get(n) ? "false" : "true";
    case 2:
        return this.stream.parseInteger(n, n + i);
    case 3:
        return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(n, n + i);
    case 4:
        return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(n, n + i);
    case 6:
        return this.stream.parseOID(n, n + i);
    case 16:
    case 17:
        return "(" + this.sub.length + " elem)";
    case 12:
        return this.stream.parseStringUTF(n, n + i);
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 26:
        return this.stream.parseStringISO(n, n + i);
    case 23:
    case 24:
        return this.stream.parseTime(n, n + i)
    }
    return null
  }
  ,
  e.prototype.toString = function() {
    return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null == this.sub ? "null" : this.sub.length) + "]"
  }
  ,
  e.prototype.print = function(t) {
    if (void 0 == t && (t = ""),
    document.writeln(t + this),
    null != this.sub) {
        t += "  ";
        for (var e = 0, n = this.sub.length; n > e; ++e)
            this.sub[e].print(t)
    }
  }
  ,
  e.prototype.toPrettyString = function(t) {
    void 0 == t && (t = "");
    var e = t + this.typeName() + " @" + this.stream.pos;
    if (this.length >= 0 && (e += "+"),
    e += this.length,
    32 & this.tag ? e += " (constructed)" : 3 != this.tag && 4 != this.tag || null == this.sub || (e += " (encapsulates)"),
    e += "\n",
    null != this.sub) {
        t += "  ";
        for (var n = 0, i = this.sub.length; i > n; ++n)
            e += this.sub[n].toPrettyString(t)
    }
    return e
  }
  ,
  e.prototype.posStart = function() {
    return this.stream.pos
  }
  ,
  e.prototype.posContent = function() {
    return this.stream.pos + this.header
  }
  ,
  e.prototype.posEnd = function() {
    return this.stream.pos + this.header + Math.abs(this.length)
  }
  ,
  e.decodeLength = function(t) {
    var e = t.get()
      , n = 127 & e;
    if (n == e)
        return n;
    if (n > 3)
        throw "Length over 24 bits not supported at position " + (t.pos - 1);
    if (0 == n)
        return -1;
    e = 0;
    for (var i = 0; n > i; ++i)
        e = e << 8 | t.get();
    return e
  }
  ,
  e.hasContent = function(n, i, o) {
    if (32 & n)
        return !0;
    if (3 > n || n > 4)
        return !1;
    var r = new t(o);
    3 == n && r.get();
    var s = r.get();
    if (s >> 6 & 1)
        return !1;
    try {
        var a = e.decodeLength(r);
        return r.pos - o.pos + a == i
    } catch (c) {
        return !1
    }
  }
  ,
  e.decode = function(n) {
    n instanceof t || (n = new t(n,0));
    var i = new t(n)
      , o = n.get()
      , r = e.decodeLength(n)
      , s = n.pos - i.pos
      , a = null;
    if (e.hasContent(o, r, n)) {
        var c = n.pos;
        if (3 == o && n.get(),
        a = [],
        r >= 0) {
            for (var u = c + r; n.pos < u; )
                a[a.length] = e.decode(n);
            if (n.pos != u)
                throw "Content size is not correct for container starting at offset " + c
        } else
            try {
                for (; ; ) {
                    var l = e.decode(n);
                    if (0 == l.tag)
                        break;
                    a[a.length] = l
                }
                r = c - n.pos
            } catch (h) {
                throw "Exception while decoding undefined length content: " + h
            }
    } else
        n.pos += r;
    return new e(i,s,r,o,a)
  }

  module.exports = e