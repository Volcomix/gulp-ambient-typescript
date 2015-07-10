/// <reference path="typings/node/node.d.ts" />

var through2 = require('through2');
var minimatch = require('minimatch')

function convertToAmbientModule(declarationFile, moduleName) {
	return through2.obj(function (chunk, enc, callback) {
		if (minimatch(chunk.relative, declarationFile)) {
			chunk.contents = new Buffer(
				chunk.contents.toString()
					.replace(/declare /g, '')
					.replace(/(.*)/g, '    $1')
					.replace(
					/^\s*\/\/\/\s*<reference[^>]*\/>/,
					'declare module "' + moduleName + '" {\n')
				+ "\n}");

			this.push(chunk);
		}
		callback();
	});
}

module.exports = convertToAmbientModule;