define([],function(){
	var viewBox = function(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};
	viewBox.prototype.expand = function(d){
		return new viewBox(this.x - d, this.y - d, this.width + 2*d, this.height + 2*d);
	};
	return viewBox;
})