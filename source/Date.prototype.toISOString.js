// Date.prototype.toISOString
Date.prototype.toISOString = function toISOString() {
	return ((this.getUTCMonth() + 1) / 100 + this.toUTCString() + this * 1).replace(/..(..).+?(\d+)\D+(\d+).(\S+).*(...)/,'$3-$1-$2T$4.$5Z');
};
