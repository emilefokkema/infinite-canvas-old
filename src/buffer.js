define([],function(){
	var buffer = function(setGoal, shouldMove, doStep){
		var goal, current, latestArgs, going = false;
		var toRepeat = function(){
			current = doStep.apply(null, latestArgs);
			var again = shouldMove(current, goal);
			if(again){
				setTimeout(toRepeat, 10);
			}else{
				going = false;
			}
		};
		return function(){
			latestArgs = Array.prototype.slice.apply(arguments);
			goal = setGoal.apply(null, latestArgs);
			if(!going){
				going = true;
				toRepeat();
			}
		};
	};
	return buffer;
})