
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
			scope.listViewSrc = data.slice().slice(0,10);
			appendRepeater(child,'listViewSrc');
			var rowHeight = elem[0].lastChild.offsetHeight/scope.listViewSrc.length;

			scope.$watchCollection(function(sc) {return sc.$eval(exp[1])},
				function(newVal,oldVal) {
					if(newVal !== oldVal){
						console.log("new val (list-view)");
						scope.listViewSrc = newVal;
					}
				}
			);

		/*	$timeout(function(){
		console.log("timeout fire");
		scope.listViewSrc.push({num: 6666});
	},3000);*/

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
				console.log(subArray);
				//angular.element('.tk-repeater').css({"-webkit-transform":"translate(0px,"+scrollTop+"px)"});
			});

			function appendRepeater(child,data){
				var tkRepeat = angular.element("<div class='tk-repeater' tk-repeat='"+child+" in "+data+"'></div>").html(template);
				elem.append($compile(tkRepeat)(scope));
				var totalHeight = elem[0].lastChild.offsetHeight * data.length;
				angular.element('.tk-repeater').wrap("<div class='virtual-container' style='height:"+totalHeight+";width:1px;'></div>");
			}
		}
	}
});