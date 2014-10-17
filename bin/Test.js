(function ($hx_exports) { "use strict";
$hx_exports.pgr = $hx_exports.pgr || {};
$hx_exports.pgr.dconsole = $hx_exports.pgr.dconsole || {};
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.lastIndexOf = function(a,obj,i) {
	var len = a.length;
	if(i >= len) i = len - 1; else if(i < 0) i += len;
	while(i >= 0) {
		if(a[i] === obj) return i;
		i--;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = ["IntIterator"];
IntIterator.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIterator
};
var Main = $hx_exports.Main = function() { };
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	haxe.Log.trace = function(v,inf) {
		pgr.dconsole.DC.log(v);
	};
};
Main.init = function() {
	pgr.dconsole.DC.init();
	pgr.dconsole.DC["eval"]("help");
};
Main.runCode = function() {
};
var _Map = {};
_Map.Map_Impl_ = function() { };
$hxClasses["_Map.Map_Impl_"] = _Map.Map_Impl_;
_Map.Map_Impl_.__name__ = ["_Map","Map_Impl_"];
_Map.Map_Impl_._new = null;
_Map.Map_Impl_.set = function(this1,key,value) {
	this1.set(key,value);
};
_Map.Map_Impl_.get = function(this1,key) {
	return this1.get(key);
};
_Map.Map_Impl_.exists = function(this1,key) {
	return this1.exists(key);
};
_Map.Map_Impl_.remove = function(this1,key) {
	return this1.remove(key);
};
_Map.Map_Impl_.keys = function(this1) {
	return this1.keys();
};
_Map.Map_Impl_.iterator = function(this1) {
	return this1.iterator();
};
_Map.Map_Impl_.toString = function(this1) {
	return this1.toString();
};
_Map.Map_Impl_.arrayWrite = function(this1,k,v) {
	this1.set(k,v);
	return v;
};
_Map.Map_Impl_.toStringMap = function(t) {
	return new haxe.ds.StringMap();
};
_Map.Map_Impl_.toIntMap = function(t) {
	return new haxe.ds.IntMap();
};
_Map.Map_Impl_.toEnumValueMapMap = function(t) {
	return new haxe.ds.EnumValueMap();
};
_Map.Map_Impl_.toObjectMap = function(t) {
	return new haxe.ds.ObjectMap();
};
_Map.Map_Impl_.fromStringMap = function(map) {
	return map;
};
_Map.Map_Impl_.fromIntMap = function(map) {
	return map;
};
_Map.Map_Impl_.fromObjectMap = function(map) {
	return map;
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,toString: null
	,__class__: IMap
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		Reflect.setField(o2,f,Reflect.field(o,f));
	}
	return o2;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
};
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,get_length: function() {
		return this.b.length;
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,toString: function() {
		return this.b;
	}
	,__class__: StringBuf
	,__properties__: {get_length:"get_length"}
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = s + c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.isEof = function(c) {
	return c != c;
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
ValueType.__empty_constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown];
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		return false;
	}
	return true;
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
Type.enumIndex = function(e) {
	return e[1];
};
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
var haxe = {};
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.__empty_constructs__ = [haxe.StackItem.CFunction];
haxe.CallStack = function() { };
$hxClasses["haxe.CallStack"] = haxe.CallStack;
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe.CallStack.exceptionStack = function() {
	return [];
};
haxe.CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe.CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe.CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe.CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe.CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
};
haxe.Log = function() { };
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
};
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.ds = {};
haxe.ds.BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe.ds.BalancedTree;
haxe.ds.BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe.ds.BalancedTree.prototype = {
	root: null
	,set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,remove: function(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( e ) {
			if( js.Boot.__instanceof(e,String) ) {
				return false;
			} else throw(e);
		}
	}
	,exists: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return true; else if(c < 0) node = node.left; else node = node.right;
		}
		return false;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,keys: function() {
		var ret = [];
		this.keysLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,removeLoop: function(k,node) {
		if(node == null) throw "Not_found";
		var c = this.compare(k,node.key);
		if(c == 0) return this.merge(node.left,node.right); else if(c < 0) return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right); else return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,keysLoop: function(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	,merge: function(t1,t2) {
		if(t1 == null) return t2;
		if(t2 == null) return t1;
		var t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	,minBinding: function(t) {
		if(t == null) throw "Not_found"; else if(t.left == null) return t; else return this.minBinding(t.left);
	}
	,removeMinBinding: function(t) {
		if(t.left == null) return t.right; else return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,toString: function() {
		return "{" + this.root.toString() + "}";
	}
	,__class__: haxe.ds.BalancedTree
};
haxe.ds.TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe.ds.TreeNode;
haxe.ds.TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe.ds.TreeNode.prototype = {
	left: null
	,right: null
	,key: null
	,value: null
	,_height: null
	,toString: function() {
		return (this.left == null?"":this.left.toString() + ", ") + ("" + Std.string(this.key) + "=" + Std.string(this.value)) + (this.right == null?"":", " + this.right.toString());
	}
	,__class__: haxe.ds.TreeNode
};
haxe.ds.EnumValueMap = function() {
	haxe.ds.BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe.ds.EnumValueMap;
haxe.ds.EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe.ds.EnumValueMap.__interfaces__ = [IMap];
haxe.ds.EnumValueMap.__super__ = haxe.ds.BalancedTree;
haxe.ds.EnumValueMap.prototype = $extend(haxe.ds.BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe.ds.EnumValueMap
});
haxe.ds.GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.ds.GenericCell"] = haxe.ds.GenericCell;
haxe.ds.GenericCell.__name__ = ["haxe","ds","GenericCell"];
haxe.ds.GenericCell.prototype = {
	elt: null
	,next: null
	,__class__: haxe.ds.GenericCell
};
haxe.ds.GenericStack = function() {
};
$hxClasses["haxe.ds.GenericStack"] = haxe.ds.GenericStack;
haxe.ds.GenericStack.__name__ = ["haxe","ds","GenericStack"];
haxe.ds.GenericStack.prototype = {
	head: null
	,add: function(item) {
		this.head = new haxe.ds.GenericCell(item,this.head);
	}
	,first: function() {
		if(this.head == null) return null; else return this.head.elt;
	}
	,pop: function() {
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,isEmpty: function() {
		return this.head == null;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.head;
		while(l != null) {
			if(l.elt == v) {
				if(prev == null) this.head = l.next; else prev.next = l.next;
				break;
			}
			prev = l;
			l = l.next;
		}
		return l != null;
	}
	,iterator: function() {
		var l = this.head;
		return { hasNext : function() {
			return l != null;
		}, next : function() {
			var k = l;
			l = k.next;
			return k.elt;
		}};
	}
	,toString: function() {
		var a = new Array();
		var l = this.head;
		while(l != null) {
			a.push(l.elt);
			l = l.next;
		}
		return "{" + a.join(",") + "}";
	}
	,__class__: haxe.ds.GenericStack
};
haxe.ds._HashMap = {};
haxe.ds._HashMap.HashMap_Impl_ = function() { };
$hxClasses["haxe.ds._HashMap.HashMap_Impl_"] = haxe.ds._HashMap.HashMap_Impl_;
haxe.ds._HashMap.HashMap_Impl_.__name__ = ["haxe","ds","_HashMap","HashMap_Impl_"];
haxe.ds._HashMap.HashMap_Impl_._new = function() {
	return { keys : new haxe.ds.IntMap(), values : new haxe.ds.IntMap()};
};
haxe.ds._HashMap.HashMap_Impl_.set = function(this1,k,v) {
	this1.keys.set(k.hashCode(),k);
	this1.values.set(k.hashCode(),v);
};
haxe.ds._HashMap.HashMap_Impl_.get = function(this1,k) {
	return this1.values.get(k.hashCode());
};
haxe.ds._HashMap.HashMap_Impl_.exists = function(this1,k) {
	return this1.values.exists(k.hashCode());
};
haxe.ds._HashMap.HashMap_Impl_.remove = function(this1,k) {
	this1.values.remove(k.hashCode());
	return this1.keys.remove(k.hashCode());
};
haxe.ds._HashMap.HashMap_Impl_.keys = function(this1) {
	return this1.keys.iterator();
};
haxe.ds._HashMap.HashMap_Impl_.iterator = function(this1) {
	return this1.values.iterator();
};
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.assignId = function(obj) {
	return obj.__id__ = ++haxe.ds.ObjectMap.count;
};
haxe.ds.ObjectMap.getId = function(obj) {
	return obj.__id__;
};
haxe.ds.ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.add(Std.string(i));
			s.b += " => ";
			s.add(Std.string(this.h[i.__id__]));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.StringMap
};
haxe.ds.WeakMap = function() {
	throw "Not implemented for this platform";
};
$hxClasses["haxe.ds.WeakMap"] = haxe.ds.WeakMap;
haxe.ds.WeakMap.__name__ = ["haxe","ds","WeakMap"];
haxe.ds.WeakMap.__interfaces__ = [IMap];
haxe.ds.WeakMap.prototype = {
	set: function(key,value) {
	}
	,get: function(key) {
		return null;
	}
	,exists: function(key) {
		return false;
	}
	,remove: function(key) {
		return false;
	}
	,keys: function() {
		return null;
	}
	,iterator: function() {
		return null;
	}
	,toString: function() {
		return null;
	}
	,__class__: haxe.ds.WeakMap
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
};
haxe.io.Bytes.fastGet = function(b,pos) {
	return b[pos];
};
haxe.io.Bytes.prototype = {
	length: null
	,b: null
	,get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i1 = _g++;
			b1[i1 + pos] = b2[i1 + srcpos];
		}
	}
	,fill: function(pos,len,value) {
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.set(pos++,value);
		}
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len;
		if(this.length < other.length) len = this.length; else len = other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,getDouble: function(pos) {
		var b = new haxe.io.BytesInput(this,pos,8);
		return b.readDouble();
	}
	,getFloat: function(pos) {
		var b = new haxe.io.BytesInput(this,pos,4);
		return b.readFloat();
	}
	,setDouble: function(pos,v) {
		throw "Not supported";
	}
	,setFloat: function(pos,v) {
		throw "Not supported";
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,readString: function(pos,len) {
		return this.getString(pos,len);
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0;
		var _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g11 = 0;
		var _g2 = this.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			var c = this.b[i1];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,getData: function() {
		return this.b;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	b: null
	,get_length: function() {
		return this.b.length;
	}
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0;
		var _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addString: function(v) {
		this.add(haxe.io.Bytes.ofString(v));
	}
	,addFloat: function(v) {
		var b = new haxe.io.BytesOutput();
		b.writeFloat(v);
		this.add(b.getBytes());
	}
	,addDouble: function(v) {
		var b = new haxe.io.BytesOutput();
		b.writeDouble(v);
		this.add(b.getBytes());
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
	,__properties__: {get_length:"get_length"}
};
haxe.io.Input = function() { };
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	bigEndian: null
	,readByte: function() {
		throw "Not implemented";
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,close: function() {
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new StringBuf();
		var last;
		while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
		return buf.b;
	}
	,readLine: function() {
		var buf = new StringBuf();
		var last;
		var s;
		try {
			while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
			s = buf.b;
			if(HxOverrides.cca(s,s.length - 1) == 13) s = HxOverrides.substr(s,0,-1);
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				s = buf.b;
				if(s.length == 0) throw e;
			} else throw(e);
		}
		return s;
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(!this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(!this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n;
		if(this.bigEndian) n = ch2 | ch1 << 8; else n = ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) return ch2 | ch1 << 8; else return ch1 | ch2 << 8;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n;
		if(this.bigEndian) n = ch3 | ch2 << 8 | ch1 << 16; else n = ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		if(this.bigEndian) return ch3 | ch2 << 8 | ch1 << 16; else return ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24; else return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,getDoubleSig: function(bytes) {
		return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
	}
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"set_bigEndian"}
};
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	b: null
	,pos: null
	,len: null
	,totlen: null
	,get_position: function() {
		return this.pos;
	}
	,get_length: function() {
		return this.totlen;
	}
	,set_position: function(p) {
		if(p < 0) p = 0; else if(p > this.totlen) p = this.totlen;
		this.len = this.totlen - p;
		return this.pos = p;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,__class__: haxe.io.BytesInput
	,__properties__: $extend(haxe.io.Input.prototype.__properties__,{get_length:"get_length",set_position:"set_position",get_position:"get_position"})
});
haxe.io.Output = function() { };
$hxClasses["haxe.io.Output"] = haxe.io.Output;
haxe.io.Output.__name__ = ["haxe","io","Output"];
haxe.io.Output.prototype = {
	bigEndian: null
	,writeByte: function(c) {
		throw "Not implemented";
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,flush: function() {
	}
	,close: function() {
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			l -= k;
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,writeFloat: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
		var b4;
		b4 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0);
		var b3 = exp + 127 << 7 & 255 | sig >> 16 & 127;
		var b2 = sig >> 8 & 255;
		var b1 = sig & 255;
		if(this.bigEndian) {
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
		}
	}
	,writeDouble: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * Math.pow(2,52));
		var sig_h = sig & 34359738367;
		var sig_l = Math.floor(sig / Math.pow(2,32));
		var b8;
		b8 = exp + 1023 >> 4 | (exp > 0?x < 0?128:64:x < 0?128:0);
		var b7 = exp + 1023 << 4 & 255 | sig_l >> 16 & 15;
		var b6 = sig_l >> 8 & 255;
		var b5 = sig_l & 255;
		var b4 = sig_h >> 24 & 255;
		var b3 = sig_h >> 16 & 255;
		var b2 = sig_h >> 8 & 255;
		var b1 = sig_h & 255;
		if(this.bigEndian) {
			this.writeByte(b8);
			this.writeByte(b7);
			this.writeByte(b6);
			this.writeByte(b5);
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
			this.writeByte(b5);
			this.writeByte(b6);
			this.writeByte(b7);
			this.writeByte(b8);
		}
	}
	,writeInt8: function(x) {
		if(x < -128 || x >= 128) throw haxe.io.Error.Overflow;
		this.writeByte(x & 255);
	}
	,writeInt16: function(x) {
		if(x < -32768 || x >= 32768) throw haxe.io.Error.Overflow;
		this.writeUInt16(x & 65535);
	}
	,writeUInt16: function(x) {
		if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 8);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8);
		}
	}
	,writeInt24: function(x) {
		if(x < -8388608 || x >= 8388608) throw haxe.io.Error.Overflow;
		this.writeUInt24(x & 16777215);
	}
	,writeUInt24: function(x) {
		if(x < 0 || x >= 16777216) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 16);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16);
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,prepare: function(nbytes) {
	}
	,writeInput: function(i,bufsize) {
		if(bufsize == null) bufsize = 4096;
		var buf = haxe.io.Bytes.alloc(bufsize);
		try {
			while(true) {
				var len = i.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				var p = 0;
				while(len > 0) {
					var k = this.writeBytes(buf,p,len);
					if(k == 0) throw haxe.io.Error.Blocked;
					p += k;
					len -= k;
				}
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
	}
	,writeString: function(s) {
		var b = haxe.io.Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,__class__: haxe.io.Output
	,__properties__: {set_bigEndian:"set_bigEndian"}
};
haxe.io.BytesOutput = function() {
	this.b = new haxe.io.BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe.io.BytesOutput;
haxe.io.BytesOutput.__name__ = ["haxe","io","BytesOutput"];
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	b: null
	,get_length: function() {
		return this.b.b.length;
	}
	,writeByte: function(c) {
		this.b.b.push(c);
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,getBytes: function() {
		return this.b.getBytes();
	}
	,__class__: haxe.io.BytesOutput
	,__properties__: $extend(haxe.io.Output.prototype.__properties__,{get_length:"get_length"})
});
haxe.io.Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.io.Error.__empty_constructs__ = [haxe.io.Error.Blocked,haxe.io.Error.Overflow,haxe.io.Error.OutsideBounds];
haxe.io.StringInput = function(s) {
	haxe.io.BytesInput.call(this,haxe.io.Bytes.ofString(s));
};
$hxClasses["haxe.io.StringInput"] = haxe.io.StringInput;
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
haxe.io.StringInput.prototype = $extend(haxe.io.BytesInput.prototype,{
	__class__: haxe.io.StringInput
});
var hscript = {};
hscript.Const = $hxClasses["hscript.Const"] = { __ename__ : ["hscript","Const"], __constructs__ : ["CInt","CFloat","CString"] };
hscript.Const.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; };
hscript.Const.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; };
hscript.Const.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; };
hscript.Const.__empty_constructs__ = [];
hscript.Expr = $hxClasses["hscript.Expr"] = { __ename__ : ["hscript","Expr"], __constructs__ : ["EConst","EIdent","EVar","EParent","EBlock","EField","EBinop","EUnop","ECall","EIf","EWhile","EFor","EBreak","EContinue","EFunction","EReturn","EArray","EArrayDecl","ENew","EThrow","ETry","EObject","ETernary"] };
hscript.Expr.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EIdent = function(v) { var $x = ["EIdent",1,v]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EVar = function(n,t,e) { var $x = ["EVar",2,n,t,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EParent = function(e) { var $x = ["EParent",3,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EBlock = function(e) { var $x = ["EBlock",4,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EField = function(e,f) { var $x = ["EField",5,e,f]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EBinop = function(op,e1,e2) { var $x = ["EBinop",6,op,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EUnop = function(op,prefix,e) { var $x = ["EUnop",7,op,prefix,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ECall = function(e,params) { var $x = ["ECall",8,e,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EIf = function(cond,e1,e2) { var $x = ["EIf",9,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EWhile = function(cond,e) { var $x = ["EWhile",10,cond,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EFor = function(v,it,e) { var $x = ["EFor",11,v,it,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EBreak = ["EBreak",12];
hscript.Expr.EBreak.toString = $estr;
hscript.Expr.EBreak.__enum__ = hscript.Expr;
hscript.Expr.EContinue = ["EContinue",13];
hscript.Expr.EContinue.toString = $estr;
hscript.Expr.EContinue.__enum__ = hscript.Expr;
hscript.Expr.EFunction = function(args,e,name,ret) { var $x = ["EFunction",14,args,e,name,ret]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EReturn = function(e) { var $x = ["EReturn",15,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EArray = function(e,index) { var $x = ["EArray",16,e,index]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EArrayDecl = function(e) { var $x = ["EArrayDecl",17,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ENew = function(cl,params) { var $x = ["ENew",18,cl,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EThrow = function(e) { var $x = ["EThrow",19,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ETry = function(e,v,t,ecatch) { var $x = ["ETry",20,e,v,t,ecatch]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EObject = function(fl) { var $x = ["EObject",21,fl]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ETernary = function(cond,e1,e2) { var $x = ["ETernary",22,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.__empty_constructs__ = [hscript.Expr.EBreak,hscript.Expr.EContinue];
hscript.CType = $hxClasses["hscript.CType"] = { __ename__ : ["hscript","CType"], __constructs__ : ["CTPath","CTFun","CTAnon","CTParent"] };
hscript.CType.CTPath = function(path,params) { var $x = ["CTPath",0,path,params]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.CType.CTFun = function(args,ret) { var $x = ["CTFun",1,args,ret]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.CType.CTAnon = function(fields) { var $x = ["CTAnon",2,fields]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.CType.CTParent = function(t) { var $x = ["CTParent",3,t]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.CType.__empty_constructs__ = [];
hscript.Error = $hxClasses["hscript.Error"] = { __ename__ : ["hscript","Error"], __constructs__ : ["EInvalidChar","EUnexpected","EUnterminatedString","EUnterminatedComment","EUnknownVariable","EInvalidIterator","EInvalidOp","EInvalidAccess"] };
hscript.Error.EInvalidChar = function(c) { var $x = ["EInvalidChar",0,c]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EUnexpected = function(s) { var $x = ["EUnexpected",1,s]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EUnterminatedString = ["EUnterminatedString",2];
hscript.Error.EUnterminatedString.toString = $estr;
hscript.Error.EUnterminatedString.__enum__ = hscript.Error;
hscript.Error.EUnterminatedComment = ["EUnterminatedComment",3];
hscript.Error.EUnterminatedComment.toString = $estr;
hscript.Error.EUnterminatedComment.__enum__ = hscript.Error;
hscript.Error.EUnknownVariable = function(v) { var $x = ["EUnknownVariable",4,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EInvalidIterator = function(v) { var $x = ["EInvalidIterator",5,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EInvalidOp = function(op) { var $x = ["EInvalidOp",6,op]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EInvalidAccess = function(f) { var $x = ["EInvalidAccess",7,f]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.__empty_constructs__ = [hscript.Error.EUnterminatedString,hscript.Error.EUnterminatedComment];
hscript._Interp = {};
hscript._Interp.Stop = $hxClasses["hscript._Interp.Stop"] = { __ename__ : ["hscript","_Interp","Stop"], __constructs__ : ["SBreak","SContinue","SReturn"] };
hscript._Interp.Stop.SBreak = ["SBreak",0];
hscript._Interp.Stop.SBreak.toString = $estr;
hscript._Interp.Stop.SBreak.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SContinue = ["SContinue",1];
hscript._Interp.Stop.SContinue.toString = $estr;
hscript._Interp.Stop.SContinue.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SReturn = function(v) { var $x = ["SReturn",2,v]; $x.__enum__ = hscript._Interp.Stop; $x.toString = $estr; return $x; };
hscript._Interp.Stop.__empty_constructs__ = [hscript._Interp.Stop.SBreak,hscript._Interp.Stop.SContinue];
hscript.Interp = function() {
	this.locals = new haxe.ds.StringMap();
	this.variables = new haxe.ds.StringMap();
	this.declared = new Array();
	this.variables.set("null",null);
	this.variables.set("true",true);
	this.variables.set("false",false);
	this.variables.set("trace",function(e) {
		haxe.Log.trace(Std.string(e),{ fileName : "hscript", lineNumber : 0});
	});
	this.initOps();
};
$hxClasses["hscript.Interp"] = hscript.Interp;
hscript.Interp.__name__ = ["hscript","Interp"];
hscript.Interp.prototype = {
	variables: null
	,locals: null
	,binops: null
	,declared: null
	,initOps: function() {
		var me = this;
		this.binops = new haxe.ds.StringMap();
		this.binops.set("+",function(e1,e2) {
			return me.expr(e1) + me.expr(e2);
		});
		this.binops.set("-",function(e11,e21) {
			return me.expr(e11) - me.expr(e21);
		});
		this.binops.set("*",function(e12,e22) {
			return me.expr(e12) * me.expr(e22);
		});
		this.binops.set("/",function(e13,e23) {
			return me.expr(e13) / me.expr(e23);
		});
		this.binops.set("%",function(e14,e24) {
			return me.expr(e14) % me.expr(e24);
		});
		this.binops.set("&",function(e15,e25) {
			return me.expr(e15) & me.expr(e25);
		});
		this.binops.set("|",function(e16,e26) {
			return me.expr(e16) | me.expr(e26);
		});
		this.binops.set("^",function(e17,e27) {
			return me.expr(e17) ^ me.expr(e27);
		});
		this.binops.set("<<",function(e18,e28) {
			return me.expr(e18) << me.expr(e28);
		});
		this.binops.set(">>",function(e19,e29) {
			return me.expr(e19) >> me.expr(e29);
		});
		this.binops.set(">>>",function(e110,e210) {
			return me.expr(e110) >>> me.expr(e210);
		});
		this.binops.set("==",function(e111,e211) {
			return me.expr(e111) == me.expr(e211);
		});
		this.binops.set("!=",function(e112,e212) {
			return me.expr(e112) != me.expr(e212);
		});
		this.binops.set(">=",function(e113,e213) {
			return me.expr(e113) >= me.expr(e213);
		});
		this.binops.set("<=",function(e114,e214) {
			return me.expr(e114) <= me.expr(e214);
		});
		this.binops.set(">",function(e115,e215) {
			return me.expr(e115) > me.expr(e215);
		});
		this.binops.set("<",function(e116,e216) {
			return me.expr(e116) < me.expr(e216);
		});
		this.binops.set("||",function(e117,e217) {
			return me.expr(e117) == true || me.expr(e217) == true;
		});
		this.binops.set("&&",function(e118,e218) {
			return me.expr(e118) == true && me.expr(e218) == true;
		});
		this.binops.set("=",$bind(this,this.assign));
		this.binops.set("...",function(e119,e219) {
			return new IntIterator(me.expr(e119),me.expr(e219));
		});
		this.assignOp("+=",function(v1,v2) {
			return v1 + v2;
		});
		this.assignOp("-=",function(v11,v21) {
			return v11 - v21;
		});
		this.assignOp("*=",function(v12,v22) {
			return v12 * v22;
		});
		this.assignOp("/=",function(v13,v23) {
			return v13 / v23;
		});
		this.assignOp("%=",function(v14,v24) {
			return v14 % v24;
		});
		this.assignOp("&=",function(v15,v25) {
			return v15 & v25;
		});
		this.assignOp("|=",function(v16,v26) {
			return v16 | v26;
		});
		this.assignOp("^=",function(v17,v27) {
			return v17 ^ v27;
		});
		this.assignOp("<<=",function(v18,v28) {
			return v18 << v28;
		});
		this.assignOp(">>=",function(v19,v29) {
			return v19 >> v29;
		});
		this.assignOp(">>>=",function(v110,v210) {
			return v110 >>> v210;
		});
	}
	,assign: function(e1,e2) {
		var v = this.expr(e2);
		switch(e1[1]) {
		case 1:
			var id = e1[2];
			var l = this.locals.get(id);
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = e1[3];
			var e = e1[2];
			v = this.set(this.expr(e),f,v);
			break;
		case 16:
			var index = e1[3];
			var e3 = e1[2];
			this.expr(e3)[this.expr(index)] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp("=");
		}
		return v;
	}
	,assignOp: function(op,fop) {
		var me = this;
		this.binops.set(op,function(e1,e2) {
			return me.evalAssignOp(op,fop,e1,e2);
		});
	}
	,evalAssignOp: function(op,fop,e1,e2) {
		var v;
		switch(e1[1]) {
		case 1:
			var id = e1[2];
			var l = this.locals.get(id);
			v = fop(this.expr(e1),this.expr(e2));
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = e1[3];
			var e = e1[2];
			var obj = this.expr(e);
			v = fop(this.get(obj,f),this.expr(e2));
			v = this.set(obj,f,v);
			break;
		case 16:
			var index = e1[3];
			var e3 = e1[2];
			var arr = this.expr(e3);
			var index1 = this.expr(index);
			v = fop(arr[index1],this.expr(e2));
			arr[index1] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp(op);
		}
		return v;
	}
	,increment: function(e,prefix,delta) {
		switch(e[1]) {
		case 1:
			var id = e[2];
			var l = this.locals.get(id);
			var v;
			if(l == null) v = this.variables.get(id); else v = l.r;
			if(prefix) {
				v += delta;
				if(l == null) {
					var value = v;
					this.variables.set(id,value);
				} else l.r = v;
			} else if(l == null) {
				var value1 = v + delta;
				this.variables.set(id,value1);
			} else l.r = v + delta;
			return v;
		case 5:
			var f = e[3];
			var e1 = e[2];
			var obj = this.expr(e1);
			var v1 = this.get(obj,f);
			if(prefix) {
				v1 += delta;
				this.set(obj,f,v1);
			} else this.set(obj,f,v1 + delta);
			return v1;
		case 16:
			var index = e[3];
			var e2 = e[2];
			var arr = this.expr(e2);
			var index1 = this.expr(index);
			var v2 = arr[index1];
			if(prefix) {
				v2 += delta;
				arr[index1] = v2;
			} else arr[index1] = v2 + delta;
			return v2;
		default:
			throw hscript.Error.EInvalidOp(delta > 0?"++":"--");
		}
	}
	,execute: function(expr) {
		this.locals = new haxe.ds.StringMap();
		return this.exprReturn(expr);
	}
	,exprReturn: function(e) {
		try {
			return this.expr(e);
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,hscript._Interp.Stop) ) {
				switch(e1[1]) {
				case 0:
					throw "Invalid break";
					break;
				case 1:
					throw "Invalid continue";
					break;
				case 2:
					var v = e1[2];
					return v;
				}
			} else throw(e1);
		}
		return null;
	}
	,duplicate: function(h) {
		var h2 = new haxe.ds.StringMap();
		var $it0 = h.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			var value = h.get(k);
			h2.set(k,value);
		}
		return h2;
	}
	,restore: function(old) {
		while(this.declared.length > old) {
			var d = this.declared.pop();
			this.locals.set(d.n,d.old);
		}
	}
	,resolve: function(id) {
		var l = this.locals.get(id);
		if(l != null) return l.r;
		var v = this.variables.get(id);
		if(v == null && !this.variables.exists(id)) throw hscript.Error.EUnknownVariable(id);
		return v;
	}
	,expr: function(e) {
		switch(e[1]) {
		case 0:
			var c = e[2];
			switch(c[1]) {
			case 0:
				var v = c[2];
				return v;
			case 1:
				var f = c[2];
				return f;
			case 2:
				var s = c[2];
				return s;
			}
			break;
		case 1:
			var id = e[2];
			return this.resolve(id);
		case 2:
			var e1 = e[4];
			var n = e[2];
			this.declared.push({ n : n, old : this.locals.get(n)});
			var value = { r : e1 == null?null:this.expr(e1)};
			this.locals.set(n,value);
			return null;
		case 3:
			var e2 = e[2];
			return this.expr(e2);
		case 4:
			var exprs = e[2];
			var old = this.declared.length;
			var v1 = null;
			var _g = 0;
			while(_g < exprs.length) {
				var e3 = exprs[_g];
				++_g;
				v1 = this.expr(e3);
			}
			this.restore(old);
			return v1;
		case 5:
			var f1 = e[3];
			var e4 = e[2];
			return this.get(this.expr(e4),f1);
		case 6:
			var e21 = e[4];
			var e11 = e[3];
			var op = e[2];
			var fop = this.binops.get(op);
			if(fop == null) throw hscript.Error.EInvalidOp(op);
			return fop(e11,e21);
		case 7:
			var e5 = e[4];
			var prefix = e[3];
			var op1 = e[2];
			switch(op1) {
			case "!":
				return this.expr(e5) != true;
			case "-":
				return -this.expr(e5);
			case "++":
				return this.increment(e5,prefix,1);
			case "--":
				return this.increment(e5,prefix,-1);
			case "~":
				return ~this.expr(e5);
			default:
				throw hscript.Error.EInvalidOp(op1);
			}
			break;
		case 8:
			var params = e[3];
			var e6 = e[2];
			var args = new Array();
			var _g1 = 0;
			while(_g1 < params.length) {
				var p = params[_g1];
				++_g1;
				args.push(this.expr(p));
			}
			switch(e6[1]) {
			case 5:
				var f2 = e6[3];
				var e7 = e6[2];
				var obj = this.expr(e7);
				if(obj == null) throw hscript.Error.EInvalidAccess(f2);
				return this.fcall(obj,f2,args);
			default:
				return this.call(null,this.expr(e6),args);
			}
			break;
		case 9:
			var e22 = e[4];
			var e12 = e[3];
			var econd = e[2];
			if(this.expr(econd) == true) return this.expr(e12); else if(e22 == null) return null; else return this.expr(e22);
			break;
		case 10:
			var e8 = e[3];
			var econd1 = e[2];
			this.whileLoop(econd1,e8);
			return null;
		case 11:
			var e9 = e[4];
			var it = e[3];
			var v2 = e[2];
			this.forLoop(v2,it,e9);
			return null;
		case 12:
			throw hscript._Interp.Stop.SBreak;
			break;
		case 13:
			throw hscript._Interp.Stop.SContinue;
			break;
		case 15:
			var e10 = e[2];
			throw hscript._Interp.Stop.SReturn(e10 == null?null:this.expr(e10));
			break;
		case 14:
			var name = e[4];
			var fexpr = e[3];
			var params1 = e[2];
			var capturedLocals = this.duplicate(this.locals);
			var me = this;
			var f3 = function(args1) {
				if(args1.length != params1.length) throw "Invalid number of parameters";
				var old1 = me.locals;
				me.locals = me.duplicate(capturedLocals);
				var _g11 = 0;
				var _g2 = params1.length;
				while(_g11 < _g2) {
					var i = _g11++;
					me.locals.set(params1[i].name,{ r : args1[i]});
				}
				var r = null;
				try {
					r = me.exprReturn(fexpr);
				} catch( e13 ) {
					me.locals = old1;
					throw e13;
				}
				me.locals = old1;
				return r;
			};
			var f4 = Reflect.makeVarArgs(f3);
			if(name != null) this.variables.set(name,f4);
			return f4;
		case 17:
			var arr = e[2];
			var a = new Array();
			var _g3 = 0;
			while(_g3 < arr.length) {
				var e14 = arr[_g3];
				++_g3;
				a.push(this.expr(e14));
			}
			return a;
		case 16:
			var index = e[3];
			var e15 = e[2];
			return this.expr(e15)[this.expr(index)];
		case 18:
			var params2 = e[3];
			var cl = e[2];
			var a1 = new Array();
			var _g4 = 0;
			while(_g4 < params2.length) {
				var e16 = params2[_g4];
				++_g4;
				a1.push(this.expr(e16));
			}
			return this.cnew(cl,a1);
		case 19:
			var e17 = e[2];
			throw this.expr(e17);
			break;
		case 20:
			var ecatch = e[5];
			var n1 = e[3];
			var e18 = e[2];
			var old2 = this.declared.length;
			try {
				var v3 = this.expr(e18);
				this.restore(old2);
				return v3;
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,hscript._Interp.Stop) ) {
					var err = $e0;
					throw err;
				} else {
				var err1 = $e0;
				this.restore(old2);
				this.declared.push({ n : n1, old : this.locals.get(n1)});
				this.locals.set(n1,{ r : err1});
				var v4 = this.expr(ecatch);
				this.restore(old2);
				return v4;
				}
			}
			break;
		case 21:
			var fl = e[2];
			var o = { };
			var _g5 = 0;
			while(_g5 < fl.length) {
				var f5 = fl[_g5];
				++_g5;
				this.set(o,f5.name,this.expr(f5.e));
			}
			return o;
		case 22:
			var e23 = e[4];
			var e19 = e[3];
			var econd2 = e[2];
			if(this.expr(econd2) == true) return this.expr(e19); else return this.expr(e23);
			break;
		}
		return null;
	}
	,whileLoop: function(econd,e) {
		var old = this.declared.length;
		try {
			while(this.expr(econd) == true) try {
				this.expr(e);
			} catch( err ) {
				if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
					switch(err[1]) {
					case 1:
						break;
					case 0:
						throw "__break__";
						break;
					case 2:
						throw err;
						break;
					}
				} else throw(err);
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,makeIterator: function(v) {
		try {
			v = $iterator(v)();
		} catch( e ) {
		}
		if(v.hasNext == null || v.next == null) throw hscript.Error.EInvalidIterator(v);
		return v;
	}
	,forLoop: function(n,it,e) {
		var old = this.declared.length;
		this.declared.push({ n : n, old : this.locals.get(n)});
		var it1 = this.makeIterator(this.expr(it));
		try {
			while(it1.hasNext()) {
				var value = { r : it1.next()};
				this.locals.set(n,value);
				try {
					this.expr(e);
				} catch( err ) {
					if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
						switch(err[1]) {
						case 1:
							break;
						case 0:
							throw "__break__";
							break;
						case 2:
							throw err;
							break;
						}
					} else throw(err);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,get: function(o,f) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		return Reflect.field(o,f);
	}
	,set: function(o,f,v) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		o[f] = v;
		return v;
	}
	,fcall: function(o,f,args) {
		return this.call(o,Reflect.field(o,f),args);
	}
	,call: function(o,f,args) {
		return f.apply(o,args);
	}
	,cnew: function(cl,args) {
		var c = Type.resolveClass(cl);
		if(c == null) c = this.resolve(cl);
		return Type.createInstance(c,args);
	}
	,__class__: hscript.Interp
};
hscript.Token = $hxClasses["hscript.Token"] = { __ename__ : ["hscript","Token"], __constructs__ : ["TEof","TConst","TId","TOp","TPOpen","TPClose","TBrOpen","TBrClose","TDot","TComma","TSemicolon","TBkOpen","TBkClose","TQuestion","TDoubleDot"] };
hscript.Token.TEof = ["TEof",0];
hscript.Token.TEof.toString = $estr;
hscript.Token.TEof.__enum__ = hscript.Token;
hscript.Token.TConst = function(c) { var $x = ["TConst",1,c]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; };
hscript.Token.TId = function(s) { var $x = ["TId",2,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; };
hscript.Token.TOp = function(s) { var $x = ["TOp",3,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; };
hscript.Token.TPOpen = ["TPOpen",4];
hscript.Token.TPOpen.toString = $estr;
hscript.Token.TPOpen.__enum__ = hscript.Token;
hscript.Token.TPClose = ["TPClose",5];
hscript.Token.TPClose.toString = $estr;
hscript.Token.TPClose.__enum__ = hscript.Token;
hscript.Token.TBrOpen = ["TBrOpen",6];
hscript.Token.TBrOpen.toString = $estr;
hscript.Token.TBrOpen.__enum__ = hscript.Token;
hscript.Token.TBrClose = ["TBrClose",7];
hscript.Token.TBrClose.toString = $estr;
hscript.Token.TBrClose.__enum__ = hscript.Token;
hscript.Token.TDot = ["TDot",8];
hscript.Token.TDot.toString = $estr;
hscript.Token.TDot.__enum__ = hscript.Token;
hscript.Token.TComma = ["TComma",9];
hscript.Token.TComma.toString = $estr;
hscript.Token.TComma.__enum__ = hscript.Token;
hscript.Token.TSemicolon = ["TSemicolon",10];
hscript.Token.TSemicolon.toString = $estr;
hscript.Token.TSemicolon.__enum__ = hscript.Token;
hscript.Token.TBkOpen = ["TBkOpen",11];
hscript.Token.TBkOpen.toString = $estr;
hscript.Token.TBkOpen.__enum__ = hscript.Token;
hscript.Token.TBkClose = ["TBkClose",12];
hscript.Token.TBkClose.toString = $estr;
hscript.Token.TBkClose.__enum__ = hscript.Token;
hscript.Token.TQuestion = ["TQuestion",13];
hscript.Token.TQuestion.toString = $estr;
hscript.Token.TQuestion.__enum__ = hscript.Token;
hscript.Token.TDoubleDot = ["TDoubleDot",14];
hscript.Token.TDoubleDot.toString = $estr;
hscript.Token.TDoubleDot.__enum__ = hscript.Token;
hscript.Token.__empty_constructs__ = [hscript.Token.TEof,hscript.Token.TPOpen,hscript.Token.TPClose,hscript.Token.TBrOpen,hscript.Token.TBrClose,hscript.Token.TDot,hscript.Token.TComma,hscript.Token.TSemicolon,hscript.Token.TBkOpen,hscript.Token.TBkClose,hscript.Token.TQuestion,hscript.Token.TDoubleDot];
hscript.Parser = function() {
	this.line = 1;
	this.opChars = "+*/-=!><&|^%~";
	this.identChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	var priorities = [["%"],["*","/"],["+","-"],["<<",">>",">>>"],["|","&","^"],["==","!=",">","<",">=","<="],["..."],["&&"],["||"],["=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","&=","^="]];
	this.opPriority = new haxe.ds.StringMap();
	this.opRightAssoc = new haxe.ds.StringMap();
	this.unops = new haxe.ds.StringMap();
	var _g1 = 0;
	var _g = priorities.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g2 = 0;
		var _g3 = priorities[i];
		while(_g2 < _g3.length) {
			var x = _g3[_g2];
			++_g2;
			this.opPriority.set(x,i);
			if(i == 9) this.opRightAssoc.set(x,true);
		}
	}
	var _g4 = 0;
	var _g11 = ["!","++","--","-","~"];
	while(_g4 < _g11.length) {
		var x1 = _g11[_g4];
		++_g4;
		this.unops.set(x1,x1 == "++" || x1 == "--");
	}
};
$hxClasses["hscript.Parser"] = hscript.Parser;
hscript.Parser.__name__ = ["hscript","Parser"];
hscript.Parser.prototype = {
	line: null
	,opChars: null
	,identChars: null
	,opPriority: null
	,opRightAssoc: null
	,unops: null
	,allowJSON: null
	,allowTypes: null
	,input: null
	,'char': null
	,ops: null
	,idents: null
	,tokens: null
	,error: function(err,pmin,pmax) {
		throw err;
	}
	,invalidChar: function(c) {
		this.error(hscript.Error.EInvalidChar(c),0,0);
	}
	,parseString: function(s) {
		this.line = 1;
		return this.parse(new haxe.io.StringInput(s));
	}
	,parse: function(s) {
		this.tokens = new haxe.ds.GenericStack();
		this["char"] = -1;
		this.input = s;
		this.ops = new Array();
		this.idents = new Array();
		var _g1 = 0;
		var _g = this.opChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.ops[HxOverrides.cca(this.opChars,i)] = true;
		}
		var _g11 = 0;
		var _g2 = this.identChars.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.idents[HxOverrides.cca(this.identChars,i1)] = true;
		}
		var a = new Array();
		while(true) {
			var tk = this.token();
			if(tk == hscript.Token.TEof) break;
			this.tokens.add(tk);
			a.push(this.parseFullExpr());
		}
		if(a.length == 1) return a[0]; else return this.mk(hscript.Expr.EBlock(a),0,null);
	}
	,unexpected: function(tk) {
		this.error(hscript.Error.EUnexpected(this.tokenString(tk)),0,0);
		return null;
	}
	,push: function(tk) {
		this.tokens.add(tk);
	}
	,ensure: function(tk) {
		var t = this.token();
		if(t != tk) this.unexpected(t);
	}
	,expr: function(e) {
		return e;
	}
	,pmin: function(e) {
		return 0;
	}
	,pmax: function(e) {
		return 0;
	}
	,mk: function(e,pmin,pmax) {
		return e;
	}
	,isBlock: function(e) {
		switch(e[1]) {
		case 4:case 21:
			return true;
		case 14:
			var e1 = e[3];
			return this.isBlock(e1);
		case 2:
			var e2 = e[4];
			return e2 != null && this.isBlock(e2);
		case 9:
			var e21 = e[4];
			var e11 = e[3];
			if(e21 != null) return this.isBlock(e21); else return this.isBlock(e11);
			break;
		case 6:
			var e3 = e[4];
			return this.isBlock(e3);
		case 7:
			var e4 = e[4];
			var prefix = e[3];
			return !prefix && this.isBlock(e4);
		case 10:
			var e5 = e[3];
			return this.isBlock(e5);
		case 11:
			var e6 = e[4];
			return this.isBlock(e6);
		case 15:
			var e7 = e[2];
			return e7 != null && this.isBlock(e7);
		default:
			return false;
		}
	}
	,parseFullExpr: function() {
		var e = this.parseExpr();
		var tk = this.token();
		if(tk != hscript.Token.TSemicolon && tk != hscript.Token.TEof) {
			if(this.isBlock(e)) this.tokens.add(tk); else this.unexpected(tk);
		}
		return e;
	}
	,parseObject: function(p1) {
		var fl = new Array();
		try {
			while(true) {
				var tk = this.token();
				var id = null;
				switch(tk[1]) {
				case 2:
					var i = tk[2];
					id = i;
					break;
				case 1:
					var c = tk[2];
					if(!this.allowJSON) this.unexpected(tk);
					switch(c[1]) {
					case 2:
						var s = c[2];
						id = s;
						break;
					default:
						this.unexpected(tk);
					}
					break;
				case 7:
					throw "__break__";
					break;
				default:
					this.unexpected(tk);
				}
				this.ensure(hscript.Token.TDoubleDot);
				fl.push({ name : id, e : this.parseExpr()});
				tk = this.token();
				switch(tk[1]) {
				case 7:
					throw "__break__";
					break;
				case 9:
					break;
				default:
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return this.parseExprNext(this.mk(hscript.Expr.EObject(fl),p1,null));
	}
	,parseExpr: function() {
		var tk = this.token();
		switch(tk[1]) {
		case 2:
			var id = tk[2];
			var e = this.parseStructure(id);
			if(e == null) e = this.mk(hscript.Expr.EIdent(id),null,null);
			return this.parseExprNext(e);
		case 1:
			var c = tk[2];
			return this.parseExprNext(this.mk(hscript.Expr.EConst(c),null,null));
		case 4:
			var e1 = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			return this.parseExprNext(this.mk(hscript.Expr.EParent(e1),0,0));
		case 6:
			tk = this.token();
			switch(tk[1]) {
			case 7:
				return this.parseExprNext(this.mk(hscript.Expr.EObject([]),0,null));
			case 2:
				var tk2 = this.token();
				this.tokens.add(tk2);
				this.tokens.add(tk);
				switch(tk2[1]) {
				case 14:
					return this.parseExprNext(this.parseObject(0));
				default:
				}
				break;
			case 1:
				var c1 = tk[2];
				if(this.allowJSON) switch(c1[1]) {
				case 2:
					var tk21 = this.token();
					this.tokens.add(tk21);
					this.tokens.add(tk);
					switch(tk21[1]) {
					case 14:
						return this.parseExprNext(this.parseObject(0));
					default:
					}
					break;
				default:
					this.tokens.add(tk);
				} else this.tokens.add(tk);
				break;
			default:
				this.tokens.add(tk);
			}
			var a = new Array();
			while(true) {
				a.push(this.parseFullExpr());
				tk = this.token();
				if(tk == hscript.Token.TBrClose) break;
				this.tokens.add(tk);
			}
			return this.mk(hscript.Expr.EBlock(a),0,null);
		case 3:
			var op = tk[2];
			if(this.unops.exists(op)) return this.makeUnop(op,this.parseExpr());
			return this.unexpected(tk);
		case 11:
			var a1 = new Array();
			tk = this.token();
			while(tk != hscript.Token.TBkClose) {
				this.tokens.add(tk);
				a1.push(this.parseExpr());
				tk = this.token();
				if(tk == hscript.Token.TComma) tk = this.token();
			}
			return this.parseExprNext(this.mk(hscript.Expr.EArrayDecl(a1),0,null));
		default:
			return this.unexpected(tk);
		}
	}
	,makeUnop: function(op,e) {
		switch(e[1]) {
		case 6:
			var e2 = e[4];
			var e1 = e[3];
			var bop = e[2];
			return this.mk(hscript.Expr.EBinop(bop,this.makeUnop(op,e1),e2),0,0);
		case 22:
			var e3 = e[4];
			var e21 = e[3];
			var e11 = e[2];
			return this.mk(hscript.Expr.ETernary(this.makeUnop(op,e11),e21,e3),0,0);
		default:
			return this.mk(hscript.Expr.EUnop(op,true,e),0,0);
		}
	}
	,makeBinop: function(op,e1,e) {
		switch(e[1]) {
		case 6:
			var e3 = e[4];
			var e2 = e[3];
			var op2 = e[2];
			if(this.opPriority.get(op) <= this.opPriority.get(op2) && !this.opRightAssoc.exists(op)) return this.mk(hscript.Expr.EBinop(op2,this.makeBinop(op,e1,e2),e3),0,0); else return this.mk(hscript.Expr.EBinop(op,e1,e),0,0);
			break;
		case 22:
			var e4 = e[4];
			var e31 = e[3];
			var e21 = e[2];
			if(this.opRightAssoc.exists(op)) return this.mk(hscript.Expr.EBinop(op,e1,e),0,0); else return this.mk(hscript.Expr.ETernary(this.makeBinop(op,e1,e21),e31,e4),0,0);
			break;
		default:
			return this.mk(hscript.Expr.EBinop(op,e1,e),0,0);
		}
	}
	,parseStructure: function(id) {
		switch(id) {
		case "if":
			var cond = this.parseExpr();
			var e1 = this.parseExpr();
			var e2 = null;
			var semic = false;
			var tk = this.token();
			if(tk == hscript.Token.TSemicolon) {
				semic = true;
				tk = this.token();
			}
			if(Type.enumEq(tk,hscript.Token.TId("else"))) e2 = this.parseExpr(); else {
				this.tokens.add(tk);
				if(semic) this.tokens.add(hscript.Token.TSemicolon);
			}
			return this.mk(hscript.Expr.EIf(cond,e1,e2),0,e2 == null?0:0);
		case "var":
			var tk1 = this.token();
			var ident = null;
			switch(tk1[1]) {
			case 2:
				var id1 = tk1[2];
				ident = id1;
				break;
			default:
				this.unexpected(tk1);
			}
			tk1 = this.token();
			var t = null;
			if(tk1 == hscript.Token.TDoubleDot && this.allowTypes) {
				t = this.parseType();
				tk1 = this.token();
			}
			var e = null;
			if(Type.enumEq(tk1,hscript.Token.TOp("="))) e = this.parseExpr(); else this.tokens.add(tk1);
			return this.mk(hscript.Expr.EVar(ident,t,e),0,e == null?0:0);
		case "while":
			var econd = this.parseExpr();
			var e3 = this.parseExpr();
			return this.mk(hscript.Expr.EWhile(econd,e3),0,0);
		case "for":
			this.ensure(hscript.Token.TPOpen);
			var tk2 = this.token();
			var vname = null;
			switch(tk2[1]) {
			case 2:
				var id2 = tk2[2];
				vname = id2;
				break;
			default:
				this.unexpected(tk2);
			}
			tk2 = this.token();
			if(!Type.enumEq(tk2,hscript.Token.TId("in"))) this.unexpected(tk2);
			var eiter = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			var e4 = this.parseExpr();
			return this.mk(hscript.Expr.EFor(vname,eiter,e4),0,0);
		case "break":
			return hscript.Expr.EBreak;
		case "continue":
			return hscript.Expr.EContinue;
		case "else":
			return this.unexpected(hscript.Token.TId(id));
		case "function":
			var tk3 = this.token();
			var name = null;
			switch(tk3[1]) {
			case 2:
				var id3 = tk3[2];
				name = id3;
				break;
			default:
				this.tokens.add(tk3);
			}
			this.ensure(hscript.Token.TPOpen);
			var args = new Array();
			tk3 = this.token();
			if(tk3 != hscript.Token.TPClose) {
				var arg = true;
				while(arg) {
					var name1 = null;
					switch(tk3[1]) {
					case 2:
						var id4 = tk3[2];
						name1 = id4;
						break;
					default:
						this.unexpected(tk3);
					}
					tk3 = this.token();
					var t1 = null;
					if(tk3 == hscript.Token.TDoubleDot && this.allowTypes) {
						t1 = this.parseType();
						tk3 = this.token();
					}
					args.push({ name : name1, t : t1});
					switch(tk3[1]) {
					case 9:
						tk3 = this.token();
						break;
					case 5:
						arg = false;
						break;
					default:
						this.unexpected(tk3);
					}
				}
			}
			var ret = null;
			if(this.allowTypes) {
				tk3 = this.token();
				if(tk3 != hscript.Token.TDoubleDot) this.tokens.add(tk3); else ret = this.parseType();
			}
			var body = this.parseExpr();
			return this.mk(hscript.Expr.EFunction(args,body,name,ret),0,0);
		case "return":
			var tk4 = this.token();
			this.tokens.add(tk4);
			var e5;
			if(tk4 == hscript.Token.TSemicolon) e5 = null; else e5 = this.parseExpr();
			return this.mk(hscript.Expr.EReturn(e5),0,e5 == null?0:0);
		case "new":
			var a = new Array();
			var tk5 = this.token();
			switch(tk5[1]) {
			case 2:
				var id5 = tk5[2];
				a.push(id5);
				break;
			default:
				this.unexpected(tk5);
			}
			var next = true;
			while(next) {
				tk5 = this.token();
				switch(tk5[1]) {
				case 8:
					tk5 = this.token();
					switch(tk5[1]) {
					case 2:
						var id6 = tk5[2];
						a.push(id6);
						break;
					default:
						this.unexpected(tk5);
					}
					break;
				case 4:
					next = false;
					break;
				default:
					this.unexpected(tk5);
				}
			}
			var args1 = this.parseExprList(hscript.Token.TPClose);
			return this.mk(hscript.Expr.ENew(a.join("."),args1),0,null);
		case "throw":
			var e6 = this.parseExpr();
			return this.mk(hscript.Expr.EThrow(e6),0,0);
		case "try":
			var e7 = this.parseExpr();
			var tk6 = this.token();
			if(!Type.enumEq(tk6,hscript.Token.TId("catch"))) this.unexpected(tk6);
			this.ensure(hscript.Token.TPOpen);
			tk6 = this.token();
			var vname1;
			switch(tk6[1]) {
			case 2:
				var id7 = tk6[2];
				vname1 = id7;
				break;
			default:
				vname1 = this.unexpected(tk6);
			}
			this.ensure(hscript.Token.TDoubleDot);
			var t2 = null;
			if(this.allowTypes) t2 = this.parseType(); else {
				tk6 = this.token();
				if(!Type.enumEq(tk6,hscript.Token.TId("Dynamic"))) this.unexpected(tk6);
			}
			this.ensure(hscript.Token.TPClose);
			var ec = this.parseExpr();
			return this.mk(hscript.Expr.ETry(e7,vname1,t2,ec),0,0);
		default:
			return null;
		}
	}
	,parseExprNext: function(e1) {
		var tk = this.token();
		switch(tk[1]) {
		case 3:
			var op = tk[2];
			if(this.unops.get(op)) {
				if(this.isBlock(e1) || (function($this) {
					var $r;
					switch(e1[1]) {
					case 3:
						$r = true;
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) {
					this.tokens.add(tk);
					return e1;
				}
				return this.parseExprNext(this.mk(hscript.Expr.EUnop(op,false,e1),0,null));
			}
			return this.makeBinop(op,e1,this.parseExpr());
		case 8:
			tk = this.token();
			var field = null;
			switch(tk[1]) {
			case 2:
				var id = tk[2];
				field = id;
				break;
			default:
				this.unexpected(tk);
			}
			return this.parseExprNext(this.mk(hscript.Expr.EField(e1,field),0,null));
		case 4:
			return this.parseExprNext(this.mk(hscript.Expr.ECall(e1,this.parseExprList(hscript.Token.TPClose)),0,null));
		case 11:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TBkClose);
			return this.parseExprNext(this.mk(hscript.Expr.EArray(e1,e2),0,null));
		case 13:
			var e21 = this.parseExpr();
			this.ensure(hscript.Token.TDoubleDot);
			var e3 = this.parseExpr();
			return this.mk(hscript.Expr.ETernary(e1,e21,e3),0,0);
		default:
			this.tokens.add(tk);
			return e1;
		}
	}
	,parseType: function() {
		var t = this.token();
		switch(t[1]) {
		case 2:
			var v = t[2];
			var path = [v];
			while(true) {
				t = this.token();
				if(t != hscript.Token.TDot) break;
				t = this.token();
				switch(t[1]) {
				case 2:
					var v1 = t[2];
					path.push(v1);
					break;
				default:
					this.unexpected(t);
				}
			}
			var params = null;
			switch(t[1]) {
			case 3:
				var op = t[2];
				if(op == "<") {
					params = [];
					try {
						while(true) {
							params.push(this.parseType());
							t = this.token();
							switch(t[1]) {
							case 9:
								continue;
								break;
							case 3:
								var op1 = t[2];
								if(op1 == ">") throw "__break__";
								break;
							default:
							}
							this.unexpected(t);
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
				}
				break;
			default:
				this.tokens.add(t);
			}
			return this.parseTypeNext(hscript.CType.CTPath(path,params));
		case 4:
			var t1 = this.parseType();
			this.ensure(hscript.Token.TPClose);
			return this.parseTypeNext(hscript.CType.CTParent(t1));
		case 6:
			var fields = [];
			try {
				while(true) {
					t = this.token();
					switch(t[1]) {
					case 7:
						throw "__break__";
						break;
					case 2:
						var name = t[2];
						this.ensure(hscript.Token.TDoubleDot);
						fields.push({ name : name, t : this.parseType()});
						t = this.token();
						switch(t[1]) {
						case 9:
							break;
						case 7:
							throw "__break__";
							break;
						default:
							this.unexpected(t);
						}
						break;
					default:
						this.unexpected(t);
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			return this.parseTypeNext(hscript.CType.CTAnon(fields));
		default:
			return this.unexpected(t);
		}
	}
	,parseTypeNext: function(t) {
		var tk = this.token();
		switch(tk[1]) {
		case 3:
			var op = tk[2];
			if(op != "->") {
				this.tokens.add(tk);
				return t;
			}
			break;
		default:
			this.tokens.add(tk);
			return t;
		}
		var t2 = this.parseType();
		switch(t2[1]) {
		case 1:
			var args = t2[2];
			args.unshift(t);
			return t2;
		default:
			return hscript.CType.CTFun([t],t2);
		}
	}
	,parseExprList: function(etk) {
		var args = new Array();
		var tk = this.token();
		if(tk == etk) return args;
		this.tokens.add(tk);
		try {
			while(true) {
				args.push(this.parseExpr());
				tk = this.token();
				switch(tk[1]) {
				case 9:
					break;
				default:
					if(tk == etk) throw "__break__";
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return args;
	}
	,incPos: function() {
	}
	,readChar: function() {
		try {
			return this.input.readByte();
		} catch( e ) {
			return 0;
		}
	}
	,readString: function(until) {
		var c = 0;
		var b = new haxe.io.BytesOutput();
		var esc = false;
		var old = this.line;
		var s = this.input;
		while(true) {
			try {
				c = s.readByte();
			} catch( e ) {
				this.line = old;
				throw hscript.Error.EUnterminatedString;
			}
			if(esc) {
				esc = false;
				switch(c) {
				case 110:
					b.writeByte(10);
					break;
				case 114:
					b.writeByte(13);
					break;
				case 116:
					b.writeByte(9);
					break;
				case 39:case 34:case 92:
					b.writeByte(c);
					break;
				case 47:
					if(this.allowJSON) b.writeByte(c); else this.invalidChar(c);
					break;
				case 117:
					if(!this.allowJSON) throw this.invalidChar(c);
					var code = null;
					try {
						code = s.readString(4);
					} catch( e1 ) {
						this.line = old;
						throw hscript.Error.EUnterminatedString;
					}
					var k = 0;
					var _g = 0;
					while(_g < 4) {
						var i = _g++;
						k <<= 4;
						var $char = HxOverrides.cca(code,i);
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += $char - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += $char - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += $char - 87;
							break;
						default:
							this.invalidChar($char);
						}
					}
					if(k <= 127) b.writeByte(k); else if(k <= 2047) {
						b.writeByte(192 | k >> 6);
						b.writeByte(128 | k & 63);
					} else {
						b.writeByte(224 | k >> 12);
						b.writeByte(128 | k >> 6 & 63);
						b.writeByte(128 | k & 63);
					}
					break;
				default:
					this.invalidChar(c);
				}
			} else if(c == 92) esc = true; else if(c == until) break; else {
				if(c == 10) this.line++;
				b.writeByte(c);
			}
		}
		return b.getBytes().toString();
	}
	,token: function() {
		if(!(this.tokens.head == null)) return this.tokens.pop();
		var $char;
		if(this["char"] < 0) $char = this.readChar(); else {
			$char = this["char"];
			this["char"] = -1;
		}
		while(true) {
			switch($char) {
			case 0:
				return hscript.Token.TEof;
			case 32:case 9:case 13:
				break;
			case 10:
				this.line++;
				break;
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				var n = ($char - 48) * 1.0;
				var exp = 0.;
				while(true) {
					$char = this.readChar();
					exp *= 10;
					switch($char) {
					case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						n = n * 10 + ($char - 48);
						break;
					case 46:
						if(exp > 0) {
							if(exp == 10 && this.readChar() == 46) {
								this.push(hscript.Token.TOp("..."));
								var i = n | 0;
								return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
							}
							this.invalidChar($char);
						}
						exp = 1.;
						break;
					case 120:
						if(n > 0 || exp > 0) this.invalidChar($char);
						var n1 = 0;
						while(true) {
							$char = this.readChar();
							switch($char) {
							case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
								n1 = (n1 << 4) + $char - 48;
								break;
							case 65:case 66:case 67:case 68:case 69:case 70:
								n1 = (n1 << 4) + ($char - 55);
								break;
							case 97:case 98:case 99:case 100:case 101:case 102:
								n1 = (n1 << 4) + ($char - 87);
								break;
							default:
								this["char"] = $char;
								return hscript.Token.TConst(hscript.Const.CInt(n1));
							}
						}
						break;
					default:
						this["char"] = $char;
						var i1 = n | 0;
						return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i1 == n?hscript.Const.CInt(i1):hscript.Const.CFloat(n));
					}
				}
				break;
			case 59:
				return hscript.Token.TSemicolon;
			case 40:
				return hscript.Token.TPOpen;
			case 41:
				return hscript.Token.TPClose;
			case 44:
				return hscript.Token.TComma;
			case 46:
				$char = this.readChar();
				switch($char) {
				case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
					var n2 = $char - 48;
					var exp1 = 1;
					while(true) {
						$char = this.readChar();
						exp1 *= 10;
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							n2 = n2 * 10 + ($char - 48);
							break;
						default:
							this["char"] = $char;
							return hscript.Token.TConst(hscript.Const.CFloat(n2 / exp1));
						}
					}
					break;
				case 46:
					$char = this.readChar();
					if($char != 46) this.invalidChar($char);
					return hscript.Token.TOp("...");
				default:
					this["char"] = $char;
					return hscript.Token.TDot;
				}
				break;
			case 123:
				return hscript.Token.TBrOpen;
			case 125:
				return hscript.Token.TBrClose;
			case 91:
				return hscript.Token.TBkOpen;
			case 93:
				return hscript.Token.TBkClose;
			case 39:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(39)));
			case 34:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(34)));
			case 63:
				return hscript.Token.TQuestion;
			case 58:
				return hscript.Token.TDoubleDot;
			default:
				if(this.ops[$char]) {
					var op = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.ops[$char]) {
							if(HxOverrides.cca(op,0) == 47) return this.tokenComment(op,$char);
							this["char"] = $char;
							return hscript.Token.TOp(op);
						}
						op += String.fromCharCode($char);
					}
				}
				if(this.idents[$char]) {
					var id = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.idents[$char]) {
							this["char"] = $char;
							return hscript.Token.TId(id);
						}
						id += String.fromCharCode($char);
					}
				}
				this.invalidChar($char);
			}
			$char = this.readChar();
		}
		return null;
	}
	,tokenComment: function(op,$char) {
		var c = HxOverrides.cca(op,1);
		var s = this.input;
		if(c == 47) {
			try {
				while($char != 10 && $char != 13) $char = s.readByte();
				this["char"] = $char;
			} catch( e ) {
			}
			return this.token();
		}
		if(c == 42) {
			var old = this.line;
			try {
				while(true) {
					while($char != 42) {
						if($char == 10) this.line++;
						$char = s.readByte();
					}
					$char = s.readByte();
					if($char == 47) break;
				}
			} catch( e1 ) {
				this.line = old;
				throw hscript.Error.EUnterminatedComment;
			}
			return this.token();
		}
		this["char"] = $char;
		return hscript.Token.TOp(op);
	}
	,constString: function(c) {
		switch(c[1]) {
		case 0:
			var v = c[2];
			if(v == null) return "null"; else return "" + v;
			break;
		case 1:
			var f = c[2];
			if(f == null) return "null"; else return "" + f;
			break;
		case 2:
			var s = c[2];
			return s;
		}
	}
	,tokenString: function(t) {
		switch(t[1]) {
		case 0:
			return "<eof>";
		case 1:
			var c = t[2];
			return this.constString(c);
		case 2:
			var s = t[2];
			return s;
		case 3:
			var s1 = t[2];
			return s1;
		case 4:
			return "(";
		case 5:
			return ")";
		case 6:
			return "{";
		case 7:
			return "}";
		case 8:
			return ".";
		case 9:
			return ",";
		case 10:
			return ";";
		case 11:
			return "[";
		case 12:
			return "]";
		case 13:
			return "?";
		case 14:
			return ":";
		}
	}
	,__class__: hscript.Parser
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
};
js.Boot.isClass = function(o) {
	return o.__name__;
};
js.Boot.isEnum = function(e) {
	return e.__ename__;
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Lib = function() { };
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.debug = function() {
	debugger;
};
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
js.Lib["eval"] = function(code) {
	return eval(code);
};
var pgr = {};
pgr.dconsole = {};
pgr.dconsole.DC = $hx_exports.pgr.dconsole.DC = function() { };
$hxClasses["pgr.dconsole.DC"] = pgr.dconsole.DC;
pgr.dconsole.DC.__name__ = ["pgr","dconsole","DC"];
pgr.dconsole.DC.instance = null;
pgr.dconsole.DC.init = function(heightPt,align,theme,input,interfc) {
	if(align == null) align = "DOWN";
	if(heightPt == null) heightPt = 33;
	if(pgr.dconsole.DC.instance != null) return;
	if(input == null) input = new pgr.dconsole.input.DCEmptyInput();
	if(interfc == null) interfc = new pgr.dconsole.ui.DCEmtpyInterface();
	pgr.dconsole.DC.instance = new pgr.dconsole.DConsole(input,interfc,theme);
	pgr.dconsole.DC.logInfo("~~~~~~~~~~ DCONSOLE ~~~~~~~~~~ (v" + "4.4.0" + ")");
};
pgr.dconsole.DC.setConsoleFont = function(font,embed,size,bold,italic,underline) {
	if(underline == null) underline = false;
	if(italic == null) italic = false;
	if(bold == null) bold = false;
	if(size == null) size = 14;
	if(embed == null) embed = true;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.interfc.setConsoleFont(font,embed,size,bold,italic,underline);
};
pgr.dconsole.DC.setPromptFont = function(font,embed,size,bold,italic,underline) {
	if(underline == null) underline = false;
	if(italic == null) italic = false;
	if(bold == null) bold = false;
	if(size == null) size = 16;
	if(embed == null) embed = true;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.interfc.setPromptFont(font,embed,size,bold,italic,underline);
};
pgr.dconsole.DC.setMonitorFont = function(font,embed,size,bold,italic,underline) {
	if(underline == null) underline = false;
	if(italic == null) italic = false;
	if(bold == null) bold = false;
	if(size == null) size = 14;
	if(embed == null) embed = true;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.interfc.setConsoleFont(font,embed,size,bold,italic,underline);
};
pgr.dconsole.DC.setFont = function(font,embed,size,bold,italic,underline) {
	if(underline == null) underline = false;
	if(italic == null) italic = false;
	if(bold == null) bold = false;
	if(size == null) size = 16;
	if(embed == null) embed = true;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.interfc.setConsoleFont(font,embed,size,bold,italic,underline);
	pgr.dconsole.DC.instance.interfc.setPromptFont(font,embed,size,bold,italic,underline);
	pgr.dconsole.DC.instance.interfc.setConsoleFont(font,embed,size,bold,italic,underline);
	pgr.dconsole.DC.instance.interfc.setProfilerFont(font,embed,size,bold,italic,underline);
};
pgr.dconsole.DC.showConsole = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.showConsole();
};
pgr.dconsole.DC.hideConsole = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.hideConsole();
};
pgr.dconsole.DC.showMonitor = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.showMonitor();
};
pgr.dconsole.DC.hideMonitor = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.hideMonitor();
};
pgr.dconsole.DC.showProfiler = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.showProfiler();
};
pgr.dconsole.DC.hideProfiler = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.hideProfiler();
};
pgr.dconsole.DC.enable = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.enable();
};
pgr.dconsole.DC.disable = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.disable();
};
pgr.dconsole.DC.setConsoleKey = function(keyCode,ctrlKey,shiftKey,altKey) {
	if(altKey == null) altKey = false;
	if(shiftKey == null) shiftKey = false;
	if(ctrlKey == null) ctrlKey = false;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.setConsoleKey(keyCode,ctrlKey,shiftKey,altKey);
};
pgr.dconsole.DC.setMonitorKey = function(keyCode,ctrlKey,shiftKey,altKey) {
	if(altKey == null) altKey = false;
	if(shiftKey == null) shiftKey = false;
	if(ctrlKey == null) ctrlKey = false;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.setMonitorKey(keyCode,ctrlKey,shiftKey,altKey);
};
pgr.dconsole.DC.setProfilerKey = function(keyCode,ctrlKey,shiftKey,altKey) {
	if(altKey == null) altKey = false;
	if(shiftKey == null) shiftKey = false;
	if(ctrlKey == null) ctrlKey = false;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.setProfilerKey(keyCode,ctrlKey,shiftKey,altKey);
};
pgr.dconsole.DC.log = function(data,color) {
	if(color == null) color = -1;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.log(data,color);
};
pgr.dconsole.DC.logWarning = function(data) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.logWarning(data);
};
pgr.dconsole.DC.logError = function(data) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.log(data,pgr.dconsole.DCThemes.current.LOG_ERR);
};
pgr.dconsole.DC.logConfirmation = function(data) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.logConfirmation(data);
};
pgr.dconsole.DC.logInfo = function(data) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.logInfo(data);
};
pgr.dconsole.DC.monitorField = function(object,fieldName,alias) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.monitorField(object,fieldName,alias);
};
pgr.dconsole.DC.setMonitorRefreshRate = function(refreshRate) {
	if(refreshRate == null) refreshRate = 100;
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.monitor.setRefreshRate(refreshRate);
};
pgr.dconsole.DC.registerCommand = function(Function,alias,shortcut,description,help) {
	if(help == null) help = "";
	if(description == null) description = "";
	if(shortcut == null) shortcut = "";
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.registerCommand(Function,alias,shortcut,description,help);
};
pgr.dconsole.DC.registerObject = function(object,alias) {
	if(alias == null) alias = "";
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.registerObject(object,alias);
};
pgr.dconsole.DC.registerClass = function(cls,alias) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.registerClass(cls,alias);
};
pgr.dconsole.DC.registerFunction = function(Function,alias,description) {
	if(description == null) description = "";
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.registerFunction(Function,alias,description);
};
pgr.dconsole.DC.unregisterFunction = function(alias) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.unregisterFunction(alias);
};
pgr.dconsole.DC.unregisterObject = function(alias) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.unregisterObject(alias);
};
pgr.dconsole.DC.clearConsole = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.clearConsole();
};
pgr.dconsole.DC.clearRegistry = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.clearRegistry();
};
pgr.dconsole.DC.clearProfiler = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.profiler.clear();
};
pgr.dconsole.DC.clearMonitor = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.monitor.clear();
};
pgr.dconsole.DC.toFront = function() {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.interfc.toFront();
};
pgr.dconsole.DC.beginProfile = function(sampleName) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.profiler.begin(sampleName);
};
pgr.dconsole.DC.endProfile = function(sampleName) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.profiler.end(sampleName);
};
pgr.dconsole.DC.setVerboseErrors = function(b) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.printErrorStack = b;
};
pgr.dconsole.DC["eval"] = function(expr) {
	pgr.dconsole.DC.checkInstance();
	pgr.dconsole.DC.instance.commands.evaluate(expr);
};
pgr.dconsole.DC.redirTraces = function(b) {
};
pgr.dconsole.DC.checkInstance = function() {
	if(pgr.dconsole.DC.instance == null) pgr.dconsole.DC.init();
};
pgr.dconsole.DCCommands = function(console) {
	this.printErrorStack = false;
	this.classMap = new haxe.ds.StringMap();
	this.commandsMap = new haxe.ds.StringMap();
	this.objectsMap = new haxe.ds.StringMap();
	this.functionsMap = new haxe.ds.StringMap();
	this._console = console;
	this.hScriptParser = new hscript.Parser();
	this.hScriptParser.allowJSON = true;
	this.hScriptInterp = new pgr.dconsole.DCInterp();
	this.hScriptInterp.variables.set("objectsMap",this.objectsMap);
	this.registerClass(Math,"Math");
};
$hxClasses["pgr.dconsole.DCCommands"] = pgr.dconsole.DCCommands;
pgr.dconsole.DCCommands.__name__ = ["pgr","dconsole","DCCommands"];
pgr.dconsole.DCCommands.prototype = {
	functionsMap: null
	,objectsMap: null
	,commandsMap: null
	,classMap: null
	,hScriptParser: null
	,hScriptInterp: null
	,printErrorStack: null
	,_console: null
	,registerClass: function(cls,alias) {
		if(!this.hScriptInterp.variables.exists(alias) && cls != null) {
			this.hScriptInterp.variables.set(alias,cls);
			this.classMap.set(alias,cls);
		}
	}
	,evaluate: function(input) {
		var args = input.split(" ");
		var commandName = args[0].toLowerCase();
		if(commandName != null && commandName != "") {
			var $it0 = this.commandsMap.iterator();
			while( $it0.hasNext() ) {
				var command = $it0.next();
				if(commandName == command.alias || commandName == command.shortcut) {
					args.shift();
					command.callback(args);
					return;
				}
			}
		}
		try {
			if(StringTools.endsWith(StringTools.trim(input),";") == false) input = StringTools.trim(input) + ";";
			var program = this.hScriptParser.parseString(input);
			var result = this.hScriptInterp.exprReturn(program);
			if(typeof(result) == "number" || typeof(result) == "boolean" || result != null) this._console.logConfirmation(result);
		} catch( e ) {
			if(this.printErrorStack) {
				var stack = haxe.CallStack.exceptionStack();
				var _g = 0;
				while(_g < stack.length) {
					var entry = stack[_g];
					++_g;
					this._console.log(entry);
				}
			}
			this._console.logError(Std.string(e));
		}
	}
	,registerCommand: function(Function,alias,shortcut,description,help) {
		if(help == null) help = "";
		if(description == null) description = "";
		if(shortcut == null) shortcut = "";
		if(!Reflect.isFunction(Function)) {
			this._console.logError("Command function " + Std.string(Function) + " is not valid.");
			return;
		}
		alias = pgr.dconsole.DCUtil.formatAlias(this,alias,pgr.dconsole.ALIAS_TYPE.COMMAND);
		if(alias == null) {
			this._console.log("Failed to register command, make sure alias or shortcut is correct");
			return;
		}
		if(shortcut != "") {
			shortcut = pgr.dconsole.DCUtil.formatAlias(this,shortcut,pgr.dconsole.ALIAS_TYPE.COMMAND);
			if(shortcut == null) shortcut = "";
		}
		var command = { callback : Function, alias : alias, shortcut : shortcut, description : description, help : help};
		this.commandsMap.set(alias,command);
	}
	,registerFunction: function(Function,alias,description) {
		if(!Reflect.isFunction(Function)) {
			this._console.logError("Function " + Std.string(Function) + " is not valid.");
			return;
		}
		alias = pgr.dconsole.DCUtil.formatAlias(this,alias,pgr.dconsole.ALIAS_TYPE.FUNCTION);
		if(alias == null) {
			this._console.logError("Function " + Std.string(Function) + " alias not valid");
			return;
		}
		this.functionsMap.set(alias,{ callback : Function, description : description});
		var value = Function;
		this.hScriptInterp.variables.set(alias,value);
	}
	,registerObject: function(object,alias) {
		if(!Reflect.isObject(object)) {
			this._console.logError("dynamic passed is not an object.");
			return;
		}
		if(alias == "") alias = pgr.dconsole.DCUtil.formatAlias(this,Type.getClassName(Type.getClass(object)).toLowerCase(),pgr.dconsole.ALIAS_TYPE.OBJECT); else alias = pgr.dconsole.DCUtil.formatAlias(this,alias,pgr.dconsole.ALIAS_TYPE.OBJECT);
		if(alias == null) {
			this._console.logError("failed to register object " + Type.getClassName(Type.getClass(object)) + " make sure object alias is correct");
			return;
		}
		var value = object;
		this.objectsMap.set(alias,value);
		var value1 = object;
		this.hScriptInterp.variables.set(alias,value1);
	}
	,unregisterFunction: function(alias) {
		if(this.functionsMap.exists(alias)) {
			this.functionsMap.remove(alias);
			this.hScriptInterp.variables.remove(alias);
			this._console.logInfo(alias + " unregistered.");
		}
		this._console.logError(alias + " not found.");
	}
	,unregisterObject: function(alias) {
		if(this.objectsMap.exists(alias)) {
			this.objectsMap.remove(alias);
			this.hScriptInterp.variables.remove(alias);
			this._console.logInfo(alias + " unregistered.");
		}
		this._console.logError(alias + " not found.");
	}
	,clearRegistry: function() {
		this.functionsMap = new haxe.ds.StringMap();
		this.objectsMap = new haxe.ds.StringMap();
	}
	,showHelp: function(args) {
		var output = "\n";
		if(args.length > 0) {
			var commandName = args[0].toLowerCase();
			if(commandName != null && commandName != "") {
				var $it0 = this.commandsMap.iterator();
				while( $it0.hasNext() ) {
					var command = $it0.next();
					if(commandName == command.alias || commandName == command.shortcut) {
						output += "command: " + command.alias.toUpperCase() + "\n";
						if(command.shortcut != "") output += "shortcut: " + "" + command.shortcut.toUpperCase() + "\n";
						output += command.description + "\n\n";
						output += command.help + "\n";
						this._console.logInfo(output);
						return;
					}
				}
			} else {
				this._console.logWarning("Command name not found");
				return;
			}
		} else {
			output += "Type COMMANDS to view available commands\n";
			output += "'PAGEUP' or 'PAGEDOWN' keys to scroll text\n";
			output += "'UP' or 'DOWN' keys to navigate history\n";
			this._console.logInfo(output);
		}
	}
	,showCommands: function(args) {
		var output = "";
		var $it0 = this.commandsMap.iterator();
		while( $it0.hasNext() ) {
			var command = $it0.next();
			var line = command.alias.toUpperCase();
			if(command.shortcut != "") line += " " + "(" + command.shortcut.toUpperCase() + ")";
			line = StringTools.rpad(line," ",20);
			line += command.description + "\n";
			output += line;
		}
		this._console.logInfo(output);
	}
	,listFunctions: function(args) {
		var list = "";
		var $it0 = this.functionsMap.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var line = "";
			line += key;
			line = StringTools.rpad(line," ",20);
			line += this.functionsMap.get(key).description + "\n";
			list += line;
		}
		if(list.toString() == "") {
			this._console.logInfo("no functions registered.");
			return;
		}
		this._console.logConfirmation(list);
	}
	,listObjects: function(args) {
		var list = "";
		var $it0 = this.objectsMap.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			list += key + "\n";
		}
		if(list.toString() == "") {
			this._console.logInfo("no objects registered.");
			return;
		}
		this._console.logConfirmation(list);
	}
	,listClasses: function(args) {
		var list = "";
		var $it0 = this.classMap.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			list += key + "\n";
		}
		if(list.toString() == "") {
			this._console.logInfo("no classes registered.");
			return;
		}
		this._console.logConfirmation(list);
	}
	,getFunction: function(alias) {
		if(this.functionsMap.exists(alias)) return this.functionsMap.get(alias).callback;
		return null;
	}
	,getObject: function(alias) {
		return this.objectsMap.get(alias);
	}
	,getCommand: function(alias) {
		alias = alias.toLowerCase();
		var $it0 = this.commandsMap.iterator();
		while( $it0.hasNext() ) {
			var command = $it0.next();
			if(command.alias == alias || command.shortcut == alias) return command;
		}
		return null;
	}
	,getClass: function(alias) {
		return this.classMap.get(alias);
	}
	,__class__: pgr.dconsole.DCCommands
};
pgr.dconsole.DCInterp = function() {
	hscript.Interp.call(this);
};
$hxClasses["pgr.dconsole.DCInterp"] = pgr.dconsole.DCInterp;
pgr.dconsole.DCInterp.__name__ = ["pgr","dconsole","DCInterp"];
pgr.dconsole.DCInterp.__super__ = hscript.Interp;
pgr.dconsole.DCInterp.prototype = $extend(hscript.Interp.prototype,{
	get: function(o,f) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		return Reflect.getProperty(o,f);
	}
	,set: function(o,f,v) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		Reflect.setProperty(o,f,v);
		return v;
	}
	,__class__: pgr.dconsole.DCInterp
});
pgr.dconsole.DCMonitor = function(console) {
	this.console = console;
	this.fields = new Array();
	this.setRefreshRate();
};
$hxClasses["pgr.dconsole.DCMonitor"] = pgr.dconsole.DCMonitor;
pgr.dconsole.DCMonitor.__name__ = ["pgr","dconsole","DCMonitor"];
pgr.dconsole.DCMonitor.prototype = {
	startTime: null
	,visible: null
	,refreshRate: null
	,fields: null
	,refreshTimer: null
	,hidden: null
	,console: null
	,show: function() {
		this.visible = true;
		this.stopTimer();
		this.startTimer();
		this.writeOutput();
	}
	,hide: function() {
		this.visible = false;
		this.stopTimer();
	}
	,addField: function(object,fieldName,alias) {
		var mfield = { object : object, field : fieldName, alias : alias};
		this.fields.push(mfield);
	}
	,clear: function() {
		this.fields = new Array();
	}
	,setRefreshRate: function(refreshRate) {
		if(refreshRate == null) refreshRate = 100;
		this.refreshRate = refreshRate;
		this.startTimer();
	}
	,writeOutput: function() {
		var output = new Array();
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			output.push(v.alias + ":" + Std.string(Reflect.getProperty(v.object,v.field)) + "\n");
		}
		this.console.interfc.writeMonitorOutput(output);
	}
	,stopTimer: function() {
		if(this.refreshTimer != null) {
			this.refreshTimer.stop();
			this.refreshTimer = null;
		}
	}
	,startTimer: function() {
		if(this.refreshTimer != null) this.stopTimer();
		this.refreshTimer = new haxe.Timer(this.refreshRate);
		this.refreshTimer.run = $bind(this,this.writeOutput);
	}
	,__class__: pgr.dconsole.DCMonitor
};
pgr.dconsole.DCProfiler = function(console) {
	this.console = console;
	this.history = new Array();
	this.samples = new Array();
	this.setRefreshRate();
};
$hxClasses["pgr.dconsole.DCProfiler"] = pgr.dconsole.DCProfiler;
pgr.dconsole.DCProfiler.__name__ = ["pgr","dconsole","DCProfiler"];
pgr.dconsole.DCProfiler.prototype = {
	refreshRate: null
	,visible: null
	,samples: null
	,history: null
	,console: null
	,refreshTimer: null
	,clear: function() {
		var _g = 0;
		var _g1 = this.samples;
		while(_g < _g1.length) {
			var sample = _g1[_g];
			++_g;
			if(sample.openInstances > 0) pgr.dconsole.DC.logWarning("cannot clear profiler while samples are open");
		}
		this.history = new Array();
		this.samples = new Array();
	}
	,show: function() {
		this.visible = true;
		this.startTimer();
		this.writeOutput();
	}
	,hide: function() {
		this.visible = false;
		this.stopTimer();
	}
	,begin: function(sampleName) {
		var sample = this.getSample(sampleName);
		if(sample != null) {
			sample.openInstances++;
			sample.instances++;
			sample.startTime = this.getTimeMS();
			sample.parentName = "";
			if(sample.openInstances > 1) throw sampleName + " already started.";
		} else {
			sample = { name : sampleName, startTime : this.getTimeMS(), elapsed : 0, instances : 1, openInstances : 1, numParents : 0, parentName : "", childrenElapsed : 0};
			this.samples.push(sample);
		}
		this.setSampleParent(sample);
	}
	,end: function(sampleName) {
		var sample = this.getSample(sampleName);
		if(sample == null) throw sampleName + "not found";
		var endTime = this.getTimeMS();
		var elapsed = endTime - sample.startTime;
		if(sample.openInstances < 1) throw sampleName + " is not started";
		sample.openInstances--;
		sample.elapsed += elapsed;
		if(sample.parentName != "") this.getSample(sample.parentName).childrenElapsed += elapsed;
		if(sample.numParents == 0) this.createHistory(sample);
	}
	,createHistory: function(sample) {
		var entry = this.getHistory(sample.name);
		if(entry != null) {
			entry.clearBranchSamples();
			entry.update(sample);
		} else {
			entry = new pgr.dconsole.SampleHistory(sample);
			this.history.push(entry);
		}
		var _g = 0;
		var _g1 = this.samples;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			if(s.numParents > 0 && s.name != sample.name) entry.addChildEntry(s);
			if(s.openInstances > 0) throw "cross sampling detected: " + s.name + " is still open inside " + sample.name;
			s.numParents = 0;
			s.parentName = "";
			s.elapsed = 0;
			s.openInstances = 0;
			s.instances = 0;
			s.childrenElapsed = 0;
		}
	}
	,setRefreshRate: function(refreshRate) {
		if(refreshRate == null) refreshRate = 100;
		this.refreshRate = refreshRate;
	}
	,getFormatedDisplay: function(data,addSeparator) {
		if(addSeparator == null) addSeparator = true;
		var formatted = "";
		formatted += StringTools.lpad(data," ",8);
		formatted += " ";
		if(addSeparator) formatted += "|";
		return formatted;
	}
	,writeOutput: function() {
		var output = "";
		output += this.getFormatedDisplay("EL");
		output += this.getFormatedDisplay("AVG");
		output += this.getFormatedDisplay("EL(%)");
		output += this.getFormatedDisplay("AVG(%)");
		output += this.getFormatedDisplay("#");
		output += this.getFormatedDisplay("NAME",false);
		output += "\n";
		output += StringTools.rpad("-","-",63);
		output += "\n";
		var _g = 0;
		var _g1 = this.history;
		while(_g < _g1.length) {
			var entry = _g1[_g];
			++_g;
			output += this.getFormatedDisplay(entry.getRelElapsed());
			output += this.getFormatedDisplay(entry.getRelAverage());
			output += this.getFormatedDisplay(entry.getPercentElapsed(entry.elapsed));
			output += this.getFormatedDisplay(entry.getPercentAverage(entry.totalElapsed));
			output += this.getFormatedDisplay(entry.branchInstances == null?"null":"" + entry.branchInstances);
			output += " " + entry.getFormattedName();
			output += "\n";
			var _g2 = 0;
			var _g3 = entry.childHistory;
			while(_g2 < _g3.length) {
				var child = _g3[_g2];
				++_g2;
				output += this.getFormatedDisplay(child.getRelElapsed());
				output += this.getFormatedDisplay(child.getRelAverage());
				output += this.getFormatedDisplay(child.getPercentElapsed(entry.elapsed));
				output += this.getFormatedDisplay(child.getPercentAverage(entry.totalElapsed));
				output += this.getFormatedDisplay(child.branchInstances == null?"null":"" + child.branchInstances);
				output += " " + child.getFormattedName();
				output += "\n";
			}
		}
		this.console.interfc.writeProfilerOutput(output);
	}
	,setSampleParent: function(sample) {
		sample.numParents = 0;
		var _g = 0;
		var _g1 = this.samples;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			if(s.openInstances > 0 && s.name != sample.name) {
				sample.numParents++;
				if(sample.parentName == "") sample.parentName = s.name; else if(s.numParents > this.getSample(sample.parentName).numParents) sample.parentName = s.name;
			}
		}
	}
	,getSample: function(sampleName) {
		var _g = 0;
		var _g1 = this.samples;
		while(_g < _g1.length) {
			var sample = _g1[_g];
			++_g;
			if(sample.name == sampleName) return sample;
		}
		return null;
	}
	,getHistory: function(entryName) {
		var _g = 0;
		var _g1 = this.history;
		while(_g < _g1.length) {
			var entry = _g1[_g];
			++_g;
			if(entry.name == entryName) return entry;
		}
		return null;
	}
	,stopTimer: function() {
		if(this.refreshTimer != null) {
			this.refreshTimer.stop();
			this.refreshTimer = null;
		}
	}
	,startTimer: function() {
		if(this.refreshTimer != null) this.stopTimer();
		this.refreshTimer = new haxe.Timer(this.refreshRate);
		this.refreshTimer.run = $bind(this,this.writeOutput);
	}
	,getTimeMS: function() {
		return Std["int"](haxe.Timer.stamp() * 1000);
	}
	,__class__: pgr.dconsole.DCProfiler
};
pgr.dconsole.SampleHistory = function(s) {
	this.nLogs = 0;
	this.numParents = 0;
	this.instances = 0;
	this.branchInstances = 0;
	this.totalChildrenElapsed = 0;
	this.childrenElapsed = 0;
	this.avgElapsed = 0;
	this.maxElapsed = 0;
	this.minElapsed = 0;
	this.totalElapsed = 0;
	this.elapsed = 0;
	this.name = "";
	this.childHistory = new Array();
	this.name = s.name;
	this.elapsed = s.elapsed;
	this.minElapsed = this.elapsed;
	this.maxElapsed = this.elapsed;
	this.update(s);
};
$hxClasses["pgr.dconsole.SampleHistory"] = pgr.dconsole.SampleHistory;
pgr.dconsole.SampleHistory.__name__ = ["pgr","dconsole","SampleHistory"];
pgr.dconsole.SampleHistory.prototype = {
	name: null
	,elapsed: null
	,totalElapsed: null
	,minElapsed: null
	,maxElapsed: null
	,avgElapsed: null
	,childrenElapsed: null
	,totalChildrenElapsed: null
	,branchInstances: null
	,instances: null
	,numParents: null
	,startTime: null
	,nLogs: null
	,childHistory: null
	,clearBranchSamples: function() {
		this.branchInstances = 0;
		var _g = 0;
		var _g1 = this.childHistory;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.branchInstances = 0;
		}
	}
	,update: function(s) {
		if(s.name != this.name) throw "updating history from different sample.";
		this.childrenElapsed = s.childrenElapsed;
		this.elapsed = s.elapsed;
		if(this.elapsed > this.maxElapsed) this.maxElapsed = this.elapsed;
		if(this.elapsed < this.minElapsed) this.minElapsed = this.elapsed;
		this.startTime = s.startTime;
		this.instances += s.instances;
		this.branchInstances += s.instances;
		this.numParents = s.numParents;
		this.totalElapsed += this.elapsed;
		this.totalChildrenElapsed += this.childrenElapsed;
		this.nLogs++;
	}
	,addChildEntry: function(s) {
		if(s.name == this.name) throw "adding " + s.name + " to " + this.name + " as child sample.";
		var child = this.getChild(s.name);
		if(child == null) {
			child = new pgr.dconsole.SampleHistory(s);
			this.childHistory.push(child);
		} else child.update(s);
	}
	,getElapsed: function() {
		return Std.string(this.elapsed);
	}
	,getAverage: function() {
		return Std.string(this.totalElapsed / this.nLogs);
	}
	,getMinElapsed: function() {
		return Std.string(this.minElapsed);
	}
	,getMaxElapsed: function() {
		return Std.string(this.maxElapsed);
	}
	,getRelElapsed: function() {
		return Std.string(this.elapsed - this.childrenElapsed);
	}
	,getRelAverage: function() {
		return Std.string((this.totalElapsed - this.totalChildrenElapsed) / this.nLogs | 0);
	}
	,getPercentElapsed: function(parentElapsed) {
		return Std.string(((this.elapsed - this.childrenElapsed) * 100 / parentElapsed * 10 | 0) / 10);
	}
	,getPercentAverage: function(totalTime) {
		return Std.string(((this.totalElapsed - this.totalChildrenElapsed) * 100 / totalTime * 10 | 0) / 10);
	}
	,getFormattedName: function() {
		var s = "";
		var _g1 = 0;
		var _g = this.numParents;
		while(_g1 < _g) {
			var i = _g1++;
			s += "    ";
		}
		s += this.name;
		return s;
	}
	,getChild: function(childName) {
		var _g = 0;
		var _g1 = this.childHistory;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.name == childName) return child;
		}
		return null;
	}
	,__class__: pgr.dconsole.SampleHistory
};
pgr.dconsole.DCThemes = function() {
};
$hxClasses["pgr.dconsole.DCThemes"] = pgr.dconsole.DCThemes;
pgr.dconsole.DCThemes.__name__ = ["pgr","dconsole","DCThemes"];
pgr.dconsole.DCThemes.current = null;
pgr.dconsole.DCThemes.prototype = {
	__class__: pgr.dconsole.DCThemes
};
pgr.dconsole.ALIAS_TYPE = $hxClasses["pgr.dconsole.ALIAS_TYPE"] = { __ename__ : ["pgr","dconsole","ALIAS_TYPE"], __constructs__ : ["COMMAND","OBJECT","FUNCTION"] };
pgr.dconsole.ALIAS_TYPE.COMMAND = ["COMMAND",0];
pgr.dconsole.ALIAS_TYPE.COMMAND.toString = $estr;
pgr.dconsole.ALIAS_TYPE.COMMAND.__enum__ = pgr.dconsole.ALIAS_TYPE;
pgr.dconsole.ALIAS_TYPE.OBJECT = ["OBJECT",1];
pgr.dconsole.ALIAS_TYPE.OBJECT.toString = $estr;
pgr.dconsole.ALIAS_TYPE.OBJECT.__enum__ = pgr.dconsole.ALIAS_TYPE;
pgr.dconsole.ALIAS_TYPE.FUNCTION = ["FUNCTION",2];
pgr.dconsole.ALIAS_TYPE.FUNCTION.toString = $estr;
pgr.dconsole.ALIAS_TYPE.FUNCTION.__enum__ = pgr.dconsole.ALIAS_TYPE;
pgr.dconsole.ALIAS_TYPE.__empty_constructs__ = [pgr.dconsole.ALIAS_TYPE.COMMAND,pgr.dconsole.ALIAS_TYPE.OBJECT,pgr.dconsole.ALIAS_TYPE.FUNCTION];
pgr.dconsole.DCUtil = function() { };
$hxClasses["pgr.dconsole.DCUtil"] = pgr.dconsole.DCUtil;
pgr.dconsole.DCUtil.__name__ = ["pgr","dconsole","DCUtil"];
pgr.dconsole.DCUtil.formatAlias = function(commands,alias,type) {
	var i = 1;
	if(alias == null || alias == "") return null;
	var r = new EReg("^[a-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*","");
	if(!r.match(alias)) return null;
	if(type == pgr.dconsole.ALIAS_TYPE.COMMAND) alias = alias.toLowerCase();
	var aux = alias;
	while(commands.getCommand(alias) != null || commands.getObject(alias) != null || commands.getFunction(alias) != null || commands.getClass(alias) != null) switch(type[1]) {
	case 0:
		alias = "c" + alias;
		break;
	case 2:
		alias = "f" + alias;
		break;
	case 1:
		alias = aux + (i == null?"null":"" + i);
		i++;
		break;
	}
	return alias;
};
pgr.dconsole.DConsole = function(input,interfc,theme) {
	if(input == null) input = new pgr.dconsole.input.DCEmptyInput();
	if(interfc == null) interfc = new pgr.dconsole.ui.DCEmtpyInterface();
	if(theme == null) pgr.dconsole.DCThemes.current = pgr.dconsole.DCThemes.DARK; else pgr.dconsole.DCThemes.current = theme;
	this.setConsoleKey(9);
	this.setMonitorKey(9,true);
	this.setProfilerKey(9,false,true);
	this.monitor = new pgr.dconsole.DCMonitor(this);
	this.profiler = new pgr.dconsole.DCProfiler(this);
	this.input = input;
	input.console = this;
	input.init();
	this.interfc = interfc;
	interfc.init();
	this.commands = new pgr.dconsole.DCCommands(this);
	this.clearHistory();
	this.enable();
	this.hideConsole();
	this.hideMonitor();
	this.hideProfiler();
	this.commands.registerCommand(($_=this.commands,$bind($_,$_.showHelp)),"help","","Type HELP [command-name] for more info");
	this.commands.registerCommand(($_=this.commands,$bind($_,$_.showCommands)),"commands","","Shows available commands","Type HELP [command-name] for more info");
	this.commands.registerCommand(($_=this.commands,$bind($_,$_.listFunctions)),"functions","funcs","Lists registered functions","To call a function type functionName( args ), make sure the args type and number are correct");
	this.commands.registerCommand(($_=this.commands,$bind($_,$_.listObjects)),"objects","objs","Lists registered objects","To print an object field type object.field\nTo set and object field type object.field = value");
	this.commands.registerCommand(($_=this.commands,$bind($_,$_.listClasses)),"classes","","Lists registered classes","Registered classes can access their static fields and methods, eg: Math.abs(value), or Math.PI");
	this.commands.registerCommand($bind(this,this.clearConsole),"clear","","Clears console view");
	this.commands.registerCommand($bind(this,this.toggleMonitor),"monitor","","Toggles monitor on and off","Monitor is used to track variable values in runtime\nCONTROL + CONSOLE_KEY (default TAB) also toggles monitor");
	this.commands.registerCommand($bind(this,this.toggleProfiler),"profiler","","Toggles profiler on and off","Profiler is used to profile app and view statistics like time elapsed and percentage in runtime\nSHIFT + CONSOLE_KEY (default TAB) also toggles profiler");
};
$hxClasses["pgr.dconsole.DConsole"] = pgr.dconsole.DConsole;
pgr.dconsole.DConsole.__name__ = ["pgr","dconsole","DConsole"];
pgr.dconsole.DConsole.prototype = {
	_historyArray: null
	,_historyIndex: null
	,input: null
	,interfc: null
	,monitor: null
	,profiler: null
	,commands: null
	,consoleKey: null
	,monitorKey: null
	,profilerKey: null
	,enabled: null
	,visible: null
	,showConsole: function() {
		this.visible = true;
		if(!this.enabled) return;
		this.interfc.showConsole();
	}
	,hideConsole: function() {
		this.visible = false;
		if(!this.enabled) return;
		this.interfc.hideConsole();
	}
	,enable: function() {
		this.enabled = true;
		if(this.visible) this.interfc.showConsole();
		if(this.monitor.visible) this.interfc.showMonitor();
		if(this.profiler.visible) this.interfc.showProfiler();
		this.input.enable();
	}
	,disable: function() {
		this.enabled = false;
		this.interfc.hideConsole();
		this.interfc.hideMonitor();
		this.interfc.hideProfiler();
		this.input.disable();
	}
	,setConsoleKey: function(keyCode,ctrlKey,shiftKey,altKey) {
		if(altKey == null) altKey = false;
		if(shiftKey == null) shiftKey = false;
		if(ctrlKey == null) ctrlKey = false;
		this.consoleKey = this.makeShorcutKey(keyCode,ctrlKey,shiftKey,altKey);
	}
	,setMonitorKey: function(keyCode,ctrlKey,shiftKey,altKey) {
		if(altKey == null) altKey = false;
		if(shiftKey == null) shiftKey = false;
		if(ctrlKey == null) ctrlKey = false;
		this.monitorKey = this.makeShorcutKey(keyCode,ctrlKey,shiftKey,altKey);
	}
	,setProfilerKey: function(keyCode,ctrlKey,shiftKey,altKey) {
		if(altKey == null) altKey = false;
		if(shiftKey == null) shiftKey = false;
		if(ctrlKey == null) ctrlKey = false;
		this.profilerKey = this.makeShorcutKey(keyCode,ctrlKey,shiftKey,altKey);
	}
	,makeShorcutKey: function(keyCode,ctrlKey,shiftKey,altKey) {
		if(altKey == null) altKey = false;
		if(shiftKey == null) shiftKey = false;
		if(ctrlKey == null) ctrlKey = false;
		return { altKey : altKey, ctrlKey : ctrlKey, shiftKey : shiftKey, keycode : keyCode};
	}
	,log: function(data,color) {
		if(color == null) color = -1;
		if(!(typeof(data) == "number") && !(typeof(data) == "boolean") && data == "") return;
		this.interfc.log(data,color);
		var scolor = StringTools.hex(color,6);
		var s = Std.string(data);
		var lines = s.split("\n");
		var _g = 0;
		while(_g < lines.length) {
			var l = lines[_g];
			++_g;
			eval("var event = new CustomEvent(\"console_log\", { detail: { data:\"" + l + "\", color:\"" + scolor + "\" }}); " + "document.dispatchEvent(event);");
		}
	}
	,logConfirmation: function(data) {
		this.log(data,pgr.dconsole.DCThemes.current.LOG_CON);
	}
	,logInfo: function(data) {
		this.log(data,pgr.dconsole.DCThemes.current.LOG_INF);
	}
	,logError: function(data) {
		this.log(data,pgr.dconsole.DCThemes.current.LOG_ERR);
	}
	,logWarning: function(data) {
		this.log(data,pgr.dconsole.DCThemes.current.LOG_WAR);
	}
	,clearConsole: function(args) {
		this.interfc.clearConsole();
	}
	,clearHistory: function() {
		this._historyArray = new Array();
		this._historyIndex = -1;
	}
	,monitorField: function(object,fieldName,alias) {
		if(fieldName == null || fieldName == "") {
			this.logError("invalid fieldName");
			return;
		}
		if(alias == null || alias == "") {
			this.logError("invalid alias");
			return;
		}
		if(object == null || !Reflect.isObject(object)) {
			this.logError("invalid object.");
			return;
		}
		try {
			Reflect.getProperty(object,fieldName);
		} catch( e ) {
			this.logError("could not find field: " + fieldName);
			return;
		}
		this.monitor.addField(object,fieldName,alias);
	}
	,toggleMonitor: function(args) {
		if(this.monitor.visible) this.hideMonitor(); else this.showMonitor();
	}
	,showMonitor: function() {
		this.hideProfiler();
		this.monitor.show();
		this.interfc.showMonitor();
	}
	,hideMonitor: function() {
		this.monitor.hide();
		this.interfc.hideMonitor();
	}
	,toggleProfiler: function(args) {
		if(this.profiler.visible) this.hideProfiler(); else this.showProfiler();
	}
	,showProfiler: function() {
		this.hideMonitor();
		this.profiler.show();
		this.interfc.showProfiler();
	}
	,hideProfiler: function() {
		this.profiler.hide();
		this.interfc.hideProfiler();
	}
	,prevHistory: function() {
		this._historyIndex--;
		if(this._historyIndex < 0) this._historyIndex = 0;
		if(this._historyIndex > this._historyArray.length - 1) return;
		this.interfc.setInputTxt(this._historyArray[this._historyIndex]);
		this.interfc.moveCarretToEnd();
	}
	,nextHistory: function() {
		if(this._historyIndex + 1 > this._historyArray.length - 1) return;
		this._historyIndex++;
		this.interfc.setInputTxt(this._historyArray[this._historyIndex]);
		this.interfc.moveCarretToEnd();
	}
	,processInputLine: function() {
		var currText = this.interfc.getInputTxt();
		if(currText == "" || currText == null) return;
		this._historyArray.splice(0,0,currText);
		this.resetHistoryIndex();
		this.log("> " + currText);
		this.interfc.clearInput();
		this.commands.evaluate(currText);
	}
	,resetHistoryIndex: function() {
		this._historyIndex = -1;
	}
	,scrollDown: function() {
		this.interfc.scrollConsoleDown();
	}
	,scrollUp: function() {
		this.interfc.scrollConsoleUp();
	}
	,__class__: pgr.dconsole.DConsole
};
pgr.dconsole.input = {};
pgr.dconsole.input.DCInput = function() { };
$hxClasses["pgr.dconsole.input.DCInput"] = pgr.dconsole.input.DCInput;
pgr.dconsole.input.DCInput.__name__ = ["pgr","dconsole","input","DCInput"];
pgr.dconsole.input.DCInput.prototype = {
	console: null
	,init: null
	,enable: null
	,disable: null
	,__class__: pgr.dconsole.input.DCInput
};
pgr.dconsole.input.DCEmptyInput = function() {
};
$hxClasses["pgr.dconsole.input.DCEmptyInput"] = pgr.dconsole.input.DCEmptyInput;
pgr.dconsole.input.DCEmptyInput.__name__ = ["pgr","dconsole","input","DCEmptyInput"];
pgr.dconsole.input.DCEmptyInput.__interfaces__ = [pgr.dconsole.input.DCInput];
pgr.dconsole.input.DCEmptyInput.prototype = {
	console: null
	,init: function() {
	}
	,enable: function() {
	}
	,disable: function() {
	}
	,__class__: pgr.dconsole.input.DCEmptyInput
};
pgr.dconsole.ui = {};
pgr.dconsole.ui.DCInterface = function() { };
$hxClasses["pgr.dconsole.ui.DCInterface"] = pgr.dconsole.ui.DCInterface;
pgr.dconsole.ui.DCInterface.__name__ = ["pgr","dconsole","ui","DCInterface"];
pgr.dconsole.ui.DCInterface.prototype = {
	init: null
	,showConsole: null
	,hideConsole: null
	,writeMonitorOutput: null
	,showMonitor: null
	,hideMonitor: null
	,writeProfilerOutput: null
	,showProfiler: null
	,hideProfiler: null
	,log: null
	,moveCarretToEnd: null
	,scrollConsoleUp: null
	,scrollConsoleDown: null
	,toFront: null
	,setConsoleFont: null
	,setPromptFont: null
	,setProfilerFont: null
	,setMonitorFont: null
	,inputRemoveLastChar: null
	,getInputTxt: null
	,setInputTxt: null
	,getConsoleText: null
	,clearInput: null
	,clearConsole: null
	,__class__: pgr.dconsole.ui.DCInterface
};
pgr.dconsole.ui.DCEmtpyInterface = function() {
};
$hxClasses["pgr.dconsole.ui.DCEmtpyInterface"] = pgr.dconsole.ui.DCEmtpyInterface;
pgr.dconsole.ui.DCEmtpyInterface.__name__ = ["pgr","dconsole","ui","DCEmtpyInterface"];
pgr.dconsole.ui.DCEmtpyInterface.__interfaces__ = [pgr.dconsole.ui.DCInterface];
pgr.dconsole.ui.DCEmtpyInterface.prototype = {
	init: function() {
	}
	,showConsole: function() {
	}
	,hideConsole: function() {
	}
	,writeMonitorOutput: function(output) {
	}
	,showMonitor: function() {
	}
	,hideMonitor: function() {
	}
	,writeProfilerOutput: function(output) {
	}
	,showProfiler: function() {
	}
	,hideProfiler: function() {
	}
	,log: function(data,color) {
	}
	,moveCarretToEnd: function() {
	}
	,scrollConsoleUp: function() {
	}
	,scrollConsoleDown: function() {
	}
	,toFront: function() {
	}
	,setConsoleFont: function(font,embed,size,bold,italic,underline) {
		if(underline == null) underline = false;
		if(italic == null) italic = false;
		if(bold == null) bold = false;
		if(size == null) size = 14;
		if(embed == null) embed = false;
	}
	,setPromptFont: function(font,embed,size,bold,italic,underline) {
		if(underline == null) underline = false;
		if(italic == null) italic = false;
		if(bold == null) bold = false;
		if(size == null) size = 16;
		if(embed == null) embed = false;
	}
	,setProfilerFont: function(font,embed,size,bold,italic,underline) {
		if(underline == null) underline = false;
		if(italic == null) italic = false;
		if(bold == null) bold = false;
		if(size == null) size = 14;
		if(embed == null) embed = false;
	}
	,setMonitorFont: function(font,embed,size,bold,italic,underline) {
		if(underline == null) underline = false;
		if(italic == null) italic = false;
		if(bold == null) bold = false;
		if(size == null) size = 14;
		if(embed == null) embed = false;
	}
	,inputRemoveLastChar: function() {
	}
	,getInputTxt: function() {
		return "";
	}
	,setInputTxt: function(string) {
	}
	,getConsoleText: function() {
		return "";
	}
	,clearInput: function() {
	}
	,clearConsole: function() {
	}
	,__class__: pgr.dconsole.ui.DCEmtpyInterface
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
if(Array.prototype.lastIndexOf) HxOverrides.lastIndexOf = function(a1,o1,i1) {
	return Array.prototype.lastIndexOf.call(a1,o1,i1);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
haxe.ds.ObjectMap.count = 0;
haxe.io.Output.LN2 = Math.log(2);
hscript.Parser.p1 = 0;
hscript.Parser.readPos = 0;
hscript.Parser.tokenMin = 0;
hscript.Parser.tokenMax = 0;
pgr.dconsole.DC.VERSION = "4.4.0";
pgr.dconsole.DC.ALIGN_DOWN = "DOWN";
pgr.dconsole.DC.ALIGN_UP = "UP";
pgr.dconsole.DCProfiler.NUM_SPACES = 8;
pgr.dconsole.DCThemes.LIGHT = { CON_C : 12961221, CON_TXT_C : 0, CON_A : .7, CON_TXT_A : 1, PRM_C : 12961221, PRM_TXT_C : 0, MON_C : 0, MON_TXT_C : 16777215, MON_A : .7, MON_TXT_A : .7, LOG_WAR : 6710784, LOG_ERR : 7798784, LOG_INF : 26214, LOG_CON : 30464};
pgr.dconsole.DCThemes.DARK = { CON_C : 3487029, CON_TXT_C : 16777215, CON_A : .7, CON_TXT_A : 1, PRM_C : 1118481, PRM_TXT_C : 16777215, MON_C : 0, MON_TXT_C : 16777215, MON_A : .7, MON_TXT_A : .7, LOG_WAR : 16776960, LOG_ERR : 16711680, LOG_INF : 65535, LOG_CON : 65280};
pgr.dconsole.DConsole.ALIGN_DOWN = "DOWN";
pgr.dconsole.DConsole.ALIGN_UP = "UP";
Main.main();
})(typeof window != "undefined" ? window : exports);
