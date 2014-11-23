package ;

import haxe.PosInfos;
import haxe.Timer;
import js.Lib;
import pgr.dconsole.DC;
import pgr.dconsole.DConsole;
import pgr.dconsole.ui.DCEmtpyInterface;
import js.JQuery;

/**
 * ...
 * @author TiagoLr
 */
@:expose
class Main {
	
	static var examples:Array<Dynamic>;
	
	static function main() {
		haxe.Log.trace = function(v : Dynamic, ?inf : PosInfos) { DC.log(v); }
	}
	
	public static function init() {
		DC.init();
		DC.eval('help');
		DC.registerClass(Std, "Std");
		DC.registerClass(Lib, "Lib");
		DC.registerClass(JQuery, "JQuery");
		DC.registerClass(StringTools, "StringTools");
		DC.registerClass(Timer, "Timer");
		
		var cmds = DC.instance.commands.commandsMap;
		
		if (cmds.exists('monitor')) {
			cmds.remove('monitor');
		}

		if (cmds.exists('profiler')) {
			cmds.remove('profiler');
		}
		
		DC.registerFunction(runCode, "run", "Runs the code inside the text editor");
		
		examples = new Array<Dynamic>();
		addExample('01_Hello_World');
		addExample('02_Ascii_Maze');
		addExample('03_Page_Hack');
	}
	
	static public function prepareExamples(codeMirror:Dynamic) {
		var exList = new JQuery('#examples-list');
		
		var i = 0;
		for (ex in examples) {
			var title = ex.title;
			var id = 'exBtn$i';
			
			exList.append('<li><a id="$id" href="#">$title</a></li>');
			
			var btn = new JQuery('#$id');
			btn.on('click', function(evt) {
				codeMirror.setValue(ex.body);
			});
			i++;
		}
	}
	
	static private function runCode() {
		Lib.eval('document.dispatchEvent(new Event("console_run"));');
	}
	
	static function addExample(title:String) {
		var s = haxe.Resource.getString(title);
		if (s == null) return;
		
		title = StringTools.replace(title,"_"," "); // replace underscores with spaces
		title = title.substr(3); // remove example number
		examples.push( { title:title, body:s } );
	}
}
