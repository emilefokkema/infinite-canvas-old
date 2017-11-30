;(function(){
	var something = {};
	//HERE
	if(typeof define === "function"){
		define("infiniteCanvas",[],function(){return something.infiniteCanvas;})
	}else{
		window.infiniteCanvas = something.infiniteCanvas;
	}
})()