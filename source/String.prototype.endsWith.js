// String.prototype.endsWith
String.prototype.endsWith = function(s) {
    var t = String(s);
    var index = this.lastIndexOf(t);
    return index >= 0 && index === this.length - t.length;
};
