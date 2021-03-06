define(["viewbox"],function(viewBox){
	var divideViewBox = function(b, size){
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

	var callbackManagerFactory = function(){
		var open = [];
		var wrap = function(f){
			var cancelled = false;
			var result = function(){
				if(!cancelled){
					return f.apply(null, arguments);
				}
			};
			result.cancel = function(){
				cancelled = true;
				var openIndex = open.indexOf(result);
				if(openIndex > -1){
					open.splice(openIndex, 1);
				}
			};
			open.push(result);
			return result;
		};
		return {
			cancelOpen:function(){
				var openCopy = open.slice();
				openCopy.map(function(f){f.cancel();});
			},
			make:function(f){
				return wrap(f);
			}
		};
	};

	return function(f, onDraw, currentContextTransform, c, cWrapper, size, chunkSize){ //f: function(ctx, viewBox, done)
		var going, isComplete = false, start, stop, dividedBox, drawNext, nextBox, callbackManager = callbackManagerFactory(),
			startingTimeout, chunkCounter = 0;
		start = function(){
			if(going){return;}
			console.log("starting drawing loop");
			console.log(currentContextTransform.getCurrentScale());
			var latestViewBox = currentContextTransform.getTransformedViewBox();
			dividedBox = divideViewBox(latestViewBox, size / currentContextTransform.getCurrentScale());
			going = true;
			drawNext = function(){
				if(going){
					nextBox = dividedBox.next();
					if(!nextBox.done){
						currentContextTransform.removeTransform();
						currentContextTransform.setTransform();
						f(cWrapper, nextBox.value, callbackManager.make(function(){
							chunkCounter++;
							if(chunkCounter < chunkSize){
								drawNext();
							}else{
								chunkCounter = 0;
								setTimeout(drawNext, 1);
							}
						}));
						currentContextTransform.resetTransform();
					}else{
						going = false;
						isComplete = true;
					}
				}
			};
			drawNext();
		};
		stop = function(){
			going = false;
			isComplete = false;
			callbackManager.cancelOpen();
			var latestInverse = currentContextTransform.getCurrentInverseTransform();
			var url = c.toDataURL();
			var img = new Image();
			img.src = url;
			onDraw();
			onDraw(function(ctx){
				ctx.save();
				ctx.transform(latestInverse.a, latestInverse.b, latestInverse.c, latestInverse.d, latestInverse.e, latestInverse.f);
				ctx.drawImage(img, 0,0);
				ctx.restore();
			});
		};
		return {
			start:start,
			pauze:function(){
				if(going || isComplete){
					stop();
				}
				if(startingTimeout){
					clearTimeout(startingTimeout);
				}
				startingTimeout = setTimeout(start, 1000);
			}
		};
	};
})