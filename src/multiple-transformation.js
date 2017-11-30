define(["transform"],function(transform){
	var mt = function(specs, currentContextTransform){
		this.specs = specs;
		this.currentContextTransform = currentContextTransform;
	};
	mt.prototype.getTransformableContext = function(){
		var currentContextTransform = this.currentContextTransform;
		return {
			transform:function(a,b,c,d,e,f){
				currentContextTransform.addToCurrentTransform(new transform(a,b,c,d,e,f));
			},
			rotate:function(a){
				currentContextTransform.addToCurrentTransform(transform.rotation(a));
			},
			scale:function(x,y){
				currentContextTransform.addToCurrentTransform(transform.scale(x,y));
			},
			translate:function(x,y){
				currentContextTransform.addToCurrentTransform(transform.translation(x,y));
			}
		};
	};
	mt.prototype.makeIterable = function(){
		if(typeof Symbol === "function"){
			var iteratorSymbol = Symbol.iterator;
			var result = {};
			var iterator = this.makeIterator();
			result[iteratorSymbol] = function(){return iterator;};
			return result;
		}
	};
	mt.prototype.makeIterator = function(){
		var viewBox = this.currentContextTransform.getTransformedViewBox();
		var initialIndex = this.specs.initialIndex || 0;
		if(typeof initialIndex === "function"){
			initialIndex = initialIndex(viewBox);
		}
		var currentIndex = initialIndex;
		var includeIndex = this.specs.includeIndex || function(){return false;};
		var transform = this.specs.transform || function(){};
		var goingup = true, counter = 0, started = false, plusLimitPoint = this.specs.plusLimitPoint, minLimitPoint = this.specs.minLimitPoint;
		var plusEnds = !includeIndex(Infinity, viewBox);
		var minEnds = !includeIndex(-Infinity, viewBox);
		var transformableContext = this.getTransformableContext();
		var currentContextTransform = this.currentContextTransform;
		var next = function(){
			counter++;
			if(includeIndex(currentIndex, viewBox) && (counter < 100 || goingup && plusEnds || !goingup && minEnds)){
				var v = {
					value:currentIndex,
					done:false
				};
				if(started){
					currentContextTransform.restoreTransform();
				}
				
				currentContextTransform.saveTransform();
				transform(currentIndex, transformableContext);
				started = true;
				if(goingup){
					currentIndex++;
				}else{
					currentIndex--;
				}
				return v;
			}else{
				if(goingup){
					goingup = false;
					currentIndex = initialIndex - 1;
					counter = 0;
					return next();
				}else{
					currentContextTransform.restoreTransform();
					return {done:true};
				}
			}
		};
		return {
			next:next
		};
	};
	mt.prototype.each = function(f){
		var viewBox = this.currentContextTransform.getTransformedViewBox();
		var minIndex = this.specs.minIndex(viewBox);
		var maxIndex = this.specs.maxIndex(viewBox);
		

		for(var i = minIndex; i<=maxIndex; i++){
			this.currentContextTransform.saveTransform();
			this.specs.transform(i, this.transformableContext);
			f();
			this.currentContextTransform.restoreTransform();
		}
	};
	
	return mt;
})