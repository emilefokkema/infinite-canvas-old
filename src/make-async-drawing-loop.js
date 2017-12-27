define(["viewbox"],function(viewBox){
	var divideViewBox = function(b){
		var size = Math.min(b.width, b.height) / 20;
		var i = 0,
			j = 0,
			w = Math.floor(b.width / size) + 1,
			h = Math.floor(b.height / size) + 1,
			done = {done:true};
		var box = function(){
			return {value:new viewBox(b.x + j * size, b.y + i * size, size, size)};
		};
		var next = function(){
			if(j == w){
				if(i == h){
					return done;
				}
				i++;
				j = 0;
				return box();
			}
			j++;
			return box();
		};
		return {next:next};
	};

	return function(f, onDraw, currentContextTransform, c, cWrapper){ //f: function(ctx, viewBox, done)
		var going, start, stop, currentTimeout, dividedBox, drawNext, nextBox, currentId = 0;
		start = function(){
			console.log("start");
			var latestViewBox = currentContextTransform.getTransformedViewBox();
			console.log(latestViewBox);
			dividedBox = divideViewBox(latestViewBox);
			
			going = true;
			drawNext = function(){
				if(going){
					nextBox = dividedBox.next();
					if(!nextBox.done){
						currentContextTransform.removeTransform();
						currentContextTransform.setTransform();
						f(cWrapper, nextBox.value, function(){
							currentTimeout = setTimeout(drawNext, 1);
						});
						currentContextTransform.resetTransform();
					}else{
						stop();
					}
				}
			};
			drawNext();
		};
		stop = function(){
			console.log("stop");
			going = false;
			
			if(currentTimeout){
				clearTimeout(currentTimeout);
			}
		};
		return {start:start,stop:stop};
	};
})