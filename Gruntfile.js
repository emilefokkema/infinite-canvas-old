module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs:{
			compile:{
				options:{
					    baseUrl: "src/",
					    name: "main",
					    out: "dist/infinite-canvas.min.js",
					    onModuleBundleComplete: function (data) {
						  var fs = module.require('fs'),
						    amdclean = module.require('amdclean'),
						    outputFile = data.path,
						    cleanedCode = amdclean.clean({
						      'filePath': outputFile
						    }),
						    wrapPath = outputFile.substr(0, outputFile.indexOf("dist/infinite-canvas.min.js")) + "src/wrap.js",
						  	wrapContent = fs.readFileSync(wrapPath,"UTF-8"),
						  	where = wrapContent.indexOf("//HERE"),
						  	wrap1 = wrapContent.substr(0,where),
						  	wrap2 = wrapContent.substr(where + 6);
						  cleanedCode = wrap1 + cleanedCode + wrap2;

						  fs.writeFileSync(outputFile, cleanedCode);
						}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('default',['requirejs']);

};