requirejs.config({baseUrl:"./src"});
requirejs(["infinite-canvas","requireElement"], function(infiniteCanvas, requireElement){
	var examples = [
		{
			code:function(ctx){
				ctx.save();
				 ctx.scale(10, 3);
				 ctx.fillRect(1, 10, 10, 10);
				 ctx.restore();

				 // mirror horizontally
				 ctx.scale(-1, 1);
				 ctx.font = '48px serif';
				 ctx.fillText('MDN', -135, 120);
			}
		},
		{
			code:function(ctx){
				ctx.fillRect(0, 0, 150, 150);   // Draw a rectangle with default settings
				  ctx.save();                  // Save the default state
				 
				  ctx.fillStyle = '#09F';      // Make changes to the settings
				  ctx.fillRect(15, 15, 120, 120); // Draw a rectangle with new settings

				  ctx.save();                  // Save the current state
				  ctx.fillStyle = '#FFF';      // Make changes to the settings
				  ctx.globalAlpha = 0.5; 
				  ctx.fillRect(30, 30, 90, 90);   // Draw a rectangle with new settings

				  ctx.restore();               // Restore previous state
				  ctx.fillRect(45, 45, 60, 60);   // Draw a rectangle with restored settings

				  ctx.restore();               // Restore original state
				  ctx.fillRect(60, 60, 30, 30);   // Draw a rectangle with restored settings
			}
		},
		{
			code:function(ctx){
				for (var i = 0; i < 3; i++) {
				    for (var j = 0; j < 3; j++) {
				      ctx.save();
				      ctx.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
				      ctx.translate(10 + j * 50, 10 + i * 50);
				      ctx.fillRect(0, 0, 25, 25);
				      ctx.restore();
				    }
				  }
			}
		},
		{
			code:function(ctx){
				// left rectangles, rotate from canvas origin
				  ctx.save();
				  // blue rect
				  ctx.fillStyle = '#0095DD';
				  ctx.fillRect(30, 30, 100, 100); 
				  ctx.rotate((Math.PI / 180) * 25);
				  // grey rect
				  ctx.fillStyle = '#4D4E53';
				  ctx.fillRect(30, 30, 100, 100);
				  ctx.restore();

				  // right rectangles, rotate from rectangle center
				  // draw blue rect
				  ctx.fillStyle = '#0095DD';
				  ctx.fillRect(150, 30, 100, 100);  
				  
				  ctx.translate(200, 80); // translate to rectangle center 
				                          // x = x + 0.5 * width
				                          // y = y + 0.5 * height
				  ctx.rotate((Math.PI / 180) * 25); // rotate
				  ctx.translate(-200, -80); // translate back
				  
				  // draw grey rect
				  ctx.fillStyle = '#4D4E53';
				  ctx.fillRect(150, 30, 100, 100);
			}
		},
		{
			code:function(ctx){
				var sin = Math.sin(Math.PI / 6);
				  var cos = Math.cos(Math.PI / 6);
				  ctx.translate(100, 100);
				  var c = 0;
				  for (var i = 0; i <= 12; i++) {
				    c = Math.floor(255 / 12 * i);
				    ctx.fillStyle = 'rgb(' + c + ', ' + c + ', ' + c + ')';
				    ctx.fillRect(0, 0, 100, 10);
				    ctx.transform(cos, sin, -sin, cos, 0, 0);
				  }
				  
				  ctx.setTransform(-1, 0, 0, 1, 100, 100);
				  ctx.fillStyle = 'rgba(255, 128, 255, 0.5)';
				  ctx.fillRect(0, 50, 100, 100);
			}
		},
		{
			code:function(ctx){
				ctx.fillStyle = '#ccc';
				ctx.fillRect(30,30,-Infinity,-Infinity);
				ctx.fillStyle = '#000';
				ctx.rotate(Math.PI/8);
				ctx.fillRect(0,0,Infinity,10);
				ctx.fillStyle = '#f00';
				ctx.beginPath();
				ctx.arc(0,0,20,0,2*Math.PI);
				ctx.fill();
				ctx.strokeStyle = '#0f0';
				ctx.lineWidth = 3;
				ctx.strokeRect(20,-Infinity,Infinity,Infinity);
			}
		},{
			code:function(ctx){
				var gradient = ctx.createLinearGradient(0,0,200,0);
				gradient.addColorStop(0,"green");
				gradient.addColorStop(1,"white");
				ctx.fillStyle = gradient;
				ctx.fillRect(10,10,200,100);
			}
		},{
			code:function(ctx){
				ctx.beginPath();
				ctx.moveTo(150, 20);
				ctx.arcTo(150, 100, 50, 20, 30);
				ctx.lineTo(50, 20)
				ctx.stroke();

				ctx.fillStyle = 'blue';
				// starting point
				ctx.fillRect(150, 20, 10, 10);

				ctx.fillStyle = 'red';
				// control point one
				ctx.fillRect(150, 100, 10, 10);
				// control point two
				ctx.fillRect(50, 20, 10, 10);
			}
		},
		{
			preliminaryCode:function(canvas){
				var alongIntegerX = {
					initialIndex:function(viewBox){
						return Math.ceil(viewBox.x / 20);
					},
					includeIndex:function(index, viewBox){
						var val = 20 * index;
						return val >= viewBox.x - 20 && val <= viewBox.x + viewBox.width + 20;
					},
					transform:function(index, context){
						context.translate(20 * index, 0);
					}
				};
				var alongIntegerY = {
					initialIndex:function(viewBox){
						return Math.ceil(viewBox.y / 20);
					},
					includeIndex:function(index, viewBox){
						var val = 20 * index;
						return val >= viewBox.y - 20 && val <= viewBox.y + viewBox.height + 20;
					},
					transform:function(index, context){
						context.translate(0, 20 * index);
					}
				};
				return [alongIntegerX,alongIntegerY];
			},
			code:function(ctx, alongIntegerX, alongIntegerY){
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				
				ctx.rotate(Math.PI/4);
				var i,j;
				for(i of ctx.transformMultiple(alongIntegerX)){
					ctx.beginPath();
					ctx.rect(0,-Infinity,Infinity,Infinity);
					ctx.stroke();
				}
				for(j of ctx.transformMultiple(alongIntegerY)){
					ctx.beginPath();
					ctx.rect(-Infinity,0,Infinity,Infinity);
					ctx.stroke();
				}
				for(i of ctx.transformMultiple(alongIntegerX)){
					for(j of ctx.transformMultiple(alongIntegerY)){
						ctx.fillStyle = 'hsl('+(i+j)*50+',50%,50%)';
						ctx.beginPath();
						ctx.arc(0,0,5,0,2*Math.PI);
						ctx.fill();
					}
				}
			}
		},
		{
			preliminaryCode:function(){
				var getRing = function(viewBox){
					var maxX = viewBox.x + viewBox.width,
						maxY = viewBox.y + viewBox.height,
						r1 = Math.sqrt(viewBox.x * viewBox.x + viewBox.y * viewBox.y),
						r2 = Math.sqrt(maxX * maxX + viewBox.y * viewBox.y),
						r3 = Math.sqrt(viewBox.x * viewBox.x + maxY * maxY),
						r4 = Math.sqrt(maxX * maxX + maxY * maxY);
					if(viewBox.x >= 0){
						if(viewBox.y >= 0){
							return {minR:r1,maxR:r4};
						}else if(viewBox.y < 0 && maxY >=0){
							return {minR:viewBox.x,maxR:Math.max(r2,r4)};
						}else{
							return {minR:r3,maxR:r2};
						}
					}else if(viewBox.x < 0 && maxX >= 0){
						if(viewBox.y >= 0){
							return {minR:viewBox.y,maxR:Math.max(r3,r4)};
						}else if(viewBox.y < 0 && maxY >=0){
							return {minR:0,maxR:Math.max(r1,r2,r3,r4)};
						}else{
							return {minR:-maxY,maxR:Math.max(r1,r2)};
						}
					}else{
						if(viewBox.y >= 0){
							return {minR:r2,maxR:r3};
						}else if(viewBox.y < 0 && maxY >=0){
							return {minR:-maxX,maxR:Math.max(r1,r3)};
						}else{
							return {minR:r4,maxR:r1};
						}
					}
				};
				var expand = {
					initialIndex:function(viewBox){
						var ring = getRing(viewBox);
						return Math.floor(Math.log(ring.maxR * 10/9) / Math.log(1.1));
					},
					includeIndex:function(index, viewBox){
						var r = Math.exp(index * Math.log(1.1));
						var ring = getRing(viewBox);
						return 11*r/10 >= ring.minR && 9*r/10 <= ring.maxR;
					},
					transform:function(index, context){
						var s = Math.exp(index * Math.log(1.1));
						context.rotate(index/2);
						context.translate(s, 0);
						context.scale(s/10, s/10);
					}
				};
				return [expand];
			},
			code:function(ctx, expand){
				
				for(var i of ctx.transformMultiple(expand)){
					ctx.fillStyle = 'hsl('+20*i+',50%,50%)';
					ctx.beginPath();
					ctx.arc(0,0,1,0,2*Math.PI);
					ctx.fill();
					ctx.fillStyle = '#f00';
					ctx.beginPath();
					ctx.arc(0,0,0.5,0,2*Math.PI);
					ctx.fill();
				}
			}
		},
		{
			preliminaryCode:function(){
				var expand = {
					initialIndex:function(viewBox){
						viewBox = viewBox.expand(1);
						var maxR = Math.max(Math.abs(viewBox.x), Math.abs(viewBox.x + viewBox.width), Math.abs(viewBox.y), Math.abs(viewBox.y + viewBox.height));
						return Math.floor(maxR);
					},
					includeIndex:function(index, viewBox){
						viewBox = viewBox.expand(1);
						var maxR = Math.max(Math.abs(viewBox.x), Math.abs(viewBox.x + viewBox.width), Math.abs(viewBox.y), Math.abs(viewBox.y + viewBox.height));
						var minR;
						if(viewBox.x < 0 && viewBox.x + viewBox.width > 0 && viewBox.y < 0 && viewBox.y + viewBox.height > 0){
							minR = 0;
						}else{
							minR = Math.min(Math.abs(viewBox.x), Math.abs(viewBox.x + viewBox.width), Math.abs(viewBox.y), Math.abs(viewBox.y + viewBox.height));
						}
						return index >= minR && index <= maxR;
					},
					transform:function(index, context){
						context.scale(index + 1, index + 1);
					}
				};
				return [expand];
			},
			code:function(ctx, expand){
				
				for(var i of ctx.transformMultiple(expand)){
					if(i % 2 === 0){
						ctx.fillStyle = '#f00';
					}else{
						ctx.fillStyle = '#00f';
					}
					ctx.fillRect(-1,-1,2,2);
				}
			}
		}
	];
	var getBody = function(f){
		var body = f.toString().match(/^\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\}\s*$/)[1];
		var lines = body.split(/\n/g).filter(function(l){return l.length > 0 && !l.match(/^\s+$/);});
		while(!lines.some(function(l){return !l.match(/^\s/);})){
			lines = lines.map(function(l){return l.replace(/^\s/g,"");});
		}
		return lines.join("\n");
	};

	examples.map(function(e){
		requireElement(document.getElementById("example"), function(canvas1, makeCanvas2, code){
			var preliminaryCodeResult = [];
			var codeHtml = getBody(e.code);
			var c = infiniteCanvas(canvas1);
			if(e.preliminaryCode){
				var preliminaryCodeBody = getBody(e.preliminaryCode);
				codeHtml = preliminaryCodeBody.replace(/return \[[^\]]+\];/g,"")+codeHtml;
				preliminaryCodeResult = e.preliminaryCode(c);
			}else{
				makeCanvas2(function(canvas2){
					var ctx = canvas2.getContext("2d");
					e.code(ctx);
				});
			}
			
			
			code.innerHTML = codeHtml;
			c.onDraw(function(ctx){e.code.apply(null,[ctx].concat(preliminaryCodeResult))});
			
		});
	});

	var asyncCanvas = infiniteCanvas(document.getElementById("asyncCanvas"));
	asyncCanvas.drawAsync({
		f:function(ctx, viewBox, done){
			ctx.fillStyle = 'hsl('+100*(Math.sin(viewBox.x) + Math.sin(viewBox.y))+',50%,50%)';
			ctx.fillRect(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
			done();
		},
		boxSize:3,
		chunkSize:30
	});
	var escapeStep = function(maxIt, x, y){
		var zrn, zin, zr = 0, zi = 0, cr = x, ci = y, step = 0, modsq = 0;
		while(modsq < 4 && step++ < maxIt){
			zrn = zr * zr - zi * zi + cr;
			zin = 2 * zr * zi + ci;
			zr = zrn;
			zi = zin;
			modsq = zr * zr + zi * zi;
		}

		return {modsq:modsq, step:step};
	};
	var colorScheme = {
		lightness: function(normalizedStep){
			return 50 * (1 + Math.sin(normalizedStep / 20));
		},
		hue: function(normalizedStep){
			return normalizedStep*2;
		}
	};
	var asyncCanvas2 = infiniteCanvas(document.getElementById("asyncCanvas2"));
	asyncCanvas2.drawAsync({
		f:function(ctx, viewBox, done){
			var esc = escapeStep(4000,viewBox.x / 100, viewBox.y / 100);
			if(esc.modsq < 4){
				ctx.fillStyle = '#000';
				ctx.fillRect(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
			}else{
				var normalizedStep = esc.step + 1 - Math.log(Math.log(Math.sqrt(esc.modsq))) * 1.4426950408889634;
				ctx.fillStyle = 'hsl('+colorScheme.hue(normalizedStep)+',50%,'+colorScheme.lightness(normalizedStep)+'%)';
				ctx.fillRect(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
			}
			done();
		},
		boxSize:3,
		chunkSize:30
	});
})
