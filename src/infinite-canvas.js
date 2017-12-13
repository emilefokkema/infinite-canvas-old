define([
	"wrap-canvas",
	"sender",
	"contextWrapper",
	"context-transform",
	"buffer"],
function(wrapCanvas, sender, contextWrapper, contextTransform, buffer){
	var factory = function(c){
		var w = c.w,
			h = c.h,
			context = c.context,
			currentContextTransform = contextTransform(context, w, h),
			onDraw = sender(),
			onClick = sender(),
			onDragEnd = sender(),
			onContextMenu = sender(function(a,b){return a && b}, true),
			onDragStart = sender(function(a,b){return a && b}, true),
			
			
			currentDrag = null,
			
			beginDrag = function(x,y){
				currentDrag = currentContextTransform.makeDrag(x, y);
			},
			moveDrag = function(x, y){
				if(currentDrag){
					currentDrag.drag(x, y);
				}
			},
			endDrag = function(){
				currentDrag = null;
			},
			startZoom = function(r){
				if(currentDrag){
					currentDrag.startZoom(r);
				}
			},
			changeZoom = function(r){
				if(currentDrag){
					currentDrag.changeZoom(r);
				}
			},
			endZoom = function(){
				if(currentDrag){
					currentDrag.endZoom();
				}
			},
			cWrapper = contextWrapper(context, currentContextTransform);
		c.onClick(function(x,y,shift){
			var pos = currentContextTransform.screenPositionToPoint(x, y);
			pos.shiftKey = shift;
			onClick(pos);
		});
		c.addEventListener('positiondragmove',function(e){
			moveDrag(e.detail.toX, e.detail.toY);
			c.drawAll();
		});
		c.addEventListener('positiondragend',function(){
			endDrag();
			onDragEnd();
			c.drawAll();
		});
		c.addEventListener('positiondragstart',function(e){
			var pos = currentContextTransform.screenPositionToPoint(e.detail.x, e.detail.y);
			if(onDragStart(pos.x, pos.y)){
				beginDrag(e.detail.x, e.detail.y);
			}
		});
		c.addEventListener('startzoom',function(e){
			startZoom(e.detail.r);
		});
		c.addEventListener('changezoom',function(e){
			changeZoom(e.detail.r);
			c.drawAll();
		});
		c.addEventListener('endzoom',function(e){
			endZoom();
		});
		c.onDraw(function(){
			currentContextTransform.removeTransform();
			currentContextTransform.setTransform();
			onDraw(cWrapper);
			currentContextTransform.resetTransform();
		});
		c.onContextMenu(function(clientX, clientY, preventDefault){
			var pos = currentContextTransform.screenPositionToPoint(clientX, clientY);
			return onContextMenu(clientX, clientY, pos.x, pos.y, preventDefault);
		});
		c.onWheel(
			buffer(function(x, y, delta){
				var factor = Math.pow(2, -delta / 100);
				return currentContextTransform.getCurrentScale() * factor;
			}, function(current, goal){
				return current < goal * 0.9 || current > goal * 1.1;
			}, function(x, y, delta){
				if(delta > 0){
					currentContextTransform.zoom(0.9, x, y);
					c.drawAll();
				}
				if(delta < 0){
					currentContextTransform.zoom(1.1, x, y);
					c.drawAll();
				}
				return currentContextTransform.getCurrentScale();
			}));
		var infCan = {
			onDragMove:function(f){
				c.addEventListener('positiondragmove', function(e){
					var pos = currentContextTransform.screenPositionToPoint(e.detail.toX, e.detail.toY);
					f(pos.x, pos.y);
				});
			},
			onMouseMove:function(f){
				c.addEventListener('custommousemove', function(e){
					var pos = currentContextTransform.screenPositionToPoint(e.detail.x, e.detail.y);
					f(pos.x, pos.y);
				});
			},
			zoom:currentContextTransform.zoom,
			drawAll:function(){c.drawAll();},
			onDraw:function(f){
				onDraw.add(f);
				c.drawAll();
			},
			onClick:function(f){onClick.add(f);},
			onContextMenu:function(f){onContextMenu.add(f);},
			onDragStart:function(f){onDragStart.add(f);},
			onDragEnd:function(f){onDragEnd.add(f);},
			toDataURL:function(){return c.toDataURL.apply(null,arguments);}
		};
		Object.defineProperty(infCan, "scale", {
			get:function(){
				return currentContextTransform.getCurrentScale();
			}
		});
		Object.defineProperty(infCan, "transform", {
			get:function(){
				return currentContextTransform.getCurrentTransform();
			}
		});
		return infCan;
	};
	return function(canvas){
		return factory(wrapCanvas(canvas));
	};
});