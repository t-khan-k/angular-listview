
angular.module('app').directive('listView',function($compile,$timeout){
	return{
		restrict: 'E',
		scope:true,
		replace: false,
		link: function(scope,elem,attr){

			var exp = attr.repeater.split(' in ');
			var child = exp[0];
			var data = scope.$eval(exp[1]);
			var template = elem[0].innerHTML;
			scope.listViewSrc = data.slice();
			appendRepeater(child,'listViewSrc');
			var rowHeight = Math.floor(elem[0].lastChild.offsetHeight/scope.listViewSrc.length);

			var totalHeight = rowHeight * data.length;
			var topHeight = 0;
			var bottomHeight = 10;
			elem.prepend(angular.element("<div class='virtual-container-top' style='height: "+topHeight+"px'></div>"));
			elem.append(angular.element("<div class='virtual-container-bottom' style='height: "+bottomHeight+"px'></div>"));

			scope.$watchCollection(function(sc) {return sc.$eval(exp[1])},
				function(newVal,oldVal) {
					if(newVal !== oldVal){
						console.log("new val (list-view)");
						scope.listViewSrc = newVal;
					}
				}
			);

			elem.on('scroll',function(){
				var scrollTop = Math.ceil(elem[0].scrollTop) + 100;
				var threshold = 2;
				var firstIndex = Math.ceil(elem[0].scrollTop/rowHeight) - threshold;
				firstIndex = (firstIndex < 0)? 0 : firstIndex;
				var lastIndex = firstIndex + Math.ceil(elem[0].offsetHeight/rowHeight) + threshold - 1;
				var subArray = data.slice(firstIndex,lastIndex + 1);
				scope.$apply(function(){
					scope.listViewSrc = subArray.slice();
				});
				var topHeight = firstIndex * rowHeight;
				var bottomHeight = (data.length - lastIndex) * rowHeight;
				console.log("top: ",Math.floor(topHeight),", bottom: ",Math.floor(bottomHeight));
				angular.element('.virtual-container-top').css({height: topHeight});
				angular.element('.virtual-container-bottom').css({height: bottomHeight});
			});

			function appendRepeater(child,data){
				var tkRepeat = angular.element("<div class='tk-repeater' tk-repeat='"+child+" in "+data+"'></div>").html(template);
				elem.append($compile(tkRepeat)(scope));
			}
		}
	}
});