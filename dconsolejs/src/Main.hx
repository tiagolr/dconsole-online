package ;

import haxe.PosInfos;
import js.Lib;
import pgr.dconsole.DC;
import pgr.dconsole.DConsole;
import pgr.dconsole.ui.DCEmtpyInterface;

/**
 * ...
 * @author TiagoLr
 */
@:expose
class Main {
	
	static function main() {
		haxe.Log.trace = function(v : Dynamic, ?inf : PosInfos) { DC.log(v); }
	}
	
	public static function init() {
		DC.init();
		DC.eval('help');
		
		var cmds = DC.instance.commands.commandsMap;
		
		if (cmds.exists('monitor')) {
			cmds.remove('monitor');
		}
		
		if (cmds.exists('profiler')) {
			cmds.remove('profiler');
		}
		
		DC.registerFunction(runCode, "run", "Runs the code inside the text editor");
	}
	
	static private function runCode() {
		Lib.eval('document.dispatchEvent(new Event("console_run"));');
	}
}
