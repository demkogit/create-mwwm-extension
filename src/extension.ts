import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('createmwwm.createMwwm', async (fileUri: vscode.Uri) => {

		const input = await vscode.window.showInputBox();
		if (input === undefined) { return; }
		
		var prefix = input;

		var prefixForClass = _createPrefixForClass(prefix);
		var prefixForFile = createPrefixForFile(prefix);

		const wsedit = new vscode.WorkspaceEdit();

		createFile(wsedit, fileUri.path + `/wm/${prefixForFile}_wm.dart`, makeWidgetModelText(prefixForClass));
		createFile(wsedit, fileUri.path + `/ui/${prefixForFile}_widget.dart`, makeWidgetText(prefixForClass, `/wm/${prefixForFile}_wm.dart`,));

		vscode.workspace.applyEdit(wsedit);
	});

	context.subscriptions.push(disposable);
}

function createPrefixForFile(prefix: string): string {
	return prefix.toLowerCase().replace(' ', '_');
}

function _createPrefixForClass(prefix: string): string {
	return camelize(prefix).replace(' ', '');
}

function createFile(wsedit: vscode.WorkspaceEdit, path: string, text: string) {
	const wmPath = vscode.Uri.file(path);
	wsedit.createFile(wmPath, { ignoreIfExists: true });
	wsedit.insert(wmPath, new vscode.Position(0, 0), text);
}

function camelize(str: string) {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
		return word.toUpperCase();
	}).replace(/\s+/g, '');
}

function makeWidgetModelText(widgetName: String): string {
	const wm = widgetName + 'Wm';
	return `
	import 'package:surf_mwwm/surf_mwwm.dart';

	class ${wm} extends WidgetModel{
		${wm}() : super(
			const WidgetModelDependencies(),
		);

		@override
		void onLoad(){
			//TODO

			super.onLoad();
		}

		@override
		void onBind(){
			//TODO

			super.onBind();
		}
	}`;
}

function makeWidgetText(widgetName: string, pathToWmText: string): string {
	const wm = widgetName + 'Wm';
	const state = '_' + widgetName + 'State';
	return `
	import 'package:flutter/material.dart';
	import 'package:surf_mwwm/surf_mwwm.dart';
	import '..${pathToWmText}';

	class ${widgetName} extends CoreMwwmWidget<${wm}> {
		${widgetName}({Key? key})
			: super(
				key: key,
				widgetModelBuilder: (context) => ${wm}(),
			  );
	  
		@override
		WidgetState<CoreMwwmWidget<${wm}>, ${wm}>
			createWidgetState() => ${state}();
	  }
	  
	  class ${state} extends WidgetState<${widgetName}, ${wm}> {
		@override
		Widget build(BuildContext context) {
		  // TODO: implement build
		  throw UnimplementedError();
		}
	  }
	`;
}

export function deactivate() { }
