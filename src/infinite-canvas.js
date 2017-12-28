define([
	"wrap-canvas",
	"sender",
	"contextWrapper",
	"context-transform",
	"buffer",
	"make-async-drawing-loop"],
function(wrapCanvas, sender, contextWrapper, contextTransform, buffer, makeAsyncDrawingLoop){
	var mode = {
		SYNC:1,
		ASYNC:2
	};
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
			currentMode,
			
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
			cWrapper = contextWrapper(context, currentContextTransform),
			asyncDrawing,
			beginAsyncDrawing = function(f, size, chunkSize){
				var proxyOnDraw = function(ff){
					if(!ff){
						onDraw = sender();
					}else{
						onDraw.add(ff);
					}
					c.drawAll();
				};
				var loop = makeAsyncDrawingLoop(f, proxyOnDraw, currentContextTransform, c, cWrapper, size, chunkSize);
				loop.start();
				return loop;
			};
		c.onClick(function(x,y,shift){
			var pos = currentContextTransform.screenPositionToPoint(x, y);
			pos.shiftKey = shift;
			onClick(pos);
		});
		c.addEventListener('positiondragmove',function(e){
			if(asyncDrawing){
				asyncDrawing.pauze();
			}
			moveDrag(e.detail.toX, e.detail.toY);
			c.drawAll();
		});
		c.addEventListener('positiondragend',function(){
			endDrag();
			onDragEnd();
			if(asyncDrawing){
				asyncDrawing.start();
			}else{
				c.drawAll();
			}
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
			if(asyncDrawing){
				asyncDrawing.pauze();
			}
			changeZoom(e.detail.r);
			c.drawAll();
		});
		c.addEventListener('endzoom',function(e){
			endZoom();
			if(asyncDrawing){
				asyncDrawing.start();
			}
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
				if(asyncDrawing){
					asyncDrawing.pauze();
				}
				if(delta > 0){
					currentContextTransform.zoom(0.9, x, y);
					c.drawAll();
				}
				if(delta < 0){
					currentContextTransform.zoom(1.1, x, y);
					c.drawAll();
				}
				return currentContextTransform.getCurrentScale();
			}, function(){
				if(asyncDrawing){
					asyncDrawing.start();
				}
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
				if(currentMode === mode.ASYNC){
					throw "onDraw not available in async mode";
				}
				currentMode = mode.SYNC;
				if(!f){
					onDraw = sender();
				}else{
					onDraw.add(f);
				}
				c.drawAll();
			},
			drawAsync:function(obj){
				var f = obj.f;
				var size = obj.boxSize || 5;
				var chunkSize = obj.chunkSize || 1;
				if(currentMode === mode.SYNC){
					throw "onDrawAsync not available in sync mode";
				}
				currentMode = mode.ASYNC;
				if(!asyncDrawing){
					asyncDrawing = beginAsyncDrawing(f, size, chunkSize);
				}
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