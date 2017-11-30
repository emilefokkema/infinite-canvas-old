define(["sender"],function(sender){
	return function(canvas){
		var dragger = null;
		var onDraw = sender();
		var onClick = sender();
		var onContextMenu = sender(function(a,b){return a && b}, true);
		var onWheel = sender();
		var zoomer = null;
		var dragHappened = false;
		var rect = canvas.getBoundingClientRect();
		var w = rect.width,
			h = rect.height;
		canvas.setAttribute("width", w);
		canvas.setAttribute("height", h);
		canvas.setAttribute("style","width:"+w+"px;height:"+h+"px;");
		var context = canvas.getContext("2d");
		var initializeContext = function(){
			
		};
		var getScreenPosition = function(clientX, clientY){
			var rect = canvas.getBoundingClientRect();
			return {
				x:clientX - rect.left,
				y:clientY - rect.top
			};
		};
		var draggerFactory = (function(){
			var dispatchDragStart = function(x,y){
				var event = new CustomEvent('positiondragstart',{'detail':{x:x,y:y}});
				canvas.dispatchEvent(event);
			};
			var dispatchDragMove = function(toX, toY){
				var event = new CustomEvent('positiondragmove',{
					'detail':{
						toX:toX,
						toY:toY
					}
				});
				canvas.dispatchEvent(event);
			};
			var dispatchDragEnd = function(){
				var event = new CustomEvent('positiondragend');
				canvas.dispatchEvent(event);
			};
			var dispatchStartZoom = function(r){
				var event = new CustomEvent('startzoom', {'detail':{r:r}});
				canvas.dispatchEvent(event);
			};
			var dispatchEndZoom = function(){
				var event = new CustomEvent('endzoom');
				canvas.dispatchEvent(event);
			};
			var dispatchChangeZoom = function(r){
				var event = new CustomEvent('changezoom', {'detail':{r:r}});
				canvas.dispatchEvent(event);
			};
			var make = function(startX, startY, startId){
				dispatchDragStart(startX, startY);
				var firstTouch = {x:startX,y:startY,id:startId};
				var secondTouch;
				var getDistance = function(){
					return Math.sqrt(Math.pow(firstTouch.x - secondTouch.x,2) + Math.pow(firstTouch.y - secondTouch.y,2));
				};
				var moveTo = function(x, y, id){
					if(id == undefined || id == firstTouch.id){
						dispatchDragMove(x, y);
						if(id != undefined && id == firstTouch.id){
							firstTouch.x = x;
							firstTouch.y = y;
						}
					}else if(secondTouch && id == secondTouch.id){
						secondTouch.x = x;
						secondTouch.y = y;
						dispatchChangeZoom(getDistance());
					}
				};
				var end = function(id){
					if(id == undefined || id == firstTouch.id){
						dispatchDragEnd();
					}else if(secondTouch && id == secondTouch.id){
						dispatchEndZoom();
						secondTouch = null;
					}
				};
				var add = function(x, y, id){
					if(id != firstTouch.id && !secondTouch){
						secondTouch = {x:x,y:y,id:id};
						dispatchStartZoom(getDistance());
					}
				};
				return {
					moveTo:moveTo,
					end:end,
					add:add
				};
			};
			return {
				make:make
			};
		})();
		
		
		var mapTouchList = function(touchList, mapper){
			for(var i=0;i<touchList.length;i++){
				mapper(touchList.item(i));
			}
		};
		
		var drawAll = function(){
		 	canvas.width = w;
					onDraw();
		};
		
		canvas.addEventListener('click',function(e){
			if(dragHappened){
				dragHappened = false;
				e.stopPropagation();
				return false;
			}else{
				var screenPos = getScreenPosition(e.clientX, e.clientY);
				onClick(screenPos.x, screenPos.y, e.shiftKey);
			}
			
		});
		canvas.addEventListener('touchstart',function(e){
			mapTouchList(e.changedTouches, function(touch){
				var screenPos = getScreenPosition(touch.clientX, touch.clientY);
				if(!dragger){
					dragger = draggerFactory.make(screenPos.x, screenPos.y, touch.identifier);
				}else{
					dragger.add(screenPos.x, screenPos.y, touch.identifier);
				}
			});
		});
		canvas.addEventListener('touchend',function(e){
			if(!dragger){return;}
			mapTouchList(e.changedTouches, function(touch){
				dragger.end(touch.identifier);
			});
			if(e.touches.length == 0){
				dragger = null;
			}
		});
		canvas.addEventListener('touchmove',function(e){
			mapTouchList(e.changedTouches,function(touch){
				var screenPos = getScreenPosition(touch.clientX, touch.clientY);
				dragger.moveTo(screenPos.x, screenPos.y, touch.identifier);
			});
			dragHappened = true;
			e.preventDefault();
			return false;
		});
		canvas.addEventListener('mousedown',function(e){
			e.preventDefault();
			var screenPos = getScreenPosition(e.clientX, e.clientY);
			dragger = draggerFactory.make(screenPos.x, screenPos.y);
		});
		canvas.addEventListener('mousemove',function(e){
			if(dragger && (e.movementX != 0 || e.movementY != 0) ){
				var screenPos = getScreenPosition(e.clientX, e.clientY);
				dragger.moveTo(screenPos.x, screenPos.y);
				dragHappened = true;
			}
			return true;
		});
		canvas.addEventListener('mouseup',function(){
			if(dragger){
				dragger.end();
				dragger = null;
			}
		});
		canvas.addEventListener('contextmenu',function(e){
			if(dragger){
				dragger.end();
				dragger = null;
			}
			var screenPos = getScreenPosition(e.clientX, e.clientY);
			return onContextMenu(screenPos.x, screenPos.y, function(){e.preventDefault();});
		});
		canvas.addEventListener('wheel',function(e){
			var screenPos = getScreenPosition(e.clientX, e.clientY);
			onWheel(screenPos.x, screenPos.y, e.deltaY);
			e.preventDefault();
			return false;
		});
		return {
			w:w,
			h:h,
			context:context,
			onDraw:function(f){
				onDraw.add(f);
			},
			drawAll:drawAll,
			onClick:function(f){onClick.add(f);},
			onContextMenu:function(f){onContextMenu.add(f);},
			onWheel:function(f){onWheel.add(f);},
			addEventListener:function(name, handler){
				if(name == 'click'){
					onClick = handler;
				}else{
					canvas.addEventListener(name, handler);
				}
			},
			toDataURL:function(){return canvas.toDataURL.apply(canvas, arguments);}
		};
	};

	
});