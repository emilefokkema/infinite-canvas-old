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
			if(j <= w && i <= h){
				var r = box();
				j++;
				if(j > w){
					j = 0;
					i++;
				}
				return r;
			}
			return done;
		};
		return {next:next};
	};

	return function(f, onDraw, currentContextTransform, c, cWrapper){ //f: function(ctx, viewBox, done)
		var going, start, stop, dividedBox, drawNext, nextBox, currentId = 0;
		start = function(){
			console.log("start");
			var latestViewBox = currentContextTransform.getTransformedViewBox();
			console.log(latestViewBox);
			dividedBox = divideViewBox(latestViewBox);
			
			going = true;
			drawNext = function(){
				if(going){
					console.log("calling next");
					nextBox = dividedBox.next();
					if(!nextBox.done){
						currentContextTransform.removeTransform();
						currentContextTransform.setTransform();
						f(cWrapper, nextBox.value, function(){
							setTimeout(drawNext, 1);
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
			
			
		};
		return {start:start,stop:stop};
	};
})