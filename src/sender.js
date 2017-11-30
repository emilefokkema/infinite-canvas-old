define(function(){
	return function(reducer, initialValue){
		if(reducer && arguments.length == 1){
			throw 'when making a sender with a reducer, please supply an initial value';
		}
		var todo= [];
		var f = function(){
			var args = arguments;
			var mapped = todo.map(function(g){
				return g.apply(null, args);
			});
			if(reducer){
				return mapped.reduce(reducer, initialValue);
			}
		};
		f.add = function(g){todo.push(g);return f;};
		f.remove = function(g){
			var index;
			if((index = todo.indexOf(g))!=-1){
				todo.splice(index,1);
			}
		};
		return f;
	};
});