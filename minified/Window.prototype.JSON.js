!function(){"use strict";function a(a){this.line=1,this.col=1,this._tokLen=0,this._str=a}function b(a){this.lex=a}function c(a,b,c){return"undefined"==typeof c?(delete a[b],void 0):(a[b]=c,void 0)}function d(a,b,e){var h,i,j=a[b];if("Array"===f.call(j).slice(8,-1))for(h=0,i=j.length;i>h;h++)c(j,h,d(j,h,e));else if("object"==typeof j)for(h in j)g.call(j,h)&&c(j,h,d(j,h,e));return e.call(a,b,j)}function e(a,b){return a=String(a),a.length>=b?a:new Array(b-a.length+1).join("0")+a}var f=Object.prototype.toString,g=Object.prototype.hasOwnProperty,h="{",i="}",j=":",k="[",l="]",m=",",n={PUNCTUATOR:1,STRING:2,NUMBER:3,BOOLEAN:4,NULL:5},o={"{":1,"}":1,"[":1,"]":1,",":1,":":1,'"':2,t:4,f:4,n:5},p={b:"\b",f:"\f",n:"\n",r:"\r",t:"	",'"':'"',"\\":"\\","/":"/"},q=/^(?:[{}:,\[\]]|true|false|null|"(?:[^"\\\u0000-\u001F]|\\["\\\/bfnrt]|\\u[0-9A-F]{4})*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,r=/^[\t ]+/,s=/^\r?\n/;a.prototype={getNextToken:function(){var a,b,c=this._str;if(this.col+=this._tokLen,!c.length)return"END";if(a=q.exec(c))b=o[a[0].charAt(0)]||n.NUMBER;else{if(a=r.exec(c))return this._tokLen=a[0].length,this._str=c.slice(this._tokLen),this.getNextToken();if(a=s.exec(c))return this._tokLen=0,this._str=c.slice(a[0].length),this.line++,this.col=1,this.getNextToken();this.error("Invalid token")}return this._tokLen=a[0].length,this._str=c.slice(this._tokLen),{type:b,value:a[0]}},error:function(a,b,c){var d=new SyntaxError(a);throw d.line=b||this.line,d.col=c||this.col,d}},b.prototype={parse:function(){var a=this.lex,b=this.getValue();return"END"!==a.getNextToken()&&a.error("Illegal token"),b},getObject:function(){for(var a,b,c,d,e,f={},g=this.lex,h=!1;;){if(a=g.getNextToken(),b=a.value,b===i)return f;h?b===m?(d=g.line,e=g.col-1,a=g.getNextToken(),b=a.value,b===i&&g.error("Invalid trailing comma",d,e)):g.error("Illegal token where expect comma or right curly bracket"):b===m&&g.error("Invalid leading comma"),a.type!=n.STRING&&g.error("Illegal token where expect string property name"),c=this.getString(b),a=g.getNextToken(),b=a.value,b!=j&&g.error("Illegal token where expect colon"),f[c]=this.getValue(),h=!0}},getArray:function(){for(var a,b,c,d,e=[],f=this.lex,g=!1;;){if(a=f.getNextToken(),b=a.value,b===l)return e;g?b===m?(c=f.line,d=f.col-1,a=f.getNextToken(),b=a.value,b===l&&f.error("Invalid trailing comma",c,d)):f.error("Illegal token where expect comma or right square bracket"):b===m&&f.error("Invalid leading comma"),e.push(this.getValue(a)),g=!0}},getString:function(a){return a.slice(1,-1).replace(/\\u?([0-9A-F]{4}|["\\\/bfnrt])/g,function(a,b){return p[b]||String.fromCharCode(parseInt(b,16))})},getValue:function(a){var b=this.lex,c=a||b.getNextToken(),d=c.value;switch(c.type){case n.PUNCTUATOR:if(d===h)return this.getObject();if(d===k)return this.getArray();b.error("Illegal punctoator");break;case n.STRING:return this.getString(d);case n.NUMBER:return Number(d);case n.BOOLEAN:return"true"===d;case n.NULL:return null;default:b.error("Invalid value")}}},Window.prototype.JSON={parse:function(c,e){var f=new b(new a(c)).parse();return"function"==typeof e?d({"":f},"",e):f},stringify:function(){var a,b,c,d,h,i,j=arguments[0],k="function"==typeof arguments[1]?arguments[1]:null,l=arguments[2]||"",m=l?" ":"",n=l?"\n":"",o=f.call(j).slice(8,-1);if(null===j||"Boolean"===o||"Number"===o)return j;if("Array"===o){for(a=[],h=j.length,d=0,i;h>d;++d)i=k?k(d,j[d]):j[d],i=this.stringify(i,k,l),(void 0===i||null===i)&&(i="null"),a.push(i);return"["+n+a.join(","+n).replace(/^/gm,l)+n+"]"}if("Date"===o)return'"'+j.getUTCFullYear()+"-"+e(j.getUTCMonth()+1,2)+"-"+e(j.getUTCDate(),2)+"T"+e(j.getUTCHours(),2)+":"+e(j.getUTCMinutes(),2)+":"+e(j.getUTCSeconds(),2)+"."+e(j.getUTCMilliseconds(),3)+"Z"+'"';if("String"===o)return'"'+j.replace(/"/g,'\\"')+'"';if("object"==typeof j){a=[],c=!1;for(b in j)g.call(j,b)&&(i=k?k(b,j[b]):j[b],i=this.stringify(i,k,l),void 0!==i&&(c=!0,a.push('"'+b+'":'+m+i)));return c?"{"+n+a.join(","+n).replace(/^/gm,l)+n+"}":"{}"}}}}();